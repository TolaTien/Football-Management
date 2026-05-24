import cron from 'node-cron';
import { prisma } from '../config/prisma.js';
import { StatisticService } from '../modules/statistic/statistic.service.js';
import { sendEmail } from './email.js';

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
            const fifteenAgo = new Date( Date.now() - 15 * 60 * 1000);
            const cancelBooking = await prisma.booking.updateMany({ 
                where: { 
                    status: 'pending',
                    createdAt: { lt: fifteenAgo },
                    paymentStatus: 'pending'
                 },
                 data: {
                    status: 'rejected'
                 }
            });

            if(cancelBooking) console.log(`Đã hủy ${cancelBooking.count} do chưa thanh toán `)
        } catch(err: any){
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
