import { prisma } from "../../config/prisma.js";
import { GetRevenueInput, GetSystemOverview } from "./statistic.schema.js";

export class StatisticService {
    static async getMonthlyRevenue(dto: GetRevenueInput) {
        if (!dto.month && !dto.year && !dto.address) {
            const totalPitches = await prisma.pitch.count({
                where: { status: 'active'}
            });
            const successBookings = await prisma.booking.findMany({
                where: {
                    status: 'approved',
                    paymentStatus: { in: ['paid', 'partial'] },
                }
            });

            const successRevenue = successBookings.reduce((sum, b) => sum + (b.total || 0), 0);

            const penaltyRevenueData = await prisma.booking.aggregate({
                _sum: { pitchPriceAtBooking: true },
                where: {
                    status: 'rejected',
                    paymentStatus: 'partial',
                }
            });

            const penaltyRevenue = (penaltyRevenueData._sum.pitchPriceAtBooking || 0) / 2;
            const totalRevenue = successRevenue + penaltyRevenue;
            const fillRate = parseFloat(((successBookings.length/totalPitches) * 100).toFixed(2))
            return {
                month: dto.month ,
                year: dto.year ,
                filteredAddress: dto.address || "All",
                totalRevenue: totalRevenue,
                totalBookings: successBookings.length,
                rate: fillRate,
            };
        }

        ///

        const start = new Date(dto.year!, dto.month! - 1, 1, 0, 0, 0); 
        start.setHours(start.getHours() - 7); 

        const end = new Date(dto.year!, dto.month!, 0, 23, 59, 59, 999); 
        end.setHours(end.getHours() - 7);

        const pitchesCountByAddress = await prisma.pitch.groupBy({
            by: ['address'],
            where: { 
                status: 'active',
                address: dto.address ? { contains: dto.address } : undefined
            },
            _count: { pitchId: true }
        });

        const totalPitches = pitchesCountByAddress.reduce((sum, item) => sum + item._count.pitchId, 0);

        const successBookings = await prisma.booking.findMany({
            where: {
                status: 'approved',
                paymentStatus: { in: ['paid', 'partial'] },
                startTime: {
                    gte: start,
                    lte: end
                },
                pitch: dto.address ? { address: { contains: dto.address } } : undefined
            },
            include: {
                pitch: {
                    select: { address: true }
                }
            }
        });

        const successRevenue = successBookings.reduce((sum, b) => sum + (b.total || 0), 0);

        const penaltyRevenueData = await prisma.booking.aggregate({
            _sum: { pitchPriceAtBooking: true },
            where: {
                status: 'rejected',
                paymentStatus: 'partial',
                startTime: {
                    gte: start,
                    lte: end
                },
                pitch: dto.address ? { address: { contains: dto.address } } : undefined
            }
        });

        const penaltyRevenue = (penaltyRevenueData._sum.pitchPriceAtBooking || 0) / 2;
        const totalRevenue = successRevenue + penaltyRevenue;
        
        // Tính tỉ lệ lấp đầy theo từng khu vực (address)
        const occupancyByAddress = pitchesCountByAddress.map(addr => {
            const uniquePitchesInAddr = new Set(
                successBookings
                    .filter(b => b.pitch?.address === addr.address)
                    .map(b => b.pitchId)
            ).size;

            return {
                address: addr.address,
                totalPitches: addr._count.pitchId,
                bookedPitches: uniquePitchesInAddr,
                rate:  parseFloat(((uniquePitchesInAddr / addr._count.pitchId) * 100).toFixed(2)) 
            };
        });

        const totalUniquePitchesBooked = new Set(successBookings.map(b => b.pitchId)).size;
        const rate =  parseFloat(((totalUniquePitchesBooked / totalPitches) * 100).toFixed(2)) ;

        
        return {
            month: dto.month,
            year: dto.year,
            filteredAddress: dto.address || "All",
            totalRevenue,
            totalBookings: successBookings.length,
            rate,
            occupancyByAddress,
        };
    };

    static async getTopSpenders() {
        const spenders = await prisma.booking.groupBy({
            by: ['userId'],
            where: {
                status: 'approved',
                paymentStatus: { in: ['paid', 'partial'] },
            },
            _sum: {
                total: true
            },
            _count: {
                bookId: true
            },
            orderBy: {
                _sum: {
                    total: 'desc'
                }
            },
            take: 10
        });


        const userIds = spenders.map(s => s.userId).filter((id): id is string => id !== null);

        const users = await prisma.users.findMany({
            where: { userId: { in: userIds } },
            select: {
                userId: true,
                fullName: true,
                avt: true,
                email: true,
                phone: true
            }
        });

        return spenders.map((spender, index) => {
            const user = users.find((userData) => userData.userId === spender.userId);

            return {
                rank: index + 1,
                userId: spender.userId,
                fullName: user?.fullName,
                avt: user?.avt || null,
                email: user?.email || null,
                phone: user?.phone || null,
                bookingCount: spender._count.bookId,
                totalSpent: spender._sum.total || 0
            };
        });
    };

    static async getSystemOverview(dto: GetSystemOverview) {
        const pitchAddressFilter = dto.address ? { contains: dto.address } : undefined;

        const [totalUsers, totalPitches, totalPendingRequests] = await Promise.all([
            prisma.users.count(),
            prisma.pitch.count({
                where: {
                    status: 'active',
                    address: pitchAddressFilter,
                },
            }),
            prisma.booking.count({
                where: {
                    status: 'pending',
                    pitch: pitchAddressFilter ? { address: pitchAddressFilter } : undefined,
                },
            }),
        ]);

        return {
            filteredAddress: dto.address || "All",
            totalUsers,
            totalPitches,
            totalPendingRequests,
        };
    }
}
