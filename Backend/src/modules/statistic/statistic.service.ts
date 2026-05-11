// import { prisma } from "../../config/prisma.js";
// import { StatisticForAdmin } from "./statistic.schema.js";

// export class StatisticService {
//     static async getMonthlyRevenue(dto: StatisticForAdmin & { address?: string }) {
//         const { month, year, address } = dto;

//         const daysInMonth = new Date(year, month, 0).getDate();

//         const dailyRevenueList = [];
//         let totalMonthlyRevenue = 0;
//         let totalMonthlyBookings = 0;

//         // Lấy tổng số sân theo từng khu vực (address)
//         const pitchesCountByAddress = await prisma.pitch.groupBy({
//             by: ['address'],
//             where: { 
//                 status: 'active',
//                 address: address ? { contains: address } : undefined
//             },
//             _count: { pitchId: true }
//         });

//         const totalPitches = pitchesCountByAddress.reduce((sum, item) => sum + item._count.pitchId, 0);

//         for (let day = 1; day <= daysInMonth; day++) {
//             const startOfDay = new Date(year, month - 1, day, 0, 0, 0); 
//             startOfDay.setHours(startOfDay.getHours() - 7); 

//             const endOfDay = new Date(year, month - 1, day, 23, 59, 59, 999); 
//             endOfDay.setHours(endOfDay.getHours() - 7);

//             const successBookings = await prisma.booking.findMany({
//                 where: {
//                     status: 'approved',
//                     paymentStatus: { in: ['paid', 'partial'] },
//                     startTime: {
//                         gte: startOfDay,
//                         lte: endOfDay
//                     },
//                     pitch: address ? { address: { contains: address } } : undefined
//                 },
//                 include: {
//                     pitch: {
//                         select: { address: true }
//                     }
//                 }
//             });

//             const successRevenue = successBookings.reduce((sum, b) => sum + (b.total || 0), 0);
            
//             // Tính tỉ lệ lấp đầy theo từng khu vực (address)
//             const occupancyByAddress = pitchesCountByAddress.map(addr => {
//                 const uniquePitchesInAddr = new Set(
//                     successBookings
//                         .filter(b => b.pitch?.address === addr.address)
//                         .map(b => b.pitchId)
//                 ).size;

//                 return {
//                     address: addr.address || "Chưa xác định",
//                     totalPitches: addr._count.pitchId,
//                     bookedPitches: uniquePitchesInAddr,
//                     rate: addr._count.pitchId > 0 ? parseFloat(((uniquePitchesInAddr / addr._count.pitchId) * 100).toFixed(2)) : 0
//                 };
//             });

//             const totalUniquePitchesBooked = new Set(successBookings.map(b => b.pitchId)).size;

//             const penaltyRevenueData = await prisma.booking.aggregate({
//                 _sum: { pitchPriceAtBooking: true },
//                 where: {
//                     status: 'rejected',
//                     paymentStatus: 'partial',
//                     startTime: {
//                         gte: startOfDay,
//                         lte: endOfDay
//                     },
//                     pitch: address ? { address: { contains: address } } : undefined
//                 }
//             });

//             const penaltyRevenue = (penaltyRevenueData._sum.pitchPriceAtBooking || 0) / 2;
//             const totalDailyRevenue = successRevenue + penaltyRevenue;
            
//             totalMonthlyRevenue += totalDailyRevenue;
//             totalMonthlyBookings += successBookings.length;

//             dailyRevenueList.push({
//                 date: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
//                 successRevenue,
//                 penaltyRevenue,
//                 totalRevenue: totalDailyRevenue,
//                 bookingCount: successBookings.length,
//                 totalOccupancyRate: totalPitches > 0 ? parseFloat(((totalUniquePitchesBooked / totalPitches) * 100).toFixed(2)) : 0,
//                 occupancyByAddress
//             });
//         }

//         return {
//             month: month,
//             year: year,
//             filteredAddress: address || "All",
//             totalMonthlyRevenue,
//             totalMonthlyBookings,
//             details: dailyRevenueList
//         };
//     }

