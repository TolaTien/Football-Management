import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt.js";
import { ApiError } from "../utils/ApiError.js";
import { prisma } from "../config/prisma.js";


export const authUser = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const token = req.cookies?.accessToken;
        if(!token) {
            return res.status(401).json({ message: "Vui lòng đăng nhập"})
        }

        const decode = verifyToken(token);
        if(!decode){
            return res.status(401).json({ message: "Token không hợp lệ"})
        }

        const user = await prisma.users.findUnique({
            where: { userId: decode.userId },
            select: { userId: true, role: true, status: true },
        });

        if(!user){
            return res.status(401).json({ message: "Người dùng không tồn tại" });
        }

        if(user.status === "banned"){
            return res.status(403).json({ message: "Tài khoản của bạn đã bị khóa" });
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
