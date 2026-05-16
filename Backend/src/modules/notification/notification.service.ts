import { prisma } from "../../config/prisma.js";
import { ApiError } from "../../utils/ApiError.js";
import { GetAllNotification, MarkRead, MarkReadAll } from "./notification.schema.js";


export class NotificationService {
    static async getAllNotification(dto: GetAllNotification){
        const user = await prisma.users.findUnique({
            where: { userId: dto.userId}
        });
        if(!user){
            throw new ApiError(400, "Người dùng không tồn tại");
        };

        const page = Number(dto.query.page) || 1;
        const perPage = 10;
        const skip = (page - 1) * perPage;


        const notification = await prisma.notification.findMany({
            where: { userId: dto.userId},
            skip: skip,
            take: perPage,
            orderBy: {
                createdAt: 'desc'
            }
            
        })

        const totalRequest = await prisma.notification.count({
            where: { userId: dto.userId }
        });
        const numberPage = Math.ceil(totalRequest / perPage);

        return { notification, pagination: { numberPage, page, totalRequest, perpage: perPage } };
    };

    static async markRead(dto: MarkRead){
        const user = await prisma.users.findUnique({ where: { userId: dto.userId}});
        if(!user) throw new ApiError(400, "Người dùng không tồn tại");

        const update = await prisma.notification.updateMany({
            where: {
                id: dto.notificationId,
                userId: dto.userId
            },
            data: {
                isRead: true
            }
        });

        if(update.count === 0) throw new ApiError(404, "Không tìm thấy thông báo");

        return update;
    };

    static async markReadAll(dto: MarkReadAll){
        const user = await prisma.users.findUnique({ where: { userId: dto.userId}});
        if(!user) throw new ApiError(400, "Người dùng không tồn tại");

        const update = await prisma.notification.updateMany({
            where: {
                userId: dto.userId,
                isRead: false
            },
            data: {
                isRead: true
            }
        });

        return update;
    }


}
