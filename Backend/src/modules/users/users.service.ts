import { StatusCodes } from "http-status-codes";
import { prisma } from "../../config/prisma.js";
import { ApiError } from "../../utils/ApiError.js";
import { UpdateProfileUser } from "./users.schema.js";
import { uploadStream } from "../../utils/upload.js";


export class UserService {
    static async updateProfileUser(dto: UpdateProfileUser, userId: string, file?: { mimetype: string; buffer: Buffer }){
        const user = await prisma.users.findUnique({ where: {userId}});
        
        if (!user) {
            throw new ApiError(StatusCodes.NOT_FOUND, "Không tìm thấy người dùng");
        }

        const update: any = {};
        if(dto.email && dto.email !== user.email) {
            const existingUser = await prisma.users.findFirst({ where: {email: dto.email}});
            if(existingUser){
                throw new ApiError(StatusCodes.CONFLICT, "Email này đã tồn tại");
            }
            update.email = dto.email;
        }

        if(dto.phone && dto.phone !== user?.phone) update.phone = dto.phone;
        if(dto.fullName && dto.fullName !== user?.fullName) update.fullName = dto.fullName;

        if(file){
            if(!file.mimetype.startsWith("image")){
                throw new ApiError(StatusCodes.BAD_REQUEST, "Chỉ tải lên ảnh");
            }
            const upload = await uploadStream(file.buffer);
            update.avt = upload.secure_url;
        }

        const updatedUser = await prisma.users.update({
            where: { userId },
            data: update
        });

        return updatedUser ;


    }
}