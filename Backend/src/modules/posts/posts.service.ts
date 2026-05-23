import { prisma } from "../../config/prisma.js";
import crypto from "crypto";
<<<<<<< HEAD

=======
import { post_status } from "../../../generated/prisma/client.js";
>>>>>>> c3517840149118654f2ab2cd1889341c31ec390e
export const PostLogic = {
    getAllPosts: async (page: number = 1, limit: number = 10) => {
        const skip = (page - 1) * limit;
        const [posts, totalPosts] = await prisma.$transaction([
            prisma.post.findMany({
                take: limit, 
                skip: skip,  
                orderBy: { createdAt: 'desc' },
                include: { 
                    users: { select: { fullName: true, avt: true } },
                    _count: { select: { comments: true, postlike: true } }
                }
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
    },

    getPostById: async (postId: string) => {
        const post = await prisma.post.findUnique({
            where: { postId },
            include: { 
                users: { select: { fullName: true, avt: true } },
                comments: { include: { users: { select: { fullName: true, avt: true } } } }
            }
        });
        if (!post) throw new Error("Bài đăng không tồn tại");
        return post;
    },

    createPost: async (userId: string, data: { description: string }) => {
        return await prisma.post.create({
            data: {
                postId: `POST-${crypto.randomUUID().substring(0, 8)}`,
                hostId: userId,
                description: data.description,
                status: 'open'
            }
        });
    },
<<<<<<< HEAD
    updatePost: async (userId: string, postId: string, data: { description?: string, status?: any }) => {
=======
    updatePost: async (userId: string, postId: string, data: { description?: string, status?: post_status }) => {
>>>>>>> c3517840149118654f2ab2cd1889341c31ec390e
        const post = await prisma.post.findUnique({ where: { postId } });
        if (!post) throw new Error("Bài đăng không tồn tại");
        if (post.hostId !== userId) throw new Error("Cảnh báo: Bạn không phải chủ bài viết!");

        return await prisma.post.update({
            where: { postId },
            data: { description: data.description ?? post.description, status: data.status ?? post.status }
        });
    },
    deletePost: async (userId: string, postId: string) => {
        const post = await prisma.post.findUnique({ where: { postId } });
        if (!post) throw new Error("Bài đăng không tồn tại");
        if (post.hostId !== userId) throw new Error("Cảnh báo: Chỉ chủ bài viết mới được xóa!");

        return await prisma.post.delete({ where: { postId } });
    }
};