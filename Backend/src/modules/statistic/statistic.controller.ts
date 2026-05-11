// import { Request, Response } from "express";
// import { StatisticService } from "./statistic.service.js";

// class Statistic {
//     async getMonthlyRevenue(req: Request, res: Response) {
//         const month = parseInt(req.query.month as string);
//         const year = parseInt(req.query.year as string);
//         const address = req.query.address as string;

//         const data = await StatisticService.getMonthlyRevenue({ month, year, address });
//         return res.status(200).json({ message: "Thống kê doanh thu thành công", data });
//     }

//     async getTopSpenders(req: Request, res: Response) {
//         const address = req.query.address as string;
//         const data = await StatisticService.getTopSpenders(address);
//         return res.status(200).json({ message: "Lấy danh sách top chi tiêu thành công", data });
//     }

//     async getSystemOverview(req: Request, res: Response) {
//         const address = req.query.address as string;
//         const data = await StatisticService.getSystemOverview(address);
//         return res.status(200).json({ message: "Lấy tổng quan hệ thống thành công", data });
//     }

//     async getRevenueByPitch(req: Request, res: Response) {
//         const address = req.query.address as string;
//         const data = await StatisticService.getRevenueByPitch(address);
//         return res.status(200).json({ message: "Thống kê doanh thu theo sân thành công", data });
//     }
// };

// export default new Statistic();
