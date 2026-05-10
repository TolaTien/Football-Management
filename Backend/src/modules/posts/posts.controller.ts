import { Request, Response } from "express";
import { PostsService } from "./posts.service.js";

class Posts {
    async getPosts(req: Request, res: Response) {
        const result = await PostsService.getPosts(req.query, {
            userId: req.user!.userId,
            role: req.user!.role
        });
        return res.status(200).json({
            message: "Lấy danh sách bài viết thành công",
            data: result.posts,
            meta: result.pagination
        });
    }

    async getPostDetail(req: Request, res: Response) {
        const postId = req.params.postId as string;
        const result = await PostsService.getPostDetail(postId, {
            userId: req.user!.userId,
            role: req.user!.role
        });
        return res.status(200).json({ message: "Lấy chi tiết bài viết thành công", data: result });
    }

    async createPost(req: Request, res: Response) {
        const result = await PostsService.createPost(req.body, {
            userId: req.user!.userId,
            role: req.user!.role
        });
        return res.status(201).json({ message: "Tạo bài viết thành công", data: result });
    }

    async updatePost(req: Request, res: Response) {
        const result = await PostsService.updatePost(req.body, {
            userId: req.user!.userId,
            role: req.user!.role
        });
        return res.status(200).json({ message: "Cập nhật bài viết thành công", data: result });
    }

    async deletePost(req: Request, res: Response) {
        const postId = req.params.postId as string;
        const result = await PostsService.deletePost(postId, {
            userId: req.user!.userId,
            role: req.user!.role
        });
        return res.status(200).json({ message: "Xóa bài viết thành công", data: result });
    }

    async toggleLikePost(req: Request, res: Response) {
        const result = await PostsService.toggleLikePost(req.body, {
            userId: req.user!.userId,
            role: req.user!.role
        });
        return res.status(200).json({ message: "Cập nhật trạng thái thích bài viết thành công", data: result });
    }

    async getCommentsByPost(req: Request, res: Response) {
        const postId = req.params.postId as string;
        const result = await PostsService.getCommentsByPost(postId, {
            userId: req.user!.userId,
            role: req.user!.role
        });
        return res.status(200).json({ message: "Lấy bình luận thành công", data: result });
    }

    async createComment(req: Request, res: Response) {
        const result = await PostsService.createComment(req.body, {
            userId: req.user!.userId,
            role: req.user!.role
        });
        return res.status(201).json({ message: "Tạo bình luận thành công", data: result });
    }

    async updateComment(req: Request, res: Response) {
        const result = await PostsService.updateComment(req.body, {
            userId: req.user!.userId,
            role: req.user!.role
        });
        return res.status(200).json({ message: "Cập nhật bình luận thành công", data: result });
    }

    async deleteComment(req: Request, res: Response) {
        const commentId = req.params.commentId as string;
        const result = await PostsService.deleteComment(commentId, {
            userId: req.user!.userId,
            role: req.user!.role
        });
        return res.status(200).json({ message: "Xóa bình luận thành công", data: result });
    }

    async toggleLikeComment(req: Request, res: Response) {
        const result = await PostsService.toggleLikeComment(req.body, {
            userId: req.user!.userId,
            role: req.user!.role
        });
        return res.status(200).json({ message: "Cập nhật trạng thái thích bình luận thành công", data: result });
    }
}

export default new Posts();

