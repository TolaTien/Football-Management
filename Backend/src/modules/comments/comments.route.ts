import { Router } from "express";
import { CommentController } from "./comments.controller.js";
import { authUser } from "../../middlewares/auth.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { CommentsSchema } from "./comments.schema.js";

export const commentRouters: Router = Router();

// Kéo bình luận (Có chặn schema kiểm tra param postId)
commentRouters.get("/post/:postId", authUser, validate(CommentsSchema.paramsPostId), CommentController.getByPost);

// Đăng bình luận (Có chặn schema kiểm tra body)
commentRouters.post("/", authUser, validate(CommentsSchema.create), CommentController.create);

// Like bình luận (Có chặn schema kiểm tra param commentId)
commentRouters.post("/:commentId/like", authUser, validate(CommentsSchema.paramsCommentId), CommentController.toggleLike);