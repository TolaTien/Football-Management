import { prisma } from "../../config/prisma.js";
import crypto from "crypto";
import { io } from "../../config/socket.js";

export const CommentLogic = {
    createComment: async (userId: string, data: { postId: string, content: string, parentId?: string }) => {
        const lastComment = await prisma.comments.findFirst({
            where: { userId: userId },
            orderBy: { createdAt: 'desc' }
        });

        if (lastComment && lastComment.createdAt) {
            if (new Date().getTime() - new Date(lastComment.createdAt).getTime() < 10000) {
                throw new Error("Bạn thao tác quá nhanh! Đợi 10 giây.");
            }
        }

        const post = await prisma.post.findUnique({ where: { postId: data.postId } });
        if (!post) throw new Error("Bài đăng không tồn tại");

        const userAction = await prisma.users.findUnique({ where: { userId }, select: { fullName: true } });
        const commenterName = userAction?.fullName || "Ai đó";

        let parentComment = null;
        if (data.parentId) {
            parentComment = await prisma.comments.findUnique({ where: { commentId: data.parentId } });
        }
        const txResult = await prisma.$transaction(async (tx) => {
            const newComment = await tx.comments.create({
                data: {
                    commentId: `CMT-${crypto.randomUUID().substring(0, 8)}`,
                    postId: data.postId,
                    userId: userId,
                    content: data.content,
                    parentId: data.parentId || null
                }
            });

            let receiverId = null;
            let isReply = false;

            if (data.parentId && parentComment && parentComment.userId !== userId) {
                receiverId = parentComment.userId;
                isReply = true; 
            } else if (!data.parentId && post.hostId !== userId) {
                receiverId = post.hostId; 
            }

            let notif = null;
            if (receiverId) {
                const notifContent = isReply 
                    ? `${commenterName} đã trả lời bình luận của bạn.` 
                    : `${commenterName} đã bình luận bài viết của bạn.`;

                notif = await tx.notification.create({
                    data: {
                        id: `NOTIF-${crypto.randomUUID().substring(0, 8)}`,
                        userId: receiverId,
                        postId: data.postId,
                        content: notifContent,
                        type: "post",
                        isRead: false
                    }
                });
            }

            return { newComment, notif, receiverId };
        });

        if (txResult.notif && txResult.receiverId) {
            io.to(txResult.receiverId).emit("new_notification", txResult.notif);
        }

        return txResult.newComment;
    },

    getCommentsTree: async (postId: string) => {
        const flatComments = await prisma.comments.findMany({
            where: { postId },
            include: { users: { select: { fullName: true, avt: true } } },
            orderBy: { createdAt: 'asc' } 
        });

        const commentMap = new Map();
        const tree: any[] = [];

        flatComments.forEach(c => commentMap.set(c.commentId, { ...c, replies: [] }));
        flatComments.forEach(c => {
            if (c.parentId && commentMap.has(c.parentId)) {
                commentMap.get(c.parentId).replies.push(commentMap.get(c.commentId));
            } else {
                tree.push(commentMap.get(c.commentId));
            }
        });
        return tree;
    },

    toggleLikeComment: async (userId: string, commentId: string) => {
        const comment = await prisma.comments.findUnique({ where: { commentId } });
        if (!comment) throw new Error("Bình luận không tồn tại");

        const userAction = await prisma.users.findUnique({ where: { userId }, select: { fullName: true } });
        const likerName = userAction?.fullName || "Ai đó";
        const hashId = crypto.createHash('md5').update(`${userId}-${commentId}`).digest('hex').substring(0, 8);
        const deterministicNotifId = `NLC-${hashId}`; 

        return await prisma.$transaction(async (tx) => {
            const existingLike = await tx.commentlike.findUnique({
                where: { userId_commentId: { userId, commentId } }
            });

            if (existingLike) {
                await tx.commentlike.delete({
                    where: { userId_commentId: { userId, commentId } }
                });
                
                if (comment.userId !== userId) {
                    await tx.notification.deleteMany({
                        where: { id: deterministicNotifId }
                    });
                }
                return { action: "unliked", message: "Đã bỏ thích" };

            } else {
                await tx.commentlike.create({ data: { userId, commentId } });
                let notif = null;

                if (comment.userId && comment.userId !== userId) {
                    notif = await tx.notification.upsert({
                        where: { id: deterministicNotifId },
                        update: { content: `${likerName} đã thích bình luận của bạn.`, isRead: false },
                        create: {
                            id: deterministicNotifId,
                            userId: comment.userId,
                            postId: comment.postId,
                            content: `${likerName} đã thích bình luận của bạn.`,
                            type: "post", 
                            isRead: false
                        }
                    });
                }
                if (notif && comment.userId) {
                    setTimeout(() => io.to(comment.userId as string).emit("new_notification", notif), 0);
                }

                return { action: "liked", message: "Đã thích" };
            }
        });
    }
};