import { Request, Response } from "express";
import { PostsManageLogic } from "./postsManage.service.js";

// Hàm tiện ích chặn cửa non-admin
const requireAdmin = (req: Request) => {
    if ((req as any).user.role !== 'admin') throw new Error("Chỉ Admin mới có quyền truy cập!");
    return (req as any).user.userId;
};

export const PostsManageController = {
    getAll: async (req: Request, res: Response) => {
        try {
            requireAdmin(req);
            const posts = await PostsManageLogic.getAllPosts();
            res.status(200).json(posts);
        } catch (error: any) { res.status(403).json({ message: error.message }); }
    },

    create: async (req: Request, res: Response) => {
        try {
            const adminId = requireAdmin(req);
            const newPost = await PostsManageLogic.createAdminPost(adminId, req.body);
            res.status(201).json({ message: "Admin đăng bài thành công", data: newPost });
        } catch (error: any) { res.status(403).json({ message: error.message }); }
    },

    update: async (req: Request, res: Response) => {
        try {
            const adminId = requireAdmin(req);
            const updatedPost = await PostsManageLogic.updateAdminPost(adminId, req.params.postId, req.body);
            res.status(200).json({ message: "Admin sửa bài thành công", data: updatedPost });
        } catch (error: any) { res.status(403).json({ message: error.message }); }
    },

    delete: async (req: Request, res: Response) => {
        try {
            requireAdmin(req); 
            await PostsManageLogic.deleteAnyPost(req.params.postId);
            res.status(200).json({ message: "Admin đã xóa bài viết vi phạm thành công" });
        } catch (error: any) { res.status(403).json({ message: error.message }); }
    }
};