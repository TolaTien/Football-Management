import { z } from "zod";

export const CommentsSchema = {
    create: z.object({
        body: z.object({
            postId: z.string({ required_error: "Thiếu postId" }).min(1),
            content: z.string({ required_error: "Nội dung bình luận trống" }).min(1),
            parentId: z.string().optional()
        })
    }),
    paramsPostId: z.object({
        params: z.object({ postId: z.string().min(1) })
    }),
    paramsCommentId: z.object({
        params: z.object({ commentId: z.string().min(1) })
    })
};