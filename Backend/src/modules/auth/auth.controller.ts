import { Request, Response } from "express";
import { prisma } from "../../config/prisma.js";
import { UserService } from "./auth.service.js";


class Auth {
    async login(req: Request, res: Response) {
        try {

            const { email, password} = req.body;

            const result = await UserService.login({ email, password});
            res.cookie('accessToken', result.accessToken,{
                maxAge: 1 * 60 * 60 * 1000, 
                httpOnly: true, 
                sameSite: "strict", 
            });
            res.cookie('refreshToken', result.refreshToken,{
                maxAge: 7 * 24 * 60 * 60 * 1000, 
                httpOnly: true, 
                sameSite: "strict", 
            });
            return res.status(200).json({ message: "Đăng nhập thành công", data: result})
            

        }catch(err: any) {
            console.log(err);
            return res.status(500).json({ message: "Lỗi server "});
        }
    }
}

export default new Auth();