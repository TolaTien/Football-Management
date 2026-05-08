import { StatusCodes } from "http-status-codes";
import { prisma } from "../../config/prisma.js";
import { ApiError } from "../../utils/ApiError.js";
import { BookPitchForUser, CancelBookingForUser, Payment } from "./booking.schema.js";
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
            if(dto.service && dto.service.length > 0){
                //Note: duyệt mảng service để check xem trong kho còn đủ sp không
                for (const item of dto.service) {
                    const svc = await tx.services.findUnique({ where: { serviceId: item.serviceId }});
                    if (!svc) {
                        throw new ApiError(StatusCodes.BAD_REQUEST, `Dịch vụ không tồn tại`);
                    }
                    const available = (svc.totalQuantity ?? 0) - (svc.borrowed ?? 0) + (svc.returned ?? 0);
                    if (available < item.quantity) {
                        throw new ApiError(StatusCodes.BAD_REQUEST, `Dịch vụ ${svc.nameProduct} tạm hết hàng`);
                    }
                    
                    await tx.services.update({
                        where: { serviceId: item.serviceId },
                        data: { borrowed: (svc.borrowed ?? 0) + item.quantity }
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
        const booking = await prisma.booking.findUnique({ where: { bookId: dto.bookId}});
        const user = await prisma.users.findUnique({ where: { userId} });

        if(!user) throw new ApiError(400, "Không tìm thấy user");
        if(!booking) throw new ApiError(400, "Không tìm thấy hóa đơn");
        if(booking.status === 'rejected') throw new ApiError(400, "Đơn đã bị hủy trước đó");

        const hoursBeforeStart = (booking.startTime!.getTime() - Date.now()) / (1000 * 60 * 60);
        const canRefundDeposit = hoursBeforeStart > 24;
        if (booking.paymentStatus === "pending" || ( booking.paymentStatus === "partial" && !canRefundDeposit )) {
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

        if (booking.paymentStatus === "partial" && canRefundDeposit) {

            return prisma.$transaction(async (tx) => {
                const bookingUpdate = await tx.booking.update({
                    where: { bookId: dto.bookId },
                    data: { 
                        status: 'rejected',
                        payments: {
                            updateMany: {
                                where: { type: 'deposit' },
                                data: { type: 'refund' }
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
            })
        }

        throw new ApiError(StatusCodes.BAD_REQUEST, "Trạng thái thanh toán không hỗ trợ hủy đơn");
    }
}
