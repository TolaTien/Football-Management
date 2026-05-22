import { Router } from "express";
import CommentController from "./comments.controller.js";
import { authUser } from "../../middlewares/auth.middleware.js";

export const commentRouters: Router = Router();
commentRouters.get("/post/:postId", CommentController.getByPost);
commentRouters.post("/", authUser, CommentController.create);
commentRouters.delete("/:id", authUser, CommentController.delete);
commentRouters.post("/:id/like", authUser, CommentController.likeComment);