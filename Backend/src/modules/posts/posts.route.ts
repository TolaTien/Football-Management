import { Router } from "express";
import { PostController } from "./posts.controller.js";
import { authUser } from "../../middlewares/auth.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js"; // Lôi ông middleware ra
import { PostsSchema } from "./posts.schema.js"; // Lôi cái khiên ra

export const postRouters: Router = Router();

// 1. Lấy danh sách bài viết
postRouters.get("/", authUser, PostController.getAll);

// 2. Xem chi tiết bài viết (Gắn check param ID)
postRouters.get("/:postId", authUser, validate(PostsSchema.paramsId), PostController.getOne);

// 3. Đăng bài mới (Gắn chặn body rỗng/khoảng trắng)
postRouters.post("/", authUser, validate(PostsSchema.create), PostController.create);

// 4. Sửa bài viết (Gắn check cả param ID và body sửa đổi)
postRouters.put("/:postId", authUser, validate(PostsSchema.update), PostController.update);

// 5. Xóa bài viết (Gắn check param ID)
postRouters.delete("/:postId", authUser, validate(PostsSchema.paramsId), PostController.delete);