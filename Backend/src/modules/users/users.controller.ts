import { Request, Response, NextFunction } from "express";
import { UserService } from "./users.service.js";

class User {
    async updateProfileUser(req: Request, res: Response){
        const {email, phone, fullName, avt} = req.body;
        const userId = req.user?.userId as string;
        const file = req.file;
        const update = await UserService.updateProfileUser({email, phone, fullName, avt}, userId, file);

        res.status(200).json({ message: "Cập nhật thông tin thành công", data: update });
    }
}

export default new User();