//     static async getTopSpenders(address?: string) {
//         const todayStart = new Date();
//         todayStart.setHours(0, 0, 0, 0);

//         const spenders = await prisma.booking.groupBy({
//             by: ['userId'],
//             where: {
//                 status: 'approved',
//                 createdAt: { lt: todayStart },
//                 userId: { not: null },
//                 pitch: address ? { address: { contains: address } } : undefined
//             },
//             _sum: {
//                 total: true
//             },
//             orderBy: {
//                 _sum: {
//                     total: 'desc'
//                 }
//             },
//             take: 10
//         });

//         const userIds = spenders.map(s => s.userId as string);
//         const users = await prisma.users.findMany({
//             where: { userId: { in: userIds } },
//             select: {
//                 userId: true,
//                 fullName: true,
//                 avt: true,
//                 email: true,
//                 phone: true
//             }
//         });

//         return spenders.map(s => {
//             const user = users.find(u => u.userId === s.userId);
//             return {
//                 userId: s.userId,
//                 fullName: user?.fullName,
//                 avt: user?.avt,
//                 email: user?.email,
//                 phone: user?.phone,
//                 totalSpent: s._sum.total || 0
//             };
//         });
//     }

//     static async getSystemOverview(address?: string) {
//         const todayStart = new Date();
//         todayStart.setHours(0, 0, 0, 0);

//         const [totalUsers, totalPitches, totalPendingRequests, revenueData, pitchesByAddress] = await Promise.all([
//             prisma.users.count({ where: { createdAt: { lt: todayStart } } }),
//             prisma.pitch.count({ 
//                 where: { 
//                     createdAt: { lt: todayStart },
//                     address: address ? { contains: address } : undefined
//                 } 
//             }),
//             prisma.booking.count({ 
//                 where: { 
//                     status: 'pending',
//                     pitch: address ? { address: { contains: address } } : undefined
//                 } 
//             }),
//             prisma.booking.aggregate({
//                 _sum: { total: true },
//                 where: {
//                     status: 'approved',
//                     createdAt: { lt: todayStart },
//                     pitch: address ? { address: { contains: address } } : undefined
//                 }
//             }),
//             prisma.pitch.groupBy({
//                 by: ['address'],
//                 where: { 
//                     status: 'active',
//                     address: address ? { contains: address } : undefined
//                 },
//                 _count: { pitchId: true }
//             })
//         ]);

//         return {
//             totalUsers: address ? "N/A (Filtered by address)" : totalUsers,
//             totalPitches,
//             totalPendingRequests,
//             totalRevenue: revenueData._sum.total || 0,
//             pitchesByAddress: pitchesByAddress.map(p => ({
//                 address: p.address || "N/A",
//                 count: p._count.pitchId
//             })),
//             updatedAt: todayStart
//         };
//     }

//     static async getRevenueByPitch(address?: string) {
//         const pitchRevenue = await prisma.booking.groupBy({
//             by: ['pitchId'],
//             where: {
//                 status: 'approved',
//                 paymentStatus: { in: ['paid', 'partial'] },
//                 pitch: address ? { address: { contains: address } } : undefined
//             },
//             _sum: {
//                 total: true
//             }
//         });

//         const pitches = await prisma.pitch.findMany({
//             where: {
//                 address: address ? { contains: address } : undefined
//             },
//             select: {
//                 pitchId: true,
//                 namePitch: true,
//                 address: true
//             }
//         });

//         return pitchRevenue.map(rev => {
//             const pitch = pitches.find(p => p.pitchId === rev.pitchId);
//             return {
//                 pitchId: rev.pitchId,
//                 namePitch: pitch?.namePitch || "N/A",
//                 address: pitch?.address || "N/A",
//                 totalRevenue: rev._sum.total || 0
//             };
//         }).sort((a, b) => b.totalRevenue - a.totalRevenue);
//     }
// }
