import { prisma } from "../../config/prisma.js";
import crypto from "crypto";
import { io } from "../../config/socket.js";

export const PostLikeLogic = {
    toggleLikePost: async (userId: string, postId: string) => {
        const post = await prisma.post.findUnique({ where: { postId } });
        if (!post) throw new Error("Bài đăng không tồn tại");
        const userAction = await prisma.users.findUnique({
            where: { userId: userId },
            select: { fullName: true }
        });
        const likerName = userAction?.fullName || "Ai đó";

        const existingLike = await prisma.postlike.findFirst({
            where: { userId, postId }
        });

        if (existingLike) {
            await prisma.$transaction(async (tx) => {
                await tx.postlike.deleteMany({ where: { userId, postId } });
                                const remainingLikes = await tx.postlike.count({ where: { postId } });

                if (remainingLikes === 0) {
                    await tx.notification.deleteMany({
                        where: { userId: post.hostId as string, postId: postId, type: "post" }
                    });
                } else {
                    await tx.notification.updateMany({
                        where: { userId: post.hostId as string, postId: postId, type: "post" },
                        data: { 
                            content: `Có ${remainingLikes} người đã thích bài viết của bạn.`,
                            createdAt: new Date()
                        }
                    });
                }
            });

            return { action: "unliked", message: "Đã bỏ thích bài viết" };
            
        } else {
            const [newLike, notif] = await prisma.$transaction(async (tx) => {
                const like = await tx.postlike.create({ data: { userId, postId } });
                let finalNotification = null;

                if (post.hostId && post.hostId !== userId) {
                    const totalLikes = await tx.postlike.count({ where: { postId } });
                    const existingNotif = await tx.notification.findFirst({
                        where: { userId: post.hostId, postId: postId, type: "post" }
                    });
                    let notifContent = `${likerName} đã thích bài viết của bạn.`;
                    if (totalLikes > 1) {
                        notifContent = `${likerName} và ${totalLikes - 1} người khác đã thích bài viết của bạn.`;
                    }

                    if (existingNotif) {
                        finalNotification = await tx.notification.update({
                            where: { id: existingNotif.id },
                            data: {
                                content: notifContent,
                                isRead: false,
                                createdAt: new Date(),
                                updatedAt: new Date() 
                            }
                        });
                    } else {
                        finalNotification = await tx.notification.create({
                            data: {
                                id: `NOTIF-${crypto.randomUUID().substring(0, 8)}`,
                                userId: post.hostId,
                                postId: postId,
                                content: notifContent,
                                type: "post",
                                isRead: false
                            }
                        });
                    }
                }
                return [like, finalNotification];
            });

            if (notif && post.hostId) {
                io.to(post.hostId).emit("new_notification", notif);
            }
            return { action: "liked", message: "Đã thích bài viết" };
        }
    }
};