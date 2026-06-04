import { Request, Response } from "express";
import { PostLogic } from "./posts.service.js";

export const PostController = {
    getAll: async (req: Request, res: Response) => {
        try {
            const posts = await PostLogic.getAllPosts();
            res.status(200).json(posts);
        } catch (error: any) { res.status(500).json({ message: error.message }); }
    },

    getOne: async (req: Request, res: Response) => {
        try {
            const post = await PostLogic.getPostById(req.params.postId as string);
            res.status(200).json(post);
        } catch (error: any) { res.status(404).json({ message: error.message }); }
    },

    create: async (req: Request, res: Response) => {
        try {
            const userId = (req as any).user.userId;
            const newPost = await PostLogic.createPost(userId, req.body);
            res.status(201).json({ message: "Đã đăng bài tìm đối", data: newPost });
        } catch (error: any) { res.status(500).json({ message: error.message }); }
    },

    update: async (req: Request, res: Response) => {
        try {
            const userId = (req as any).user.userId;
            const updatedPost = await PostLogic.updatePost(userId, req.params.postId as string, req.body);
            res.status(200).json({ message: "Cập nhật bài viết thành công", data: updatedPost });
        } catch (error: any) { res.status(403).json({ message: error.message }); }
    },

    delete: async (req: Request, res: Response) => {
        try {
            const userId = (req as any).user.userId;
            await PostLogic.deletePost(userId, req.params.postId as string);
            res.status(200).json({ message: "User đã tự xóa bài viết thành công" }); 
        } catch (error: any) { res.status(403).json({ message: error.message }); }
    }
};