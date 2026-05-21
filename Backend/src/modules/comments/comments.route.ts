import { Router } from "express";
import { CommentController } from "./comments.controller.js";
import { authUser } from "../../middlewares/auth.middleware.js";

export const commentRouters: Router = Router();
commentRouters.get("/post/:postId", authUser, CommentController.getByPost);
commentRouters.post("/", authUser, CommentController.create);
commentRouters.post("/:commentId/like", authUser, CommentController.toggleLike);