import { StatusCodes } from "http-status-codes";
import { prisma } from "../../config/prisma.js";
import { ApiError } from "../../utils/ApiError.js";
import { bookingPitchForAdmin, BookPitchForUser, CancelBookingForUser, Payment } from "./booking.schema.js";
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';

export class BookingService {
    static async bookPitchForUser(dto: BookPitchForUser, userId: string){
        if(!await prisma.users.findUnique({ where: { userId}})) {
            throw new ApiError(StatusCodes.BAD_REQUEST, "Người dùng không tồn tại")
        }

        const checkBooked = await prisma.booking.findFirst({
            where: {
                pitchId: dto.pitchId,
                status: { in: ['pending', 'approved'] },
                AND: [
                    { startTime: { lt: dto.endTime }},
                    { endTime: { gt: dto.startTime }}
                ]
            }
        });

        if (checkBooked) {
            throw new ApiError(StatusCodes.BAD_REQUEST, "Sân đã được đặt trong khoảng thời gian này");
        }

        const booking = await prisma.$transaction( async (tx) => {

            const booking = await tx.booking.create({
                data: {
                    bookId: uuidv4(),
                    userId: userId,
                    pitchId: dto.pitchId,
                    phone: dto.phone,
                    status: 'pending',
                    startTime: dto.startTime,
                    endTime: dto.endTime,
                    paymentStatus: 'pending',
                    pitchPriceAtBooking: dto.pitchPriceAtBooking,
                    total: 0,
                }
            });

            let newServices;
            let totalServices = 0;
            if(dto.service?.length > 0){
                //Note: duyệt mảng service để check xem trong kho còn đủ sp không
                for (const items of dto.service) {
                    const item = await tx.services.findUnique({ where: { serviceId: items.serviceId }});
                    if (!item) {
                        throw new ApiError(StatusCodes.BAD_REQUEST, `Dịch vụ không tồn tại`);
                    }
                    const available = (item.totalQuantity ?? 0) - (item.borrowed ?? 0) + (item.returned ?? 0);
                    if (available < items.quantity) {
                        throw new ApiError(StatusCodes.BAD_REQUEST, `Dịch vụ ${item.nameProduct} tạm hết hàng`);
                    }
                    
                    await tx.services.update({
                        where: { serviceId: items.serviceId },
                        data: { borrowed: (item.borrowed ?? 0) + items.quantity }
                    });

                    totalServices += (items.servicePriceAtBooking ?? 0) * (items.quantity ?? 0);
                };

                 newServices =  await Promise.all(dto.service.map((x) => {
                      return tx.bookingservices.create({
                        data: {
                            id: uuidv4(),
                            bookId: booking.bookId,
                            serviceId: x.serviceId,
                            quantity: x.quantity ,
                            servicePriceAtBooking: x.servicePriceAtBooking 
                        }
                    })
                }));
                const updatedBooking = await tx.booking.update({
                    where: { bookId: booking.bookId},
                    data: {total: (booking.pitchPriceAtBooking ?? 0) / 2 + totalServices}
                });
                return { booking: updatedBooking, newServices }
            };
            return { booking, newServices}
        });

        return booking;
    };

    static async partialPayment(dto: Payment){
        const newPayment = await prisma.payments.create({
            data: {
                id: uuidv4(),
                bookingId: dto.bookingId,
                type: 'deposit',
                amount: dto.amount,
                paymentMethod: dto.paymentMethod,
            }
        });
        const updateBooking = await prisma.booking.update({
            where: { bookId: dto.bookingId},
            data: {paymentStatus: 'partial'}
        });

        return { newPayment, updateBooking};
    };

