import { Request, Response, NextFunction } from "express";
import { AdminUserService } from "./admin-user.service.js";
import { StatusCodes } from "http-status-codes";

class AdminUserController {
    
    // API GET: Lấy danh sách (Ví dụ: /admin/users?page=1&limit=10&search=Huy)
    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            // Lấy các tham số từ URL, ép kiểu về số. Nếu không có thì lấy giá trị mặc định là trang 1, 10 dòng
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const search = (req.query.search as string) || "";

            // Gọi qua Service để xử lý data
            const result = await AdminUserService.getAllUsers(page, limit, search);
            
            // Trả kết quả về cho FE
            res.status(StatusCodes.OK).json({ message: "Lấy danh sách user thành công", data: result });
        } catch (error) {
            next(error); // Gặp lỗi thì vứt qua Error Middleware xử lý
        }
    }

    // API GET: Lấy 1 User (Ví dụ: /admin/users/123-abc)
    async getById(req: Request, res: Response, next: NextFunction) {
        try {
            // Lấy ID từ URL (req.params.id)
            const user = await AdminUserService.getUserById(req.params.id);
            res.status(StatusCodes.OK).json({ message: "Lấy thông tin user thành công", data: user });
        } catch (error) {
            next(error);
        }
    }

    // API POST: Tạo User mới
    async create(req: Request, res: Response, next: NextFunction) {
        try {
            // Lấy toàn bộ dữ liệu frontend gửi lên từ req.body truyền vào service
            const user = await AdminUserService.createUser(req.body);
            // Trả về status 201 (Created)
            res.status(StatusCodes.CREATED).json({ message: "Tạo user thành công", data: user });
        } catch (error) {
            next(error);
        }
    }

    // API PUT/PATCH: Cập nhật User (Ví dụ: /admin/users/123-abc)
    async update(req: Request, res: Response, next: NextFunction) {
        try {
            // Gửi ID (từ params) và Dữ liệu mới (từ body) sang service
            const user = await AdminUserService.updateUser(req.params.id, req.body);
            res.status(StatusCodes.OK).json({ message: "Cập nhật user thành công", data: user });
        } catch (error) {
            next(error);
        }
    }

    // API DELETE: Xóa User (Ví dụ: /admin/users/123-abc)
    async delete(req: Request, res: Response, next: NextFunction) {
        try {
            // Chỉ cần gửi ID sang service để xóa
            const result = await AdminUserService.deleteUser(req.params.id);
            res.status(StatusCodes.OK).json(result);
        } catch (error) {
            next(error);
        }
    }
}

export default new AdminUserController();