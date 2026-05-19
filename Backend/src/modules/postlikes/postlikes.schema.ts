import { z } from "zod";

export const PostLikesSchema = {
    toggleLike: z.object({
        params: z.object({
            postId: z.string({ required_error: "Thiếu mã bài viết (postId) trên URL" }).min(1)
        })
    })
};