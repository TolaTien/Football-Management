import { prisma } from "../../config/prisma.js";

export interface GetMonthlyRevenueDto {
    month: number;
    year: number;
}

export class StatisticService {
    static async getMonthlyRevenue(dto: GetMonthlyRevenueDto) {
        const { month, year } = dto;

        const daysInMonth = new Date(year, month, 0).getDate();

        const dailyRevenueList = [];
        let totalMonthlyRevenue = 0;

        for (let day = 1; day <= daysInMonth; day++) {
            const startOfDay = new Date(year, month - 1, day, 0, 0, 0); 
            startOfDay.setHours(startOfDay.getHours() - 7); 

            const endOfDay = new Date(year, month - 1, day, 23, 59, 59, 999); 
            endOfDay.setHours(endOfDay.getHours() - 7);

            const successRevenueData = await prisma.booking.aggregate({
                _sum: { total: true },
                where: {
                    status: 'approved',
                    paymentStatus: { in: ['paid', 'partial'] },
                    startTime: {
                        gte: startOfDay,
                        lte: endOfDay
                    }
                }
            });
            const successRevenue = successRevenueData._sum.total || 0;


            const penaltyRevenueData = await prisma.booking.aggregate({
                _sum: { pitchPriceAtBooking: true },
                where: {
                    status: 'rejected',
                    paymentStatus: 'partial',
                    startTime: {
                        gte: startOfDay,
                        lte: endOfDay
                    }
                }
            });

            const penaltyRevenue = (penaltyRevenueData._sum.pitchPriceAtBooking || 0) / 2;
            const totalDailyRevenue = successRevenue + penaltyRevenue;
            totalMonthlyRevenue += totalDailyRevenue;

            dailyRevenueList.push({
                date: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
                successRevenue: successRevenue,
                penaltyRevenue: penaltyRevenue,
                totalRevenue: totalDailyRevenue
            });
        }

        return {
            month: month,
            year: year,
            totalMonthlyRevenue: totalMonthlyRevenue,
            details: dailyRevenueList
        };
    }
}
