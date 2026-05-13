import { prisma } from "../../config/prisma.js";
import crypto from "crypto";

export const CommentLogic = {
    createComment: async (userId: string, data: { content: string, postId: string, parentId?: string }) => {
        return await prisma.comments.create({
            data: {
                commentId: `CMT-${crypto.randomUUID().substring(0, 8)}`,
                content: data.content,
                postId: data.postId,
                userId: userId,
                parentId: data.parentId || null 
            }
        });
    },

    getCommentsByPost: async (postId: string) => {
        return await prisma.comments.findMany({
            where: { 
                postId: postId,
                parentId: null 
            },
            include: {
                users: { 
                    select: { fullName: true, avt: true } 
                },
                _count: { 
                    select: { commentlike: true } 
                },
                other_comments: { // Kéo các bình luận con (reply)
                    include: {
                        users: { select: { fullName: true, avt: true } },
                        _count: { select: { commentlike: true } }
                    },
                    orderBy: { createdAt: 'asc' } 
                }
            },
            orderBy: { createdAt: 'desc' }
        });
    },

    deleteComment: async (userId: string, userRole: string, commentId: string) => {
        const comment = await prisma.comments.findUnique({ where: { commentId } });
        
        if (!comment) {
            throw new Error("Bình luận không tồn tại");
        }
        
        if (userRole !== 'admin' && comment.userId !== userId) {
            throw new Error("Không có quyền xóa bình luận của người khác");
        }

        return await prisma.comments.delete({
            where: { commentId }
        });
    },

    toggleLike: async (userId: string, commentId: string) => {
        const comment = await prisma.comments.findUnique({ where: { commentId } });
        if (!comment) throw new Error("Bình luận không tồn tại");

        const existingLike = await prisma.commentlike.findUnique({
            where: {
                userId_commentId: { userId, commentId }
            }
        });

        if (existingLike) {
            await prisma.commentlike.delete({
                where: { userId_commentId: { userId, commentId } }
            });
            return { action: "unliked", message: "Đã bỏ thích bình luận" };
        } else {
            await prisma.commentlike.create({
                data: { userId, commentId }
            });
            return { action: "liked", message: "Đã thích bình luận" };
        }
    }
};