import { Request, Response } from "express";
import { CommentLogic } from "./comments.service.js";

const CommentController = {
    create: async (req: Request, res: Response) => {
        try {
            const userId = (req as any).user.userId;
            const newComment = await CommentLogic.createComment(userId, req.body);
            res.status(201).json({ message: "Đã gửi bình luận", data: newComment });
        } catch (error: any) {
            res.status(500).json({ message: "Lỗi tạo bình luận", error: error.message });
        }
    },
    getByPost: async (req: Request, res: Response) => {
        try {
            const postId = req.params.postId;
            const comments = await CommentLogic.getCommentsByPost(postId);
            res.status(200).json(comments);
        } catch (error: any) {
            res.status(500).json({ message: "Lỗi tải bình luận", error: error.message });
        }
    },
    delete: async (req: Request, res: Response) => {
        try {
            const userId = (req as any).user.userId;
            const userRole = (req as any).user.role; // Kéo thêm Role để check Admin
            const commentId = req.params.id;

            await CommentLogic.deleteComment(userId, userRole, commentId);
            res.status(200).json({ message: "Đã xóa bình luận thành công" });
        } catch (error: any) {
            const status = error.message.includes("Không có quyền") ? 403 : 404;
            res.status(status).json({ message: error.message });
        }
    },

    likeComment: async (req: Request, res: Response) => {
        try {
            const userId = (req as any).user.userId; 
            const commentId = req.params.id;
            const result = await CommentLogic.toggleLike(userId, commentId);
            res.status(200).json(result);
        } catch (error: any) {
            res.status(404).json({ message: error.message });
        }
    }
};

export default CommentController;