import { prisma } from "../../config/prisma.js";
import { generateRefreshToken, generateToken, verifyToken } from "../../utils/jwt.js";
import { CheckAuthDto, LoginDto, RefreshToken, RegisterDto } from "./auth.schema.js";
import bcrypt, { genSalt } from 'bcrypt';
import { v4 as uuidv4 } from "uuid"
import { ApiError } from "../../utils/ApiError.js";
import { StatusCodes } from "http-status-codes";

export class UserService {
    static async login(dto : LoginDto){
        if(!dto.email || !dto.password) {
            throw new ApiError(StatusCodes.BAD_REQUEST, "Vui lòng nhập đầy đủ thông tin");
        }
        const user = await prisma.users.findUnique({ where: { email: dto.email}});
        if(!user){
            throw new ApiError(StatusCodes.BAD_REQUEST, "User không tồn tại");
        };
        const checkPassword = await bcrypt.compare(dto.password, user.password);
        if(!checkPassword){
            throw new ApiError(StatusCodes.BAD_REQUEST, "Mật khẩu không chính xác");
        };
        if(!user.role){
            throw new ApiError(StatusCodes.BAD_REQUEST, "Vai trò người dùng không hợp lệ");
        };
        const accessToken = generateToken({ userId: user.userId, role: user.role })
        const refreshToken = generateRefreshToken({ userId: user.userId, role: user.role });
        
        return { accessToken, refreshToken, user };
    };

    static async register(dto: RegisterDto) {
        //note: phone
        if(!dto.email || !dto.password || !dto.fullName  ) {
            throw new ApiError(StatusCodes.BAD_REQUEST, "Vui lòng nhập đầy đủ thông tin");
        };

        if(dto.password.length < 6) {
            throw new ApiError(StatusCodes.BAD_REQUEST, "Mật khẩu phải có ít nhất 6 ký tự");
        };

        const user = await prisma.users.findFirst({
            where: {email: dto.email}
        });

        if(user){
            throw new ApiError(StatusCodes.CONFLICT, "Tài khoản đã tồn tại");
        };

        const salt = await genSalt(12);
        const hashPassword = await bcrypt.hash(dto.password, salt);

        const newUser = await prisma.users.create({ 
            data: {
                userId: uuidv4(),
                email: dto.email,
                password: hashPassword,
                role: 'user',
                fullName: dto.fullName,
                phone: dto.phone
            }
        });
        if(!newUser.role){
            throw new ApiError(StatusCodes.BAD_REQUEST, "Vai trò người dùng không hợp lệ");
        };
        const accessToken = generateToken({ userId: newUser.userId, role: newUser.role })
        const refreshToken = generateRefreshToken({ userId: newUser.userId, role: newUser.role });
        
        return { accessToken, refreshToken, newUser };
    };

    static async checkAuth(dto: CheckAuthDto ){
        if(!dto.userId){
            throw new ApiError(StatusCodes.UNAUTHORIZED, "Vui lòng đăng nhập");
        }

        const user = await prisma.users.findUnique({ where: {userId: dto.userId}});
        if(!user){
            throw new ApiError(StatusCodes.UNAUTHORIZED, "Người dùng không tồn tại");
        }
        return {user};
    };

    static async refreshToken(dto: RefreshToken ){
        if(!dto.refreshToken){
            throw new ApiError(StatusCodes.UNAUTHORIZED, "Vui lòng đăng nhập");
        };

        const decoded = verifyToken(dto.refreshToken);
        
        if(!decoded){
            throw new ApiError(StatusCodes.UNAUTHORIZED, "Token không hợp lệ")
        };
        const user = await prisma.users.findUnique({ where: {userId: decoded.userId}});
        if(!user){
            throw new ApiError(StatusCodes.UNAUTHORIZED, "User không tồn tại")
        }

        if(!user.role){
            throw new ApiError(StatusCodes.BAD_REQUEST, "Vai trò người dùng không hợp lệ");
        }
        const newAccessToken = generateToken({ userId: user.userId, role: user.role});
        return {newAccessToken};
    }


}