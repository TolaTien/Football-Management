import { Request, Response } from "express";
import { ServicesService } from "./services.service.js";

class Services {
    async getAllServices(req: Request, res: Response) {
        const result = await ServicesService.getAllServices(req.query);
        return res.status(200).json({
            message: "Lấy danh sách dịch vụ thành công",
            data: result.services,
            meta: result.pagination
        });
    }

    async getServiceDetail(req: Request, res: Response) {
        const serviceId = req.params.serviceId as string;
        const result = await ServicesService.getServiceDetail(serviceId);
        return res.status(200).json({ message: "Lấy chi tiết dịch vụ thành công", data: result });
    }

    async createService(req: Request, res: Response) {
        const result = await ServicesService.createService(req.body);
        return res.status(201).json({ message: "Tạo dịch vụ thành công", data: result });
    }

    async updateService(req: Request, res: Response) {
        const result = await ServicesService.updateService(req.body);
        return res.status(200).json({ message: "Cập nhật dịch vụ thành công", data: result });
    }

    async deleteService(req: Request, res: Response) {
        const serviceId = req.params.serviceId as string;
        const result = await ServicesService.deleteService(serviceId);
        return res.status(200).json({ message: "Xóa dịch vụ thành công", data: result });
    }
}

export default new Services();

