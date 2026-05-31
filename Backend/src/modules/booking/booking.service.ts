import { prisma } from "../../config/prisma.js";
import { ApiError } from "../../utils/ApiError.js";
import { bookingPitchForAdmin, BookPitchForUser, CancelBookingForUser, Payment } from "./booking.schema.js";
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import { io } from "../../config/socket.js";

export class BookingService {
    private static getMinuteOfDay(date: Date) {
        return date.getHours() * 60 + date.getMinutes();
    }

    private static async calculatePitchPriceAtBooking(
        pitchId: string,
        startTime: Date,
        endTime: Date
    ) {
        const bookingStart = BookingService.getMinuteOfDay(startTime);
        let bookingEnd = BookingService.getMinuteOfDay(endTime);
        if (endTime > startTime && bookingEnd <= bookingStart) {
            bookingEnd += 24 * 60;
        }

        const priceRules = await prisma.pitchprice.findMany({
            where: { pitchId },
            orderBy: { startTime: 'asc' }
        });

        const validRules = priceRules
            .flatMap((rule) => {
                let start = BookingService.getMinuteOfDay(rule.startTime!);
                let end = BookingService.getMinuteOfDay(rule.endTime!);
                if (rule.endTime! > rule.startTime! && end <= start) {
                    end += 24 * 60;
                }
                return [
                    { start: start - 24 * 60, end: end - 24 * 60, price: rule.price! },
                    { start, end, price: rule.price! },
                    { start: start + 24 * 60, end: end + 24 * 60, price: rule.price! }
                ];
            })
            .filter((rule) => rule.end > rule.start);

        if (validRules.length === 0) {
            throw new ApiError(400, "Sân chưa có cấu hình giá");
        }

        let cursor = bookingStart;
        let total = 0;

        while (cursor < bookingEnd) {
            const rule = validRules.find((item) => item.start <= cursor && item.end > cursor);
            if (!rule) {
                throw new ApiError(400, "Khung giờ đặt sân chưa có cấu hình giá đầy đủ");
            }

            const segmentEnd = Math.min(rule.end, bookingEnd);
            total += (rule.price * (segmentEnd - cursor)) / 60;
            cursor = segmentEnd;
        }

        return Math.round(total);
    }

