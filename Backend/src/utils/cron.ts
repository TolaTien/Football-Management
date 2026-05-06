import cron from 'node-cron';
import { prisma } from '../config/prisma.js';

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
}