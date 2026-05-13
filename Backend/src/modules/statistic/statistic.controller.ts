import { Request, Response } from "express";
import { StatisticService } from "./statistic.service.js";
import { GetRevenueInput } from "./statistic.schema.js";

class Statistic {
    async getMonthlyRevenue(req: Request, res: Response) {
        const data = await StatisticService.getMonthlyRevenue(req.query);
        return res.status(200).json({ message: "Thống kê doanh thu thành công", data });
    }

    async getTopSpenders(req: Request, res: Response) {
        const data = await StatisticService.getTopSpenders();
        return res.status(200).json({ message: "Lấy top 10 người dùng chi tiêu nhiều nhất thành công", data });
    }

    async getSystemOverview(req: Request, res: Response) {
        const data = await StatisticService.getSystemOverview(req.query);
        return res.status(200).json({ message: "Lấy thông tin thành công", data });
    };

    async exportFileExcel(req: Request, res: Response) {


        
        // try {
        //     const dto: GetRevenueInput = {
        //         month: req.query.month ? Number(req.query.month) : undefined,
        //         year: req.query.year ? Number(req.query.year) : undefined,
        //         address: req.query.address as string | undefined
        //     };
        //     const workbook = await StatisticService.exportFileExcel(dto);
            
        //     res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        //     res.setHeader('Content-Disposition', 'attachment; filename="Bao_Cao_Doanh_Thu.xlsx"');

        //     await workbook.xlsx.write(res);
        //     res.end();
        // } catch (error) {
        //     console.error(error);
        //     return res.status(500).json({ message: "Lỗi khi xuất file Excel" });
        // }
    }

};

export default new Statistic();
