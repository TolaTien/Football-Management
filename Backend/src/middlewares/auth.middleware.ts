import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt.js";
import { ApiError } from "../utils/ApiError.js";


export const authUser =  (req: Request, res: Response, next: NextFunction) => {
    try{
        const token = req.cookies?.accessToken;
        if(!token) {
            return res.status(401).json({ message: "Vui lòng đăng nhập"})
        }

        const decode = verifyToken(token);
        if(!decode){
            return res.status(401).json({ message: "Token không hợp lệ"})
        }
        req.user = decode;
        next();
    }catch(err) {
        console.log(err);
        return res.status(500).json({ message: "Lỗi xác thực người dùng" });
    }
}

export const authAdmin = (req: Request, res: Response, next: NextFunction) => {
    if (req.user?.role !== 'admin') {
        throw new ApiError(403, "Không có quyền truy cập");
    }
    next();
}