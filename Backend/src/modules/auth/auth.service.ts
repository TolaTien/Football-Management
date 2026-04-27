import { prisma } from "../../config/prisma.js";
import { generateRefreshToken, generateToken } from "../../utils/jwt.js";
import { LoginDto } from "./auth.schema.js";
import bcrypt from 'bcrypt';
export class UserService {
    static async login(dto : LoginDto){
        const user = await prisma.users.findUnique({ where: { email: dto.email}});
        if(!user){
            throw Error("User không tồn tại");
        };
        const checkPassword = await bcrypt.compare(dto.password, user.password);
        if(!checkPassword){
            throw Error("Mật khẩu không chính xác");
        };
        if(!user.role){
            throw Error("Vai trò người dùng không hợp lệ");
        };
        const accessToken = generateToken({ userId: user.userId.toString(), role: user.role })
        const refreshToken = generateRefreshToken({ userId: user.userId.toString(), role: user.role });
        
        return { accessToken, refreshToken, user};

    }
}