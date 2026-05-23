import { prisma } from "../../config/prisma.js";
import crypto from "crypto";
<<<<<<< HEAD

export const PostsManageLogic = {
    getAllPosts: async () => {
        return await prisma.post.findMany({
            include: {
                users: { select: { fullName: true, email: true, avt: true } },
                _count: { select: { comments: true, postlike: true } }
            },
            orderBy: { createdAt: 'desc' }
        });
=======
// 👇 Import đúng đường dẫn từ ổ tự chế của mày
import { post_status } from "../../../generated/prisma/client.js"; 

export const PostsManageLogic = {
    // 👇 Thêm phân trang an toàn
    getAllPosts: async (page: number = 1, limit: number = 10) => {
        const skip = (page - 1) * limit;
        const [posts, totalPosts] = await prisma.$transaction([
            prisma.post.findMany({
                take: limit,
                skip: skip,
                include: {
                    users: { select: { fullName: true, email: true, avt: true } },
                    _count: { select: { comments: true, postlike: true } }
                },
                orderBy: { createdAt: 'desc' }
            }),
            prisma.post.count()
        ]);

        return {
            meta: {
                totalItems: totalPosts,
                currentPage: page,
                totalPages: Math.ceil(totalPosts / limit),
                limit: limit
            },
            items: posts
        };
>>>>>>> c3517840149118654f2ab2cd1889341c31ec390e
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

<<<<<<< HEAD
    updateAdminPost: async (adminId: string, postId: string, data: { description?: string, status?: any }) => {
=======
    // 👇 Ép kiểu post_status nghiêm ngặt
    updateAdminPost: async (adminId: string, postId: string, data: { description?: string, status?: post_status }) => {
>>>>>>> c3517840149118654f2ab2cd1889341c31ec390e
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