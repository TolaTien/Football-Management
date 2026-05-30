import cron from 'node-cron';
import { prisma } from '../config/prisma.js';
import { StatisticService } from '../modules/statistic/statistic.service.js';
import { sendEmail } from './email.js';
import { v4 as uuidv4 } from 'uuid';


const formatCurrency = (value: number) => {
    return value.toLocaleString('vi-VN') + 'VNĐ';
};

const getPreviousMonth = (date: Date) => {
    const previousMonthDate = new Date(date.getFullYear(), date.getMonth() - 1, 1);

    return {
        month: previousMonthDate.getMonth() + 1,
        year: previousMonthDate.getFullYear(),
    };
};

const buildMonthlyRevenueEmailHtml = (summary: {
    month?: number;
    year?: number;
    totalRevenue: number;
    totalBookings: number;
    rate: number;
}) => {
    return `
        <div style="font-family: Arial, sans-serif; color: #1f2937; line-height: 1.6;">
            <h2 style="margin-bottom: 8px;">Báo cáo doanh thu tháng ${summary.month}/${summary.year}</h2>
            <p style="margin-top: 0;">Dưới đây là tóm tắt kết quả kinh doanh của tháng trước.</p>

            <table style="border-collapse: collapse; min-width: 360px;">
                <tbody>
                    <tr>
                        <td style="padding: 8px 12px; border: 1px solid #d1d5db;"><strong>Tổng doanh thu</strong></td>
                        <td style="padding: 8px 12px; border: 1px solid #d1d5db;">${formatCurrency(summary.totalRevenue)}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 12px; border: 1px solid #d1d5db;"><strong>Tổng booking thành công</strong></td>
                        <td style="padding: 8px 12px; border: 1px solid #d1d5db;">${summary.totalBookings}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 12px; border: 1px solid #d1d5db;"><strong>Tỷ lệ lấp đầy</strong></td>
                        <td style="padding: 8px 12px; border: 1px solid #d1d5db;">${summary.rate}%</td>
                    </tr>
                </tbody>
            </table>

            <p>File Excel chi tiết đã được đính kèm trong email này.</p>
            <p>Trân trọng,<br/>Hệ thống Sân Bóng Văn Tiến</p>
        </div>
    `;
};

export const startCron = () => {
    cron.schedule('*/5 * * * *', async () => {
        try {
            const fifteenAgo = new Date(Date.now() - 15 * 60 * 1000);
            const cancelBooking = await prisma.$transaction(async (tx) => {
                const expiredBookings = await tx.booking.findMany({
                    where: {
                        status: 'pending',
                        createdAt: { lt: fifteenAgo },
                        paymentStatus: 'pending'
                    },
                    select: {
                        bookId: true,
                        userId: true
                    }
                });

                if (expiredBookings.length === 0) {
                    return { count: 0 };
                }

                const notifications: Array<{
                    id: string;
                    userId: string;
                    type: "booking";
                    content: string;
                    bookId: string;
                }> = [];
                let cancelCount = 0;

                for (const booking of expiredBookings) {
                    const update = await tx.booking.updateMany({
                        where: {
                            bookId: booking.bookId,
                            status: 'pending',
                            paymentStatus: 'pending'
                        },
                        data: {
                            status: 'rejected'
                        }
                    });

                    if (update.count > 0) {
                        cancelCount += update.count;

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

                        if (booking.userId) {
                            notifications.push({
                                id: uuidv4(),
                                userId: booking.userId,
                                type: "booking" as const,
                                content: "Yêu cầu đặt sân của bạn đã bị hủy do chưa thanh toán sau 15 phút",
                                bookId: booking.bookId
                            });
                        }
                    }
                }

                if (notifications.length > 0) {
                    await tx.notification.createMany({ data: notifications });
                }

                return { count: cancelCount };
            });

            if (cancelBooking.count > 0) console.log(`Đã hủy ${cancelBooking.count} do chưa thanh toán `)
        } catch (err: any) {
            console.error("Lỗi khi chạy cron hủy booking: ", err);
        }
    })

    cron.schedule('0 8 1 * *', async () => {
        try {
            const { month, year } = getPreviousMonth(new Date());
            const admins = await prisma.users.findMany({
                where: { role: 'admin' },
                select: { email: true },
            });

            const { summary, excelBuffer } = await StatisticService.dataForEmailReport({
                month,
                year,
            });

            const html = buildMonthlyRevenueEmailHtml(summary);

            await Promise.all(
                admins.map((admin) => {
                    return sendEmail(
                        admin.email,
                        `Báo cáo doanh thu tháng ${month}/${year}`,
                        html,
                        [
                            {
                                filename: `Bao_Cao_Doanh_Thu_Thang_${month}_${year}.xlsx`,
                                content: Buffer.from(excelBuffer),
                            },
                        ],
                    );
                }),
            );

            console.log(`Đã gửi báo cáo doanh thu tháng ${month}/${year} cho ${admins.length} admin.`);
        } catch (err) {
            console.error('Lỗi khi gửi báo cáo doanh thu tháng:', err);
        }
    })
}
