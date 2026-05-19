import { prisma } from "../../config/prisma.js";
import crypto from "crypto";

export const PostLogic = {
    // 1. LẤY DANH SÁCH BÀI VIẾT - ĐỘ THÊM PHÂN TRANG (Không cần sửa DB)
    getAllPosts: async (page: number = 1, limit: number = 10) => {
        const skip = (page - 1) * limit;

        // Dùng Transaction song song để vừa lấy dữ liệu vừa đếm tổng số bài cùng lúc cho nhanh
        const [posts, totalPosts] = await prisma.$transaction([
            prisma.post.findMany({
                take: limit, // Giới hạn số bài lấy ra
                skip: skip,  // Bỏ qua các bài của trang trước
                orderBy: { createdAt: 'desc' },
                include: { 
                    users: { select: { fullName: true, avt: true } },
                    _count: { select: { comments: true, postlike: true } }
                }
            }),
            prisma.post.count() // Đếm tổng số bài viết đang có trong DB
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

    // 2. XEM CHI TIẾT (Giữ nguyên cấu trúc cũ của mày)
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

    // 3. ĐĂNG BÀI (Giữ nguyên)
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

    // 4. SỬA BÀI (Giữ nguyên)
    updatePost: async (userId: string, postId: string, data: { description?: string, status?: any }) => {
        const post = await prisma.post.findUnique({ where: { postId } });
        if (!post) throw new Error("Bài đăng không tồn tại");
        if (post.hostId !== userId) throw new Error("Cảnh báo: Bạn không phải chủ bài viết!");

        return await prisma.post.update({
            where: { postId },
            data: { description: data.description ?? post.description, status: data.status ?? post.status }
        });
    },

    // 5. XÓA BÀI (Giữ nguyên bản Hard Delete xóa hẳn khỏi DB như cũ của mày)
    deletePost: async (userId: string, postId: string) => {
        const post = await prisma.post.findUnique({ where: { postId } });
        if (!post) throw new Error("Bài đăng không tồn tại");
        if (post.hostId !== userId) throw new Error("Cảnh báo: Chỉ chủ bài viết mới được xóa!");

        return await prisma.post.delete({ where: { postId } });
    }
};