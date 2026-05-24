import { Request, Response } from "express";
import { PostLikeLogic } from "./postlikes.service.js";

export const PostLikeController = {
    toggleLike: async (req: Request, res: Response) => {
        try {
            const userId = (req as any).user.userId;
            const postId = req.params.postId;
            const result = await PostLikeLogic.toggleLikePost(userId, postId);
            res.status(200).json(result);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }
}; 