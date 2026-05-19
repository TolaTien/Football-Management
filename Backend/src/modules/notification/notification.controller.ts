import { Request, Response } from "express";
import { NotificationService } from "./notification.service.js";

class Notification {
    async getAllNotification(req: Request, res: Response) {
        const userId = req.user?.userId as string;
        const query = req.query;
        const notification = await NotificationService.getAllNotification({ userId, query});

        return res.status(200).json({ message: "Lấy thông báo của người dùng thành công ", data: notification})
    };

    async markRead(req: Request, res: Response) {
        const userId = req.user?.userId as string;
        const notificationId = req.params.id as string;
        const mark = await NotificationService.markRead({userId, notificationId})

        return res.status(200).json({ message: "Đánh dấu thông báo thành đã đọc thành công ", data: mark})
    };

    async markReadAll(req: Request, res: Response) {
        const userId = req.user?.userId as string;
        const mark = await NotificationService.markReadAll({userId})

        return res.status(200).json({ message: "Đánh dấu tất cả thông báo thành đã đọc thành công ", data: mark})
    };
};

export default new Notification();
