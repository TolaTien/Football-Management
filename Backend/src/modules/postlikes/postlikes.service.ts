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

        const txResult = await prisma.$transaction(async (tx) => {
<<<<<<< HEAD
            const existingLike = await tx.postlike.findUnique({
=======
                        const existingLike = await tx.postlike.findUnique({
>>>>>>> df4957677c5809a7143b3d3b8791ea22e52a8b65
                where: { userId_postId: { userId, postId } }
            });

            if (existingLike) {
                await tx.postlike.delete({
                    where: { userId_postId: { userId, postId } }
                });

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
                            isRead: false
                        }
                    });
                }

                return { action: "unliked", message: "Đã bỏ thích bài viết", emitNotif: null };

            } else {
                await tx.postlike.create({ data: { userId, postId } });
                let finalNotification = null;
                if (post.hostId && post.hostId !== userId) {
                    const totalLikes = await tx.postlike.count({ where: { postId } });
<<<<<<< HEAD

=======
                    
>>>>>>> df4957677c5809a7143b3d3b8791ea22e52a8b65
                    let notifContent = `${likerName} đã thích bài viết của bạn.`;
                    if (totalLikes > 1) {
                        notifContent = `${likerName} và ${totalLikes - 1} người khác đã thích bài viết của bạn.`;
                    }

                    const existingNotif = await tx.notification.findFirst({
                        where: { userId: post.hostId, postId: postId, type: "post" }
                    });

                    if (existingNotif) {
                        finalNotification = await tx.notification.update({
                            where: { id: existingNotif.id },
<<<<<<< HEAD
                            data: { content: notifContent, isRead: false }
=======
                            data: { content: notifContent, isRead: false } 
>>>>>>> df4957677c5809a7143b3d3b8791ea22e52a8b65
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

                return { action: "liked", message: "Đã thích bài viết", emitNotif: finalNotification };
            }
        });

        if (txResult.emitNotif && post.hostId) {
            io.to(post.hostId).emit("new_notification", txResult.emitNotif);
        }

        return { action: txResult.action, message: txResult.message };
    }
};