import { Request, Response } from "express";
import { PostLogic } from "./posts.service.js";

export const PostController = {
    getAll: async (req: Request, res: Response) => {
        try {
<<<<<<< HEAD
            const posts = await PostLogic.getAllPosts();
=======
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const posts = await PostLogic.getAllPosts(page,limit);
>>>>>>> c3517840149118654f2ab2cd1889341c31ec390e
            res.status(200).json(posts);
        } catch (error: any) { res.status(500).json({ message: error.message }); }
    },

    getOne: async (req: Request, res: Response) => {
        try {
<<<<<<< HEAD
            const post = await PostLogic.getPostById(req.params.postId);
=======
            const post = await PostLogic.getPostById(req.params.postId as string);
>>>>>>> c3517840149118654f2ab2cd1889341c31ec390e
            res.status(200).json(post);
        } catch (error: any) { res.status(404).json({ message: error.message }); }
    },

    create: async (req: Request, res: Response) => {
        try {
<<<<<<< HEAD
            const userId = (req as any).user.userId;
            const newPost = await PostLogic.createPost(userId, req.body);
=======
            const user = (req as any).user;
            if (user.role === 'admin') {
                return res.status(403).json({ message: "Từ chối: Admin vui lòng qua luồng quản lý để đăng bài!" });
            }

            const newPost = await PostLogic.createPost(user.userId, req.body);
>>>>>>> c3517840149118654f2ab2cd1889341c31ec390e
            res.status(201).json({ message: "Đã đăng bài tìm đối", data: newPost });
        } catch (error: any) { res.status(500).json({ message: error.message }); }
    },

    update: async (req: Request, res: Response) => {
        try {
<<<<<<< HEAD
            const userId = (req as any).user.userId;
            const updatedPost = await PostLogic.updatePost(userId, req.params.postId, req.body);
=======
            const user = (req as any).user;
            if (user.role === 'admin') {
                return res.status(403).json({ message: "Từ chối: Admin vui lòng qua luồng quản lý để sửa bài!" });
            }

            const updatedPost = await PostLogic.updatePost(user.userId, req.params.postId as string, req.body);
>>>>>>> c3517840149118654f2ab2cd1889341c31ec390e
            res.status(200).json({ message: "Cập nhật bài viết thành công", data: updatedPost });
        } catch (error: any) { res.status(403).json({ message: error.message }); }
    },

    delete: async (req: Request, res: Response) => {
        try {
<<<<<<< HEAD
            const userId = (req as any).user.userId;
            await PostLogic.deletePost(userId, req.params.postId);
=======
            const user = (req as any).user;
            if (user.role === 'admin') {
                return res.status(403).json({ message: "Từ chối: Admin vui lòng qua luồng quản lý để xóa bài!" });
            }

            await PostLogic.deletePost(user.userId, req.params.postId as string);
>>>>>>> c3517840149118654f2ab2cd1889341c31ec390e
            res.status(200).json({ message: "User đã tự xóa bài viết thành công" }); 
        } catch (error: any) { res.status(403).json({ message: error.message }); }
    }
};