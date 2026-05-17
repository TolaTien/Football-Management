import { Request, Response } from "express";
import { AdminService } from "./admin.service.js";

class Admin {
    async banUser(req: Request, res: Response) {
        const userId = req.params.userId as string;
        const { status } = req.body 

        const update = await AdminService.banUser({ userId, status });
        return res.status(200).json({
            message: status === 'banned' ? "Khóa người dùng thành công" : "Mở khóa người dùng thành công",
            data: update,
        });
    }

    async approveRequestUser(req: Request, res: Response) {
        const approve = await AdminService.approveRequestUser(req.body);

        return res.status(200).json({ message: "Phê duyệt đặt sân thành công", data: approve});
    }

    async cancelBookingForAdmin(req: Request, res: Response) {
        const cancel = await AdminService.cancelBookingForAdmin(req.body);
        return res.status(200).json({ message: "Hủy đơn đặt sân thành công", data: cancel});
    }

    async refundForUser(req: Request, res: Response){
        const refund = await AdminService.refundForUser(req.body);
        return res.status(200).json({ message: "Hoàn cọc thành công", data: refund});
    };

    async getAllHistoryOfUser(req: Request, res: Response){
        const userId = req.params.userId as string;
        const history = await AdminService.getAllHistoryOfUser({ userId }, req.query);
        return res.status(200).json({ message: "Lấy lịch sử thành công", data: history});
    };

    async verifyPaymentOfUser(req: Request, res: Response){
        const verify = await AdminService.verifyPaymentOfUser(req.body);
        return res.status(200).json({ message: "Xác nhận thanh toán thành công", data: verify});
    }

    // async getAllUsers(req: Request, res: Response) {
    //     const result = await AdminService.getAllUsers(req.query);
    //     return res.status(200).json({ message: "Lấy danh sách người dùng thành công", data: result });
    // }
};

export default new Admin();
