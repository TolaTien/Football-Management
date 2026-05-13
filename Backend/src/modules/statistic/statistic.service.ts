import { prisma } from "../../config/prisma.js";
import { GetRevenueInput, GetSystemOverview } from "./statistic.schema.js";
import ExcelJS from 'exceljs'

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


    static async exportFileExcel(dto: GetRevenueInput) {
        let start: Date;
        let end: Date;

        if (dto.month && dto.year) {
            start = new Date(dto.year, dto.month - 1, 1, 0, 0, 0); 
            start.setHours(start.getHours() - 7); 
            end = new Date(dto.year, dto.month, 0, 23, 59, 59, 999); 
            end.setHours(end.getHours() - 7);
        } else {
            start = new Date(2000, 0, 1);
            end = new Date(2100, 11, 31);
        }

        const whereCondition: any = {
            status: { in: ['approved', 'rejected'] },
            startTime: {
                gte: start,
                lte: end
            },
            pitch: dto.address ? { address: { contains: dto.address } } : undefined
        };

        const bookings = await prisma.booking.findMany({
            where: whereCondition,
            include: {
                users: true,
                pitch: true,
                bookingservices: {
                    include: { services: true }
                },
                payments: true
            },
            orderBy: { startTime: 'asc' }
        });

        const workbook = new ExcelJS.Workbook();
        workbook.creator = 'Football Management System';
        const worksheet = workbook.addWorksheet('Báo Cáo Doanh Thu');

        
        const titleRow = worksheet.addRow(['BÁO CÁO DOANH THU SÂN BÓNG']);
        titleRow.font = { name: 'Arial', size: 16, bold: true };
        worksheet.mergeCells('A1:N1');
        titleRow.getCell(1).alignment = { horizontal: 'center' };

        const timeString = dto.month && dto.year ? `Tháng ${dto.month}/${dto.year}` : 'Tất cả thời gian';
        const subTitleRow = worksheet.addRow([`Thời gian: ${timeString}`]);
        subTitleRow.font = { name: 'Arial', size: 12, italic: true };
        worksheet.mergeCells('A2:N2');
        subTitleRow.getCell(1).alignment = { horizontal: 'center' };

        worksheet.addRow([]); 

        const headerRow = worksheet.addRow([
            'STT', 'Mã Booking', 'Tên khách hàng', 'Số điện thoại', 'Ngày đá', 'Khung giờ', 'Tên sân',
            'Tiền sân', 'Tiền dịch vụ', 'Tổng tiền', 'Đã trả/Cọc', 'Còn nợ', 'Trạng thái thanh toán', 'Trạng thái ca đá'
        ]);

        headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
        headerRow.eachCell((cell) => {
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FF0070C0' }
            };
            cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            };
            cell.alignment = { vertical: 'middle', horizontal: 'center' };
        });

        worksheet.columns = [
            { width: 5 },  // STT
            { width: 20 }, // Mã Booking
            { width: 25 }, // Tên KH
            { width: 15 }, // SĐT
            { width: 12 }, // Ngày đá
            { width: 15 }, // Khung giờ
            { width: 25 }, // Tên sân
            { width: 15, style: { numFmt: '#,##0 "₫"' } }, // Tiền sân
            { width: 15, style: { numFmt: '#,##0 "₫"' } }, // Tiền dịch vụ
            { width: 15, style: { numFmt: '#,##0 "₫"' } }, // Tổng tiền
            { width: 15, style: { numFmt: '#,##0 "₫"' } }, // Đã trả/cọc
            { width: 15, style: { numFmt: '#,##0 "₫"' } }, // Còn lại
            { width: 25 }, // TT thanh toán
            { width: 20 }, // TT ca đá
        ];

        let totalRevenue = 0;

        bookings.forEach((b, index) => {
            const dateStr = b.startTime ? b.startTime.toLocaleDateString('vi-VN') : '';
            const startTimeStr = b.startTime ? b.startTime.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : '';
            const endTimeStr = b.endTime ? b.endTime.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : '';
            const timeRange = `${startTimeStr} - ${endTimeStr}`;

            const serviceTotal = b.bookingservices.reduce((sum, bs) => {
                return sum + (bs.quantity || 0) * (bs.servicePriceAtBooking || bs.services?.price || 0);
            }, 0);

            const paidAmount = b.payments.reduce((sum, p) => sum + (p.amount || 0), 0);
            const total = b.total || 0;
            const debt = total - paidAmount;

            if (b.status === 'approved' && ['paid', 'partial'].includes(b.paymentStatus || '')) {
                totalRevenue += total;
            } else if (b.status === 'rejected' && b.paymentStatus === 'partial') {
                totalRevenue += (b.pitchPriceAtBooking || 0) / 2; 
            }

            const row = worksheet.addRow([
                index + 1,
                b.bookId,
                b.users?.fullName || 'Khách vãng lai',
                b.phone || b.users?.phone || '',
                dateStr,
                timeRange,
                b.pitch?.namePitch || '',
                b.pitchPriceAtBooking || 0,
                serviceTotal,
                total,
                paidAmount,
                debt > 0 ? debt : 0,
                b.paymentStatus === 'paid' ? 'Đã thanh toán' : (b.paymentStatus === 'partial' ? 'Thanh toán một phần' : 'Chưa thanh toán'),
                b.status === 'approved' ? 'Hoàn thành' : (b.status === 'rejected' ? 'Đã hủy' : 'Chờ duyệt')
            ]);

            row.eachCell((cell) => {
                cell.border = {
                    top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' }
                };
            });

            // Styling for status
            const pStatusCell = row.getCell(13);
            if (b.paymentStatus === 'paid') pStatusCell.font = { color: { argb: 'FF00B050' }, bold: true };
            else if (b.paymentStatus === 'partial') pStatusCell.font = { color: { argb: 'FFED7D31' }, bold: true };
            else pStatusCell.font = { color: { argb: 'FFFF0000' }, bold: true };

            const statusCell = row.getCell(14);
            if (b.status === 'approved') statusCell.font = { color: { argb: 'FF00B050' } };
            else if (b.status === 'rejected') statusCell.font = { color: { argb: 'FFFF0000' } };
        });

        worksheet.addRow([]);
        const totalRow = worksheet.addRow(['', '', '', '', '', '', 'TỔNG DOANH THU:', '', '', totalRevenue]);
        totalRow.font = { bold: true, size: 12 };
        totalRow.getCell(10).numFmt = '#,##0 "₫"';



        const paymentSheet = workbook.addWorksheet('Lịch Sử Thanh Toán');
        paymentSheet.addRow(['BÁO CÁO GIAO DỊCH THANH TOÁN']).font = { name: 'Arial', size: 14, bold: true };
        paymentSheet.mergeCells('A1:G1');
        paymentSheet.getCell('A1').alignment = { horizontal: 'center' };
        paymentSheet.addRow([]);

        const payHeaderRow = paymentSheet.addRow([
            'STT', 'Mã Giao Dịch', 'Mã Booking', 'Khách hàng', 'Thời gian', 'Hình thức', 'Số tiền'
        ]);
        payHeaderRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
        payHeaderRow.eachCell((cell) => {
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0070C0' } };
            cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
            cell.alignment = { vertical: 'middle', horizontal: 'center' };
        });

        paymentSheet.columns = [
            { width: 5 }, { width: 25 }, { width: 20 }, { width: 25 }, { width: 20 }, { width: 15 }, { width: 15, style: { numFmt: '#,##0 "₫"' } }
        ];

        let totalCash = 0;
        let totalBanking = 0;
        let payIndex = 1;

    
        const allPayments = bookings.flatMap(b => 
            b.payments.map(p => ({
                ...p,
                bookingData: b
            }))
        ).sort((a, b) => (a.createdAt && b.createdAt) ? a.createdAt.getTime() - b.createdAt.getTime() : 0);

        allPayments.forEach((p) => {
            const dateStr = p.createdAt ? p.createdAt.toLocaleString('vi-VN') : '';
            const methodStr = p.paymentMethod === 'cash' ? 'Tiền mặt' : (p.paymentMethod === 'banking' ? 'Chuyển khoản' : 'Khác');
            
            if (p.paymentMethod === 'cash') totalCash += (p.amount || 0);
            if (p.paymentMethod === 'banking') totalBanking += (p.amount || 0);

            const row = paymentSheet.addRow([
                payIndex++,
                p.id,
                p.bookingId,
                p.bookingData.users?.fullName || p.bookingData.phone || 'Khách vãng lai',
                dateStr,
                methodStr,
                p.amount || 0
            ]);
            row.eachCell((cell) => {
                cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
            });
            const methodCell = row.getCell(6);
            if (p.paymentMethod === 'banking') methodCell.font = { color: { argb: 'FF0070C0' }, bold: true };
            else if (p.paymentMethod === 'cash') methodCell.font = { color: { argb: 'FF00B050' }, bold: true };
        });

        paymentSheet.addRow([]);
        paymentSheet.addRow(['', '', '', '', 'TỔNG TIỀN MẶT:', '', totalCash]).font = { bold: true };
        paymentSheet.addRow(['', '', '', '', 'TỔNG CHUYỂN KHOẢN:', '', totalBanking]).font = { bold: true };


        const serviceSheet = workbook.addWorksheet('Tồn Kho Dịch Vụ');
        serviceSheet.addRow(['BÁO CÁO TỒN KHO DỊCH VỤ']).font = { name: 'Arial', size: 14, bold: true };
        serviceSheet.mergeCells('A1:G1');
        serviceSheet.getCell('A1').alignment = { horizontal: 'center' };
        serviceSheet.addRow([]);

        const srvHeaderRow = serviceSheet.addRow([
            'STT', 'Tên Dịch Vụ', 'Đơn Giá', 'Tổng Nhập Lượng', 'Đang Cho Thuê', 'Đã Trả Hư Hỏng/Mất', 'Tồn Kho Hiện Tại'
        ]);
        srvHeaderRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
        srvHeaderRow.eachCell((cell) => {
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0070C0' } };
            cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
            cell.alignment = { vertical: 'middle', horizontal: 'center' };
        });

        serviceSheet.columns = [
            { width: 5 }, { width: 30 }, { width: 15, style: { numFmt: '#,##0 "₫"' } }, { width: 15 }, { width: 15 }, { width: 20 }, { width: 15 }
        ];

        const allServices = await prisma.services.findMany({ orderBy: { nameProduct: 'asc' } });

        allServices.forEach((srv, index) => {
            const currentStock = (srv.totalQuantity || 0) - (srv.borrowed || 0) - (srv.returned || 0);
            const row = serviceSheet.addRow([
                index + 1,
                srv.nameProduct,
                srv.price || 0,
                srv.totalQuantity || 0,
                srv.borrowed || 0,
                srv.returned || 0,
                currentStock
            ]);
            row.eachCell((cell) => {
                cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
            });
            
            if (currentStock < 5) {
                row.getCell(7).font = { color: { argb: 'FFFF0000' }, bold: true };
            }
        });

        return workbook;
    }
}
