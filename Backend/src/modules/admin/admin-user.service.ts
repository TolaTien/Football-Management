import { StatusCodes } from "http-status-codes";
import { prisma } from "../../config/prisma.js";
import { ApiError } from "../../utils/ApiError.js";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";


export class AdminUserService {
    
    static async getAllUsers(page: number, limit: number, search: string) {
        const skip = (page - 1) * limit;
                const whereCondition = search
            ? {
                  OR: [
                      { fullName: { contains: search } },
                      { email: { contains: search } },
                      { phone: { contains: search } },
                  ],
              }
            : {};
        const [users, total] = await Promise.all([
            prisma.users.findMany({
                where: whereCondition,
                skip,
                take: limit,
                select: {
                    userId: true, email: true, fullName: true, 
                    avt: true, role: true, phone: true, createdAt: true,
                },
                orderBy: { createdAt: 'desc' }, 
            }),
            prisma.users.count({ where: whereCondition }),
        ]);

        // Trả về data kèm theo thông tin meta để frontend vẽ phân trang
        return {
            users,
            meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
        };
    }

    static async getUserById(userId: string) {
        // Tìm user theo ID
        const user = await prisma.users.findUnique({
            where: { userId },
            select: { userId: true, email: true, fullName: true, avt: true, role: true, phone: true, createdAt: true },
        });
        
        // Nếu không tìm thấy trong database thì ném lỗi 404
        if (!user) {
            throw new ApiError(StatusCodes.NOT_FOUND, "Không tìm thấy người dùng");
        }
        return user;
    }

    static async createUser(data: any) {
        const existingUser = await prisma.users.findUnique({ where: { email: data.email } });
        if (existingUser) {
            throw new ApiError(StatusCodes.CONFLICT, "Email đã tồn tại trong hệ thống");
        }

        const hashedPassword = await bcrypt.hash(data.password, 10);
        
        const newUser = await prisma.users.create({
            data: {
                userId: uuidv4(), 
                email: data.email,
                password: hashedPassword,
                fullName: data.fullName,
                phone: data.phone,
                role: data.role || "user",
                avt: data.avt,
            },
        });

        const { password, ...userWithoutPassword } = newUser;
        return userWithoutPassword;
    }
    static async updateUser(userId: string, data: any) {
        const user = await prisma.users.findUnique({ where: { userId } });
        if (!user) {
            throw new ApiError(StatusCodes.NOT_FOUND, "Không tìm thấy người dùng");
        }

        const updateData: any = {};

        if (data.email && data.email !== user.email) {
            const existingUser = await prisma.users.findUnique({ where: { email: data.email } });
            if (existingUser) throw new ApiError(StatusCodes.CONFLICT, "Email này đã được sử dụng");
            updateData.email = data.email;
        }

        if (data.fullName) updateData.fullName = data.fullName;
        if (data.phone) updateData.phone = data.phone;
        if (data.role) updateData.role = data.role;
        if (data.avt) updateData.avt = data.avt;
        if (data.password) {
            updateData.password = await bcrypt.hash(data.password, 10);
        }
        const updatedUser = await prisma.users.update({
            where: { userId },
            data: updateData,
        });

        const { password, ...userWithoutPassword } = updatedUser;
        return userWithoutPassword;
    }

    static async deleteUser(userId: string) {
        const user = await prisma.users.findUnique({ where: { userId } });
        if (!user) {
            throw new ApiError(StatusCodes.NOT_FOUND, "Không tìm thấy người dùng");
        }

        try {
            await prisma.users.delete({ where: { userId } });
            return { message: "Đã xóa người dùng thành công" };
        } catch (error: any) {
            if (error.code === 'P2003') {
                throw new ApiError(StatusCodes.BAD_REQUEST, "Không thể xóa: Người dùng này đang có dữ liệu đặt sân hoặc bình luận.");
            }
            throw error; 
        }
    }
}