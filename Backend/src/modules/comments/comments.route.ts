import { Router } from "express";
import { CommentController } from "./comments.controller.js";
import { authUser } from "../../middlewares/auth.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { CommentsSchema } from "./comments.schema.js";

export const commentRouters: Router = Router();
commentRouters.get("/post/:postId", authUser, validate(CommentsSchema.paramsPostId), CommentController.getByPost);
commentRouters.post("/", authUser, validate(CommentsSchema.create), CommentController.create);
commentRouters.post("/:commentId/like", authUser, validate(CommentsSchema.paramsCommentId), CommentController.toggleLike);