    static async cancelBookingForUser(dto: CancelBookingForUser, userId: string){
        
        const booking = await prisma.booking.findUnique({ where: { bookId: dto.bookId}});
        const user = await prisma.users.findUnique({ where: { userId} });

        if(!user) throw new ApiError(400, "Không tìm thấy user");
        if(!booking) throw new ApiError(400, "Không tìm thấy hóa đơn");
        if(booking.status === 'rejected') throw new ApiError(400, "Đơn đã bị hủy trước đó");

        const hoursBeforeStart = (booking.startTime!.getTime() - Date.now()) / (1000 * 60 * 60);
        const isRefund = hoursBeforeStart > 24;
        if (booking.paymentStatus === "pending" || ( booking.paymentStatus === "partial" && !isRefund )) {
            return prisma.$transaction(async (tx) => {
                const bookingUpdate = await tx.booking.update({
                    where: { bookId: dto.bookId },
                    data: { status: 'rejected' }
                });

                const cancelRequest = await tx.cancelrequests.create({
                    data: {
                        id: uuidv4(),
                        userId,
                        bookId: dto.bookId,
                        content: dto.content
                    }
                });

                return { bookingUpdate, cancelRequest };
            });
        }

        if (booking.paymentStatus === "partial" && isRefund) {

            return prisma.$transaction(async (tx) => {
                const bookingUpdate = await tx.booking.update({
                    where: { bookId: dto.bookId },
                    data: { 
                        status: 'rejected',
                        payments: {
                            updateMany: {
                                where: { type: 'deposit' },
                                data: { type: 'pending' }
                            }
                        }
                    }
                });


                const cancelRequest = await tx.cancelrequests.create({
                    data: {
                        id: uuidv4(),
                        userId,
                        bookId: dto.bookId,
                        content: dto.content
                    }
                });

                return { bookingUpdate, cancelRequest};
            })
        }
    };

    static async bookingPitchForAdmin(dto: bookingPitchForAdmin){
        const checkBooked = await prisma.booking.findFirst({
            where: {
                pitchId: dto.pitchId,
                status: { in: ['pending', 'approved'] },
                AND: [
                    { startTime: { lt: dto.endTime } },
                    { endTime: { gt: dto.startTime } }
                ]
            }
        });

        if (checkBooked) {
            throw new ApiError(StatusCodes.BAD_REQUEST, "Sân đã được đặt trong khoảng thời gian này");
        }

        const booking = await prisma.$transaction( async (tx) => {
            let targetUserId = null;

            if (dto.phone) {
                const existingUser = await tx.users.findFirst({ where: { phone: dto.phone } });
                if (existingUser) {
                    targetUserId = existingUser.userId;
                } else {
                    const salt = await bcrypt.genSalt(12);
                    const hashPassword = await bcrypt.hash(uuidv4(), salt);

                    const shadowUser = await tx.users.create({
                        data: {
                            userId: uuidv4(),
                            email: `guest_${dto.phone}@gmail.com`,
                            password: hashPassword,
                            fullName: `Khách vãng lai ${dto.phone}`,
                            phone: dto.phone,
                            role: 'user'
                        }
                    });
                    targetUserId = shadowUser.userId;
                }
            }

            const booking = await tx.booking.create({
                data: {
                    userId: targetUserId,
                    bookId: uuidv4(),
                    pitchId: dto.pitchId,
                    phone: dto.phone,
                    status: 'approved',
                    startTime: dto.startTime,
                    endTime: dto.endTime,
                    paymentStatus: 'partial',
                    pitchPriceAtBooking: dto.pitchPriceAtBooking,
                    total: dto.pitchPriceAtBooking / 2
                }
            });
            
            let newServices;
            let totalServices = 0;
            if( dto.service?.length >0){
                for(const items of dto.service){
                    const item = await tx.services.findUnique({ where: { serviceId: items.serviceId}});
                    if(!item) throw new ApiError(400, "Không tìm thấy sản phẩm");
                    
                    const available = (item.totalQuantity ?? 0) - (item.borrowed ?? 0) + (item.returned ?? 0);
                    if(items.quantity > available) throw new ApiError(400, `Dịch vụ ${item.nameProduct} tạm thời hết hàng`);

                    await tx.services.update({
                        where: { serviceId: item.serviceId},
                        data: { borrowed: (item.borrowed ?? 0) + items.quantity }
                    });

                    totalServices += (items.servicePriceAtBooking ?? 0) * (items.quantity ?? 0);
                };

                newServices =  await Promise.all(dto.service.map((x) => {
                      return tx.bookingservices.create({
                        data: {
                            id: uuidv4(),
                            bookId: booking.bookId,
                            serviceId: x.serviceId,
                            quantity: x.quantity ,
                            servicePriceAtBooking: x.servicePriceAtBooking 
                        }
                    })
                }));

                const updatedBooking = await tx.booking.update({
                    where: { bookId: booking.bookId},
                    data: {total: (booking.pitchPriceAtBooking ?? 0) / 2 + totalServices}
                });

                return { booking: updatedBooking, newServices}
            };
        });
        return booking
        
    };
}
