import { Request, Response } from "express";
import { ServiceLogic } from "./services.service.js";

const ServiceController = {
    create: async (req: Request, res: Response) => {
        try {
            const user = (req as any).user;
            if (user.role !== 'admin') return res.status(403).json({ message: "Từ chối: Chỉ Admin mới được thêm dịch vụ" });

            const result = await ServiceLogic.create(req.body);
            res.status(201).json({ message: "Tạo dịch vụ thành công", data: result });
        } catch (error: any) {
            res.status(500).json({ message: "Lỗi tạo dịch vụ", error: error.message });
        }
    },

    getAll: async (req: Request, res: Response) => {
        try {
            const data = await ServiceLogic.getAll();
            res.status(200).json(data);
        } catch (error: any) {
            res.status(500).json({ message: "Lỗi lấy danh sách" });
        }
    },

    getOne: async (req: Request, res: Response) => {
        try {
            const data = await ServiceLogic.getOne(req.params.id as string);
            if (!data) return res.status(404).json({ message: "Không tìm thấy dịch vụ" });
            res.status(200).json(data);
        } catch (error: any) {
            res.status(500).json({ message: "Lỗi server" });
        }
    },

    update: async (req: Request, res: Response) => {
        try {
            const user = (req as any).user;
            if (user.role !== 'admin') return res.status(403).json({ message: "Từ chối: Chỉ Admin mới được sửa dịch vụ" });

            const result = await ServiceLogic.update(req.params.id as string, req.body);
            res.status(200).json({ message: "Cập nhật thành công", data: result });
        } catch (error: any) {
            res.status(400).json({ message: error.message || "Cập nhật thất bại" });
        }
    },

    delete: async (req: Request, res: Response) => {
        try {
            const user = (req as any).user;
            if (user.role !== 'admin') return res.status(403).json({ message: "Từ chối: Chỉ Admin mới được xóa dịch vụ" });

            await ServiceLogic.delete(req.params.id as string);
            res.status(200).json({ message: "Đã xóa dịch vụ vĩnh viễn" });
        } catch (error: any) {
            res.status(400).json({ message: "Xóa thất bại" });
        }
    }
};

export default ServiceController;