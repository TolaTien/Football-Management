import { StatusCodes } from "http-status-codes";
import { prisma } from "../../config/prisma.js";
import { ApiError } from "../../utils/ApiError.js";
import { bookingPitchForAdmin, BookPitchForUser, CancelBookingForUser, Payment } from "./booking.schema.js";
import { v4 as uuidv4 } from 'uuid';

export class BookingService {
    static async bookPitchForUser(dto: BookPitchForUser, userId: string){
        if(!await prisma.users.findUnique({ where: { userId}})) {
            throw new ApiError(StatusCodes.BAD_REQUEST, "Người dùng không tồn tại")
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
                const totalServices = newServices.reduce((sum, ser) => (sum + (ser.servicePriceAtBooking ?? 0)  * (ser.quantity ?? 0)), 0);

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
        // if (!dto.bookId) throw new ApiError(400, "Mã đơn đặt sân (bookId) là bắt buộc");
        
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
        const booking = await prisma.$transaction( async (tx) => {

            const booking = await tx.booking.create({
                data: {
                    userId: null,
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

                const totalServices = newServices.reduce((sum, ser) => (sum + (ser.servicePriceAtBooking ?? 0)  * (ser.quantity ?? 0)), 0);

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
