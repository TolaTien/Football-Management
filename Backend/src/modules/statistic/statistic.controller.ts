import { Request, Response } from "express";
import { StatisticService } from "./statistic.service.js";

class Statistic {
    async statisticForAdmin(req: Request, res: Response) {
        
    }

    async getMonthlyRevenue(req: Request, res: Response) {
        try {
            const month = parseInt(req.query.month as string);
            const year = parseInt(req.query.year as string);

            const data = await StatisticService.getMonthlyRevenue({ month, year });
            return res.status(200).json({ message: "Thống kê doanh thu thành công", data });
        } catch (error: any) {
             return res.status(500).json({ message: "Lỗi server khi thống kê doanh thu", error: error.message });
        }
    }
};

export default new Statistic();
