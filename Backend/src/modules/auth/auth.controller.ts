import { Request, Response } from "express";
import { UserService } from "./auth.service.js";

class Auth {
    async login(req: Request, res: Response) {
        const { email, password} = req.body;

        const result = await UserService.login({ email, password});
        res.cookie('accessToken', result.accessToken,{
            maxAge: 1 * 60 * 60 * 1000, 
            httpOnly: true, 
            secure: process.env.NODE_ENV === 'production',
            sameSite: "strict", 
        });
        res.cookie('refreshToken', result.refreshToken,{
            maxAge: 7 * 24 * 60 * 60 * 1000, 
            httpOnly: true, 
            secure: process.env.NODE_ENV === 'production',
            sameSite: "strict", 
        });
        
        return res.status(200).json({ message: "Đăng nhập thành công", data: result})
    };

    async register(req: Request, res: Response) {
        const {email, phone, password, fullName} = req.body;
        const newUser = await UserService.register({ email, password, fullName, phone});

        res.cookie('accessToken', newUser.accessToken,{
            maxAge: 1 * 60 * 60 * 1000, 
            httpOnly: true, 
            secure: process.env.NODE_ENV === 'production',
            sameSite: "strict", 
        });
        res.cookie('refreshToken', newUser.refreshToken,{
            maxAge: 7 * 24 * 60 * 60 * 1000, 
            httpOnly: true, 
            secure: process.env.NODE_ENV === 'production',
            sameSite: "strict", 
        });

        return res.status(200).json({ message: "Đăng ký thành công", data: newUser})
    }
}

export default new Auth();