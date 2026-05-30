import { prisma } from "../../config/prisma.js";
import crypto from "crypto";

export const PostsManageLogic = {
    getAllPosts: async () => {
        return await prisma.post.findMany({
            include: {
                users: { select: { fullName: true, email: true, avt: true } },
                _count: { select: { comments: true, postlike: true } }
            },
            orderBy: { createdAt: 'desc' }
        });
    },

    createAdminPost: async (adminId: string, data: { description: string }) => {
        return await prisma.post.create({
            data: {
                postId: `POST-${crypto.randomUUID().substring(0, 8)}`,
                hostId: adminId,
                description: data.description,
                status: 'open'
            }
        });
    },

    updateAdminPost: async (adminId: string, postId: string, data: { description?: string, status?: any }) => {
        const post = await prisma.post.findUnique({ where: { postId } });
        if (!post) throw new Error("Bài đăng không tồn tại");

        if (post.hostId !== adminId) {
            throw new Error("Lỗi: Admin chỉ được sửa nội dung bài do chính Admin đăng. Không thể sửa bài của User!");
        }

        return await prisma.post.update({
            where: { postId },
            data: { description: data.description ?? post.description, status: data.status ?? post.status }
        });
    }, 

    deleteAnyPost: async (postId: string) => {
        const post = await prisma.post.findUnique({ where: { postId } });
        if (!post) throw new Error("Bài đăng không tồn tại");

        return await prisma.post.delete({ where: { postId } });
    }
};