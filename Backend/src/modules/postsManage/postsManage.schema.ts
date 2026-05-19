import { z } from "zod";

export const PostsManageSchema = {
    create: z.object({
        body: z.object({
            description: z.string({
                required_error: "Nội dung bài viết không được để trống",
            }).min(1, "Bài viết phải có ít nhất 1 ký tự")
        })
    }),

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

    paramsId: z.object({
        params: z.object({
            postId: z.string({
                required_error: "Thiếu mã bài viết (postId) trên URL"
            }).min(1, "Mã bài viết không hợp lệ")
        })
    })
};