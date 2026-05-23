import { Request, Response } from "express";
import { CommentLogic } from "./comments.service.js";

export const CommentController = {
    create: async (req: Request, res: Response) => {
        try {
            const userId = (req as any).user.userId;
            const newComment = await CommentLogic.createComment(userId, req.body);
            res.status(201).json({ message: "Bình luận thành công", data: newComment });
        } catch (error: any) { res.status(400).json({ message: error.message }); }
    },

    getByPost: async (req: Request, res: Response) => {
        try {
<<<<<<< HEAD
            const tree = await CommentLogic.getCommentsTree(req.params.postId);
=======
            const tree = await CommentLogic.getCommentsTree(req.params.postId as string);
>>>>>>> c3517840149118654f2ab2cd1889341c31ec390e
            res.status(200).json(tree);
        } catch (error: any) { res.status(400).json({ message: error.message }); }
    },

    toggleLike: async (req: Request, res: Response) => {
        try {
            const userId = (req as any).user.userId;
<<<<<<< HEAD
            const result = await CommentLogic.toggleLikeComment(userId, req.params.commentId);
=======
            const result = await CommentLogic.toggleLikeComment(userId, req.params.commentId as string);
>>>>>>> c3517840149118654f2ab2cd1889341c31ec390e
            res.status(200).json(result);
        } catch (error: any) { res.status(400).json({ message: error.message }); }
    }
};