    static async bookPitchForUser(dto: BookPitchForUser, userId: string) {
        const user = await prisma.users.findUnique({ where: { userId } })
        if (!user) {
            throw new ApiError(400, "Người dùng không tồn tại")
        }

        const startTime = new Date(dto.startTime);
        const endTime = new Date(dto.endTime);

        const booking = await prisma.$transaction(async (tx) => {
            const pitch = await tx.pitch.findUnique({ where: { pitchId: dto.pitchId } });
            if (!pitch) {
                throw new ApiError(400, "Sân không tồn tại");
            }

            const checkBooked = await tx.booking.findFirst({
                where: {
                    pitchId: dto.pitchId,
                    status: { in: ['pending', 'approved'] },
                    AND: [
                        { startTime: { lt: endTime } },
                        { endTime: { gt: startTime } }
                    ]
                }
            });

            if (checkBooked) {
                throw new ApiError(400, "Sân đã được đặt trong khoảng thời gian này");
            }

            const pitchPriceAtBooking = await BookingService.calculatePitchPriceAtBooking(
                dto.pitchId,
                startTime,
                endTime
            );
            const bookingDeposit = Math.floor(pitchPriceAtBooking / 2);

            const booking = await tx.booking.create({
                data: {
                    bookId: uuidv4(),
                    userId: userId,
                    pitchId: dto.pitchId,
                    phone: dto.phone,
                    status: 'pending',
                    startTime,
                    endTime,
                    paymentStatus: 'pending',
                    pitchPriceAtBooking,
                    total: bookingDeposit,
                }
            });

            const bookingServices = dto.service ?? [];
            let totalServices = 0;
            if (bookingServices.length > 0) {
                //Note: duyệt mảng service để check xem trong kho còn đủ sp không
                for (const items of bookingServices) {
                    const item = await tx.services.findUnique({ where: { serviceId: items.serviceId } });
                    if (!item) {
                        throw new ApiError(400, `Dịch vụ không tồn tại`);
                    }
                    const available = (item.totalQuantity ?? 0) - (item.borrowed ?? 0) + (item.returned ?? 0);
                    if (available < items.quantity) {
                        throw new ApiError(400, `Dịch vụ ${item.nameProduct} tạm hết hàng`);
                    }

                    await tx.services.update({
                        where: { serviceId: items.serviceId },
                        data: { borrowed: (item.borrowed ?? 0) + items.quantity }
                    });

                    totalServices += (items.servicePriceAtBooking ?? 0) * (items.quantity ?? 0);
                };

                await Promise.all(bookingServices.map((x) => {
                    return tx.bookingservices.create({
                        data: {
                            id: uuidv4(),
                            bookId: booking.bookId,
                            serviceId: x.serviceId,
                            quantity: x.quantity,
                            servicePriceAtBooking: x.servicePriceAtBooking
                        }
                    })
                }));
            };

            const updatedBooking = await tx.booking.update({
                where: { bookId: booking.bookId },
                data: { total: bookingDeposit + totalServices }
            });

            const admins = await tx.users.findMany({
                where: { role: 'admin' },
                select: { userId: true }
            });


            const adminNotifications = admins.map((admin) => ({
                id: uuidv4(),
                userId: admin.userId,
                type: "booking" as const,
                content: `${user.fullName} đã gửi 1 yêu cầu đặt sân`,
                bookId: booking.bookId
            }));

            await tx.notification.createMany({
                data: [
                    ...adminNotifications,
                    {
                        id: uuidv4(),
                        userId,
                        type: "booking" as const,
                        content: "Bạn đã gửi yêu cầu đặt sân thành công, vui lòng chờ admin phê duyệt",
                        bookId: booking.bookId
                    }
                ]
            });

            const order = await tx.booking.findUnique({
                where: { bookId: updatedBooking.bookId },
                include: {
                    users: {
                        select: {
                            fullName: true,
                            avt: true,
                            phone: true,
                            email: true
                        }
                    },
                    bookingservices: {
                        include: {
                            services: true
                        }
                    },
                    pitch: true,
                }
            });
            return order;
        });

        io.to('admins').emit('newNotification', {
            type: "booking",
            content: `${user.fullName} đã gửi 1 yêu cầu đặt sân`,
            bookId: booking?.bookId
        });

        return booking;
    };

