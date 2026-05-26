import { Request, Response, NextFunction } from "express";
import { AdminUserService } from "./admin-user.service.js";
import { StatusCodes } from "http-status-codes";

class AdminUserController {
    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const search = (req.query.search as string) || "";
            const result = await AdminUserService.getAllUsers(page, limit, search);

            res.status(StatusCodes.OK).json({ message: "Lấy danh sách user thành công", data: result });
        } catch (error) {
            next(error);
        }
    }

    async getById(req: Request, res: Response, next: NextFunction) {
        try {
            const user = await AdminUserService.getUserById(req.params.id as string);
            res.status(StatusCodes.OK).json({ message: "Lấy thông tin user thành công", data: user });
        } catch (error) {
            next(error);
        }
    }

    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const user = await AdminUserService.createUser(req.body);
            // Trả về status 201 (Created)
            res.status(StatusCodes.CREATED).json({ message: "Tạo user thành công", data: user });
        } catch (error) {
            next(error);
        }
    }

    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const user = await AdminUserService.updateUser(req.params.id as string, req.body);
            res.status(StatusCodes.OK).json({ message: "Cập nhật user thành công", data: user });
        } catch (error) {
            next(error);
        }
    }

    async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await AdminUserService.deleteUser(req.params.id as string);
            res.status(StatusCodes.OK).json(result);
        } catch (error) {
            next(error);
        }
    }
}

export default new AdminUserController();