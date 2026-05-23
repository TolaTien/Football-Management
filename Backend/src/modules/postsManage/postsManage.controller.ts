import { Request, Response } from "express";
import { PostsManageLogic } from "./postsManage.service.js";

export const PostsManageController = {
    getAll: async (req: Request, res: Response) => {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;

            const posts = await PostsManageLogic.getAllPosts(page, limit);
            res.status(200).json(posts);
        } catch (error: any) { res.status(500).json({ message: error.message }); }
    },

    create: async (req: Request, res: Response) => {
        try {
            const user = (req as any).user;
            if (user.role !== 'admin') {
                return res.status(403).json({ message: "Từ chối: User bình thường không được phép đăng bài qua luồng quản lý!" });
            }

            const newPost = await PostsManageLogic.createAdminPost(user.userId, req.body);
            res.status(201).json({ message: "Admin đăng bài thành công", data: newPost });
        } catch (error: any) { res.status(500).json({ message: error.message }); }
    },

    update: async (req: Request, res: Response) => {
        try {
            const user = (req as any).user;
            if (user.role !== 'admin') {
                return res.status(403).json({ message: "Từ chối: User bình thường không được phép sửa bài qua luồng quản lý!" });
            }

            const updatedPost = await PostsManageLogic.updateAdminPost(user.userId, req.params.postId as string, req.body);
            res.status(200).json({ message: "Admin sửa bài thành công", data: updatedPost });
        } catch (error: any) { res.status(403).json({ message: error.message }); }
    },

    delete: async (req: Request, res: Response) => {
        try {
            const user = (req as any).user;
            if (user.role !== 'admin') {
                return res.status(403).json({ message: "Từ chối: Chỉ Admin mới có quyền xóa bài viết vi phạm!" });
            }

            await PostsManageLogic.deleteAnyPost(req.params.postId as string);
            res.status(200).json({ message: "Admin đã xóa bài viết vi phạm thành công" });
        } catch (error: any) { res.status(403).json({ message: error.message }); }
    }
};