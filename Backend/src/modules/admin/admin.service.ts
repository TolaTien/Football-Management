import { prisma } from "../../config/prisma.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApproveRequestUser, cancelBookingForAdmin, refundForUser } from "./admin.schema.js";


export class AdminService {
    static async approveRequestUser(dto: ApproveRequestUser) {
        const booking = await prisma.booking.findUnique({ where: { bookId: dto.bookId }});
        if(!booking) throw new ApiError(400, "Không tìm thấy đơn đặt sân");

        if (booking.status !== 'pending') {
            throw new ApiError(400, "Chỉ có thể phê duyệt đơn đặt sân ở trạng thái chờ duyệt");
        }

        const update = await prisma.booking.update({
            where: { bookId: dto.bookId},
            data: {
                status: 'approved'
            }
        });

        return update;
    }

    static async cancelBookingForAdmin(dto: cancelBookingForAdmin){
        const booking = await prisma.booking.findUnique({ where: {bookId: dto.bookId}});
        if(!booking) throw new ApiError(400, "Không tìm thấy đơn đặt sân");

        if (booking.status === 'rejected') {
            throw new ApiError(400, "Đơn đặt sân này đã bị hủy từ trước");
        }

        return prisma.$transaction(async (tx) => {
            let cancel;

            if (booking.paymentStatus === 'partial') {
                cancel = await tx.booking.update({
                    where: { bookId: booking.bookId },
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
            } else {
                cancel = await tx.booking.update({
                    where: { bookId: booking.bookId },
                    data: {
                        status: 'rejected'
                    }
                });
            }

            
            const bookingServices = await tx.bookingservices.findMany({ where: { bookId: booking.bookId } });
            for (const bs of bookingServices) {
                if (bs.quantity && bs.serviceId) {
                    const item = await tx.services.findUnique({ where: { serviceId: bs.serviceId } });
                    if (item) {
                        await tx.services.update({
                            where: { serviceId: item.serviceId },
                            data: { borrowed: (item.borrowed ?? 0) - bs.quantity }
                        });
                    }
                }
            }

            return cancel;
        });
    };

    static async refundForUser(dto: refundForUser){
        const booking = await prisma.booking.findUnique({ 
            where: { bookId: dto.bookId },
            include: { payments: true }
        });
        if(!booking) throw new ApiError(400, "Không tìm thấy đơn đặt sân");
        
        if (booking.status !== 'rejected') {
            throw new ApiError(400, "Chỉ có thể hoàn cọc cho đơn đã bị huỷ");
        }

        const update = await prisma.booking.update({
            where: { bookId:  booking.bookId},
            data: {
                paymentStatus: 'pending', 
                payments: {
                    updateMany: {
                        where: { type: 'pending' },
                        data: { type: 'refund' },
                    }
                }
            }
        });

        return update;
    }
}