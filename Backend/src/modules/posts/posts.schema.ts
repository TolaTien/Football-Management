import { z } from "zod";

export const PostsSchema = {
    // 1. Kiểm tra khi TẠO BÀI VIẾT (Bắt buộc phải có nội dung)
    create: z.object({
        body: z.object({
            description: z.string({
                required_error: "Nội dung bài viết không được để trống",
            })
            .trim()
            .min(1, "Bài viết phải có ít nhất 1 ký tự")
        })
    }),

    // 2. Kiểm tra khi SỬA BÀI VIẾT (Các trường có thể bỏ trống nếu không muốn sửa)
    update: z.object({
        body: z.object({
            description: z.string().min(1, "Nội dung bài viết không được để trống").optional(),
            // status trong DB của mày là ENUM, tao check nó là string, mày có thể bổ sung giới hạn enum vào đây nếu cần
            status: z.string().optional() 
        }),
        params: z.object({
            postId: z.string({
                required_error: "Thiếu mã bài viết (postId) trên URL"
            }).min(1, "Mã bài viết không hợp lệ")
        })
    }),

    // 3. Kiểm tra ID trên URL cho các hành động XÓA, XEM CHI TIẾT
    paramsId: z.object({
        params: z.object({
            postId: z.string({
                required_error: "Thiếu mã bài viết (postId) trên URL"
            }).min(1, "Mã bài viết không hợp lệ")
        })
    })
};