    static async partialPayment(dto: Payment) {
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
            where: { bookId: dto.bookingId },
            data: { paymentStatus: 'partial' }
        });

        return { newPayment, updateBooking };
    };

    static async cancelBookingForUser(dto: CancelBookingForUser, userId: string) {

        const booking = await prisma.booking.findUnique({ where: { bookId: dto.bookId } });
        const user = await prisma.users.findUnique({ where: { userId } });

        if (!user) throw new ApiError(400, "Không tìm thấy user");
        if (!booking) throw new ApiError(400, "Không tìm thấy hóa đơn");
        if (booking.status === 'rejected') throw new ApiError(400, "Đơn đã bị hủy trước đó");

        const hoursBeforeStart = (booking.startTime!.getTime() - Date.now()) / (1000 * 60 * 60);
        const isRefund = hoursBeforeStart > 24;

        if (booking.paymentStatus === "pending" || (booking.paymentStatus === "partial" && !isRefund)) {
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

                const bookingServices = await tx.bookingservices.findMany({ where: { bookId: dto.bookId } });
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
                };

                return { bookingUpdate, cancelRequest };
            });
        }

        if (booking.paymentStatus === "partial" && isRefund) {

            const cancelBooking = await prisma.$transaction(async (tx) => {
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

                const bookingServices = await tx.bookingservices.findMany({ where: { bookId: dto.bookId } });
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

                const admins = await tx.users.findMany({
                    where: { role: 'admin' },
                    select: { userId: true }
                });

                const notifications = admins.map((admin) => ({
                    id: uuidv4(),
                    userId: admin.userId,
                    type: "payment" as const,
                    content: `${user.fullName} đã hủy sân và cần được hoàn tiền cọc`,
                    bookId: dto.bookId
                }));

                await tx.notification.createMany({ data: notifications });

                return { bookingUpdate, cancelRequest };
            });

            io.to('admins').emit('newNotification', {
                type: "payment",
                content: `${user.fullName} đã hủy sân và cần được hoàn tiền cọc`,
                bookId: dto.bookId
            });

            return cancelBooking;
        }
    };

    static async bookingPitchForAdmin(dto: bookingPitchForAdmin) {
        const startTime = new Date(dto.startTime);
        const endTime = new Date(dto.endTime);

        const checkBooked = await prisma.booking.findFirst({
            where: {
                pitchId: dto.pitchId,
                status: { in: ['pending', 'approved'] },
                AND: [
                    { startTime: { lt: endTime } },
                    { endTime: { gt: startTime } }
                ]
            }
        });

        if (checkBooked) {
            throw new ApiError(400, "Sân đã được đặt trong khoảng thời gian này");
        }

        const booking = await prisma.$transaction(async (tx) => {
            const pitch = await tx.pitch.findUnique({ where: { pitchId: dto.pitchId } });
            if (!pitch) {
                throw new ApiError(400, "Sân không tồn tại");
            }

            const pitchPriceAtBooking = await BookingService.calculatePitchPriceAtBooking(
                dto.pitchId,
                startTime,
                endTime
            );

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
                    startTime,
                    endTime,
                    paymentStatus: 'partial',
                    pitchPriceAtBooking,
                    total: Math.floor(pitchPriceAtBooking / 2)
                }
            });

            const bookingServices = dto.service ?? [];
            let newServices;
            let totalServices = 0;
            if (bookingServices.length > 0) {
                for (const items of bookingServices) {
                    const item = await tx.services.findUnique({ where: { serviceId: items.serviceId } });
                    if (!item) throw new ApiError(400, "Không tìm thấy sản phẩm");

                    const available = (item.totalQuantity ?? 0) - (item.borrowed ?? 0) + (item.returned ?? 0);
                    if (items.quantity > available) throw new ApiError(400, `Dịch vụ ${item.nameProduct} tạm thời hết hàng`);

                    await tx.services.update({
                        where: { serviceId: item.serviceId },
                        data: { borrowed: (item.borrowed ?? 0) + items.quantity }
                    });

                    totalServices += (items.servicePriceAtBooking ?? 0) * (items.quantity ?? 0);
                };

                newServices = await Promise.all(bookingServices.map((x) => {
                    return tx.bookingservices.create({
                        data: {
                            id: uuidv4(),
                            bookId: booking.bookId,
                            serviceId: x.serviceId,
                            quantity: x.quantity,
                            servicePriceAtBooking: x.servicePriceAtBooking
                        }
                    })
                }));

                const updatedBooking = await tx.booking.update({
                    where: { bookId: booking.bookId },
                    data: { total: (booking.pitchPriceAtBooking ?? 0) / 2 + totalServices }
                });

                return { booking: updatedBooking, newServices }
            };

            return { booking, newServices };
        });
        return booking
    };

    static async getAllRequestForAdmin(query: any) {
        const page = Number(query.page) || 1;
        const perpage = 10;
        const skip = (page - 1) * 10;

        const booking = await prisma.booking.findMany({
            where: { status: 'pending' },
            skip,
            take: perpage,
            orderBy: {
                createdAt: 'asc'
            },
            include: {
                users: {
                    select: {
                        userId: true,
                        fullName: true,
                        email: true,
                        phone: true,
                        avt: true
                    }
                },
                cancelrequests: true,
                pitch: true,
                bookingservices: {
                    include: { services: { select: { nameProduct: true } } }
                },
                payments: true
            }
        });

        const totalRequest = await prisma.booking.count({ where: { status: 'pending' } })
        const numberPage = Math.ceil(totalRequest / 10);
        return { booking, pagination: { numberPage, page, totalRequest, perpage } };
    }

}
