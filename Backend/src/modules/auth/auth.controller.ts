import { Request, Response } from "express";
import { AuthService } from "./auth.service.js";

class Auth {
    async login(req: Request, res: Response) {
        const { email, password} = req.body;

        const result = await AuthService.login({ email, password});
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
        const newUser = await AuthService.register({ email, password, fullName, phone});

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

        return res.status(201).json({ message: "Đăng ký thành công", data: newUser})
    };


    async refreshToken(req: Request, res: Response){
        const refreshToken = req.cookies.refreshToken;
        const result = await AuthService.refreshToken({ refreshToken });
        res.cookie("accessToken", result.newAccessToken, {
            maxAge: 1 * 60 * 60 * 1000, 
            httpOnly: true, 
            secure: process.env.NODE_ENV === 'production',
            sameSite: "strict", 
        });
        //note: bỏ đoạn này
        return res.status(200).json({accessToken: result.newAccessToken })
    };

    async checkAuth(req: Request, res: Response){
        const userId = req.user?.userId as string;
        const user = await AuthService.checkAuth({ userId });
        return res.status(200).json({ message: "Xác thực thành công", data: user}); 
    };

    async logout(req: Request, res: Response){
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");
        return res.status(200).json({ message: "Đăng xuất thành công"})
    };
}

export default new Auth();