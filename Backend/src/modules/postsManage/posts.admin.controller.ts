import { Request, Response } from "express";
import { PostAdminLogic } from "./posts.admin.service.js";


const PostAdminController = {
    getAll: async (req: Request, res: Response) => {
        try {
            if ((req as any).user.role !== "admin") {
                return res.status(403).json({ message: "Quyền truy cập bị từ chối" });
            }
            const rawStatus=req.query.status||req.query.Status;
            const filters = {
                status: typeof rawStatus === 'string' ? rawStatus.toLowerCase() : undefined,
                search: req.query.search as string,
            };

            const data = await PostAdminLogic.getAllPosts(filters);
            res.status(200).json(data);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    },

    getOne: async (req: Request, res: Response) => {
        try {
            if ((req as any).user.role !== "admin") return res.status(403).send();
            const data = await PostAdminLogic.getPostById(req.params.id);
            res.status(200).json(data);
        } catch (error: any) {
            res.status(404).json({ message: error.message });
        }
    },

    changeStatus: async (req: Request, res: Response) => {
        try {
            if ((req as any).user.role !== "admin") return res.status(403).send();
            const { status } = req.body;
            const data = await PostAdminLogic.updateStatus(req.params.id, status);
            res.status(200).json({ message: "Cập nhật trạng thái thành công", data });
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    },

    remove: async (req: Request, res: Response) => {
        try {
            if ((req as any).user.role !== "admin") return res.status(403).send();
            await PostAdminLogic.deletePost(req.params.id);
            res.status(200).json({ message: "Đã xóa bài đăng vĩnh viễn" });
        } catch (error: any) {
            res.status(404).json({ message: error.message });
        }
    },
    createPost: async (req: Request, res: Response) => {
        try {
            const user = (req as any).user;
            
            // Chốt chặn 1: Bắt buộc phải là Admin
            if (user.role !== "admin") {
                return res.status(403).json({ message: "Quyền truy cập bị từ chối" });
            }

            const { description } = req.body;
            if (!description) {
                return res.status(400).json({ message: "Nội dung bài viết không được để trống" });
            }

            const newPost = await PostLogic.createAdminPost(user.userId, description);
            
            res.status(201).json({ message: "Admin đã tạo bài đăng thành công!", data: newPost });
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

};

export default PostAdminController;