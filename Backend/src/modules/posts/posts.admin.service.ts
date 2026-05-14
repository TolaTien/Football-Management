import { prisma } from "../../config/prisma.js";
import { post_status } from "@prisma/client";
export const PostAdminLogic = {
    getAllPosts: async (filters: { status?: post_status; search?: string }) => {
        const where: any = {};

        if (filters.status) where.status = filters.status;
        if (filters.search) {
            where.description = { contains: filters.search };
        }

        return await prisma.post.findMany({
            where,
            include: {
                users: {
                    select: {
                        userId: true,
                        fullName: true,
                        email: true,
                        role: true,
                    },
                },
                _count: {
                    select: {
                        comments: true,
                        postlike: true,
                    },
                },
            },
            orderBy: { createdAt: "desc" },
        });
    },

        getPostById: async (postId: string) => {
        const post = await prisma.post.findUnique({
            where: { postId },
            include: {
                users: { select: { fullName: true, email: true, phone: true } },
                _count: { select: { comments: true, postlike: true } },
            },
        });
        if (!post) throw new Error("Bài đăng không tồn tại");
        return post;
    },

    updateStatus: async (postId: string, status: post_status) => {
        return await prisma.post.update({
            where: { postId },
            data: { status, updatedAt: new Date() },
        });
    },

    deletePost: async (postId: string) => {
        return await prisma.post.delete({
            where: { postId },
        });
    },
};