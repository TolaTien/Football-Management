import { Request, Response } from "express";
import { prisma } from "../../config/prisma.js";

class PostController {
  async getAllPosts(req: Request, res: Response) {
    try {
      const posts = await prisma.post.findMany({
        include: {
          users: {
            select: {
              userId: true,
              fullName: true,
              avt: true,
            },
          },
          _count: {
            select: { comments: true },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return res.status(200).json({
        message: "Lấy danh sách bài đăng thành công",
        data: posts,
      });
    } catch (error) {
      console.error("Error getting posts:", error);
      return res.status(500).json({ message: "Lỗi Server Nội Bộ" });
    }
  }
}

export default new PostController();