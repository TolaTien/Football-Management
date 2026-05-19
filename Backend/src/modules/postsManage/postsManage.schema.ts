import { z } from "zod";

export const PostsManageSchema = {
    // 1. Kiểm tra khi Admin TẠO BÀI (Bắt buộc có nội dung)
    create: z.object({
        body: z.object({
            description: z.string({
                required_error: "Nội dung bài viết không được để trống",
            }).min(1, "Bài viết phải có ít nhất 1 ký tự")
        })
    }),

    // 2. Kiểm tra khi Admin SỬA BÀI (Cần check cả ID trên URL và Body)
    update: z.object({
        body: z.object({
            description: z.string().min(1, "Nội dung bài viết không được để trống").optional(),
            status: z.string().optional() 
        }),
        params: z.object({
            postId: z.string({
                required_error: "Thiếu mã bài viết (postId) trên URL"
            }).min(1, "Mã bài viết không hợp lệ")
        })
    }),

    // 3. Kiểm tra ID trên URL cho hành động XÓA
    paramsId: z.object({
        params: z.object({
            postId: z.string({
                required_error: "Thiếu mã bài viết (postId) trên URL"
            }).min(1, "Mã bài viết không hợp lệ")
        })
    })
};