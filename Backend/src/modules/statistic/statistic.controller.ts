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
    }

};

export default new Statistic();
