import { prisma } from "../../config/prisma.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApproveRequestUser, CancelBookingForAdmin, GetAllHistoryOfUser, RefundForUser, VerifyPaymentOfUser } from "./admin.schema.js";
import { v4 as uuidv4 } from 'uuid';
import { io } from "../../config/socket.js";

export class AdminService {
    static async approveRequestUser(dto: ApproveRequestUser) {
        const booking = await prisma.booking.findUnique({ where: { bookId: dto.bookId } });
        if (!booking) throw new ApiError(400, "Không tìm thấy đơn đặt sân");

        if (booking.status !== 'pending') {
            throw new ApiError(400, "Chỉ có thể phê duyệt đơn đặt sân ở trạng thái chờ duyệt");
        }

        const update = await prisma.$transaction(async (tx) => {
            const approvedBooking = await tx.booking.update({
                where: { bookId: dto.bookId },
                data: {
                    status: 'approved'
                }
            });


            await tx.notification.create({
                data: {
                    id: uuidv4(),
                    userId: booking.userId!,
                    type: "booking",
                    content: "Yêu cầu đặt sân của bạn đã được phê duyệt",
                    bookId: booking.bookId
                }
            });

            return approvedBooking;
        });

        if (booking.userId) {
            io.to(booking.userId).emit('newNotification', {
                type: "booking",
                content: "Yêu cầu đặt sân của bạn đã được phê duyệt",
                bookId: booking.bookId
            });
        }

        return update;
    }

    static async cancelBookingForAdmin(dto: CancelBookingForAdmin) {
        const booking = await prisma.booking.findUnique({ where: { bookId: dto.bookId } });
        if (!booking) throw new ApiError(400, "Không tìm thấy đơn đặt sân");

        if (booking.status === 'rejected') {
            throw new ApiError(400, "Đơn đặt sân này đã bị hủy từ trước");
        }

        const cancel = await prisma.$transaction(async (tx) => {
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
            for (const items of bookingServices) {
                if (items.quantity && items.serviceId) {
                    const item = await tx.services.findUnique({ where: { serviceId: items.serviceId } });
                    if (item) {
                        await tx.services.update({
                            where: { serviceId: item.serviceId },
                            data: { returned: (item.returned ?? 0) + items.quantity }
                        });
                    }
                }
            }


            await tx.notification.create({
                data: {
                    id: uuidv4(),
                    userId: booking.userId!,
                    type: "booking",
                    content: "Yêu cầu đặt sân của bạn đã bị hủy",
                    bookId: booking.bookId
                }
            });


            return cancel;
        });

        if (booking.userId) {
            io.to(booking.userId).emit('newNotification', {
                type: "booking",
                content: "Yêu cầu đặt sân của bạn đã bị hủy",
                bookId: booking.bookId
            });
        }
        return cancel;
    };

    static async refundForUser(dto: RefundForUser) {
        const booking = await prisma.booking.findUnique({
            where: { bookId: dto.bookId },
            include: { payments: true }
        });
        if (!booking) throw new ApiError(400, "Không tìm thấy đơn đặt sân");

        if (booking.status !== 'rejected') {
            throw new ApiError(400, "Chỉ có thể hoàn cọc cho đơn đã bị huỷ");
        }

        const update = await prisma.booking.update({
            where: { bookId: booking.bookId },
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
    };

    static async getAllHistoryOfUser(dto: GetAllHistoryOfUser, query: any) {
        const user = await prisma.users.findUnique({ where: { userId: dto.userId } });
        if (!user) throw new ApiError(400, "Không tìm thấy người dùng");

        const page = Number(query.page) || 1;
        const perpage = 10;
        const skip = (page - 1) * perpage;

        const history = await prisma.booking.findMany({
            where: { userId: user.userId },
            skip,
            take: perpage,
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                pitch: true,
                payments: true,
                bookingservices: {
                    include: {
                        services: true
                    }
                }
            }
        });

        const totalRequest = await prisma.booking.count({
            where: { userId: user.userId }
        });
        const numberPage = Math.ceil(totalRequest / perpage);

        return { history, pagination: { numberPage, page, totalRequest, perpage } };
    };

    static async verifyPaymentOfUser(dto: VerifyPaymentOfUser) {
        const booking = await prisma.booking.findUnique({ where: { bookId: dto.bookId } });
        if (!booking) throw new ApiError(400, "Không tìm thấy đơn đặt sân");

        const update = await prisma.$transaction(async (tx) => {

            const newPayment = await tx.payments.create({
                data: {
                    id: uuidv4(),
                    bookingId: booking.bookId,
                    type: 'deposit',
                    amount: (booking.pitchPriceAtBooking ?? 0) / 2,
                    paymentMethod: dto.paymentMethod
                }
            });

            const updateBooking = await tx.booking.update({
                where: { bookId: booking.bookId },
                data: {
                    paymentStatus: 'paid',
                    total: (booking.total ?? 0) + ((booking.pitchPriceAtBooking ?? 0) / 2)
                },
                include: {
                    bookingservices: true,
                    payments: true
                }
            });

            for (const items of updateBooking.bookingservices) {
                if (items.quantity && items.serviceId) {
                    const item = await tx.services.findUnique({ where: { serviceId: items.serviceId } });
                    if (item) {
                        await tx.services.update({
                            where: { serviceId: item.serviceId },
                            data: { returned: (item.returned ?? 0) + items.quantity }
                        });
                    }
                }
            };

            return updateBooking;
        });

        return update;
    }
}
