import { prisma } from "../../config/prisma.js";
import crypto from "crypto";
import { io } from "../../config/socket.js";

export const CommentLogic = {
    // ==========================================
    // 1. TẠO BÌNH LUẬN (Mới nhất auto đẻ bản ghi mới, Front-end đọc mượt)
    // ==========================================
    createComment: async (userId: string, data: { postId: string, content: string, parentId?: string }) => {
        // Chặn Spam 10s
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

        const newComment = await prisma.comments.create({
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

        if (receiverId) {
            const notifContent = isReply 
                ? `${commenterName} đã trả lời bình luận của bạn.` 
                : `${commenterName} đã bình luận bài viết của bạn.`;

            // Mỗi comment đẻ 1 notif riêng -> Tự động xếp lên đầu theo mốc thời gian vừa tạo
            const notif = await prisma.notification.create({
                data: {
                    id: `NOTIF-${crypto.randomUUID().substring(0, 8)}`,
                    userId: receiverId,
                    postId: data.postId,
                    content: notifContent,
                    type: "post", // Gắn mác post hợp lệ với Schema cũ
                    isRead: false
                }
            });
            io.to(receiverId).emit("new_notification", notif);
        }

        return newComment;
    },

    // ==========================================
    // 2. LẤY BÌNH LUẬN DẠNG CÂY (Đã sửa: Mới nhất lên đầu)
    // ==========================================
    getCommentsTree: async (postId: string) => {
        const flatComments = await prisma.comments.findMany({
            where: { postId },
            include: { users: { select: { fullName: true, avt: true } } },
            // 👇 ĐÃ SỬA: Đổi 'asc' thành 'desc' để comment mới nhất nhảy lên đầu page
            orderBy: { createdAt: 'desc' } 
        });

        const commentMap = new Map();
        const tree: any[] = [];

        flatComments.forEach(c => commentMap.set(c.commentId, { ...c, replies: [] }));
        flatComments.forEach(c => {
            if (c.parentId) commentMap.get(c.parentId)?.replies.push(commentMap.get(c.commentId));
            else tree.push(commentMap.get(c.commentId));
        });
        return tree;
    },

    // ==========================================
    // 3. LIKE BÌNH LUẬN (Mới nhất đẻ bản ghi mới, unlike tự động thu hồi)
    // ==========================================
    toggleLikeComment: async (userId: string, commentId: string) => {
        const comment = await prisma.comments.findUnique({ where: { commentId } });
        if (!comment) throw new Error("Bình luận không tồn tại");

        const userAction = await prisma.users.findUnique({ where: { userId }, select: { fullName: true } });
        const likerName = userAction?.fullName || "Ai đó";

        const existingLike = await prisma.commentlike.findFirst({ where: { userId, commentId } });

        if (existingLike) {
            await prisma.$transaction(async (tx) => {
                await tx.commentlike.deleteMany({ where: { userId, commentId } });
                
                if (comment.userId !== userId) {
                    await tx.notification.deleteMany({
                        where: { 
                            userId: comment.userId as string, 
                            postId: comment.postId, 
                            type: "post", 
                            content: `${likerName} đã thích bình luận của bạn.` 
                        }
                    });
                }
            });
            return { action: "unliked", message: "Đã bỏ thích" };
        } else {
            const [newLike, notif] = await prisma.$transaction(async (tx) => {
                const like = await tx.commentlike.create({ data: { userId, commentId } });
                let finalNotification = null;

                if (comment.userId && comment.userId !== userId) {
                    // Tạo thông báo mới tinh, tự động lên top 1 vì vừa tạo xong
                    finalNotification = await tx.notification.create({
                        data: {
                            id: `NOTIF-${crypto.randomUUID().substring(0, 8)}`,
                            userId: comment.userId,
                            postId: comment.postId,
                            content: `${likerName} đã thích bình luận của bạn.`,
                            type: "post", 
                            isRead: false
                        }
                    });
                }
                return [like, finalNotification];
            });

            if (notif && comment.userId) {
                io.to(comment.userId).emit("new_notification", notif);
            }
            return { action: "liked", message: "Đã thích" };
        }
    }
};