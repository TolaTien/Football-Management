import { prisma } from "../../config/prisma.js";
import crypto from "crypto";
import { io } from "../../config/socket.js";

export const PostLikeLogic = {
    toggleLikePost: async (userId: string, postId: string) => {
        const post = await prisma.post.findUnique({ where: { postId } });
        if (!post) throw new Error("Bài đăng không tồn tại");

        // 1. CHUI VÀO BẢNG USERS LẤY TÊN THẬT CỦA THẰNG ĐANG BẤM LIKE
        const userAction = await prisma.users.findUnique({
            where: { userId: userId },
            select: { fullName: true }
        });
        const likerName = userAction?.fullName || "Ai đó";

        const existingLike = await prisma.postlike.findFirst({
            where: { userId, postId }
        });

        if (existingLike) {
            // ==========================================
            // 🔴 LUỒNG HỦY LIKE (UNLIKE) - CÓ CẬP NHẬT LẠI SỐ LƯỢNG
            // ==========================================
            await prisma.$transaction(async (tx) => {
                // Xóa Like của thằng này
                await tx.postlike.deleteMany({ where: { userId, postId } });
                
                // Đếm xem bài này còn bao nhiêu Like
                const remainingLikes = await tx.postlike.count({ where: { postId } });

                if (remainingLikes === 0) {
                    // Nếu không còn ai like nữa -> Xóa sổ luôn cái thông báo
                    await tx.notification.deleteMany({
                        where: { userId: post.hostId as string, postId: postId, type: "post" }
                    });
                } else {
                    // Nếu vẫn còn người like -> Cập nhật lại con số và đẩy lên đầu
                    await tx.notification.updateMany({
                        where: { userId: post.hostId as string, postId: postId, type: "post" },
                        data: { 
                            content: `Có ${remainingLikes} người đã thích bài viết của bạn.`,
                            createdAt: new Date() // Ép mốc thời gian mới để nổi lên đầu
                        }
                    });
                }
            });

            return { action: "unliked", message: "Đã bỏ thích bài viết" };
            
        } else {
            // ==========================================
            // 🟢 LUỒNG THẢ LIKE MỚI - GOM NHÓM LẠI CHỐNG SPAM DB
            // ==========================================
            const [newLike, notif] = await prisma.$transaction(async (tx) => {
                // Lưu Like mới vào DB
                const like = await tx.postlike.create({ data: { userId, postId } });
                let finalNotification = null;

                if (post.hostId && post.hostId !== userId) {
                    // Đếm tổng số Like HIỆN TẠI của bài viết
                    const totalLikes = await tx.postlike.count({ where: { postId } });

                    // Tìm xem bài này đã từng có thông báo Like nào chưa
                    const existingNotif = await tx.notification.findFirst({
                        where: { userId: post.hostId, postId: postId, type: "post" }
                    });

                    // Lên kịch bản nội dung thông báo
                    let notifContent = `${likerName} đã thích bài viết của bạn.`;
                    if (totalLikes > 1) {
                        notifContent = `${likerName} và ${totalLikes - 1} người khác đã thích bài viết của bạn.`;
                    }

                    if (existingNotif) {
                        // 🌟 TỐI ƯU HÓA: Chỉ update và reset thời gian để nhảy lên đầu
                        finalNotification = await tx.notification.update({
                            where: { id: existingNotif.id },
                            data: {
                                content: notifContent,
                                isRead: false, // Bật lại thành chưa đọc
                                createdAt: new Date(), // 🔥 ÉP THỜI GIAN ĐỂ LÊN TOP 1
                                updatedAt: new Date() 
                            }
                        });
                    } else {
                        // TẠO MỚI: Nếu đây là người thả like đầu tiên
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

            // Bắn Socket realtime
            if (notif && post.hostId) {
                io.to(post.hostId).emit("new_notification", notif);
            }
            return { action: "liked", message: "Đã thích bài viết" };
        }
    }
};