import { Router } from "express";
import { PostLikeController } from "./postlikes.controller.js";
import { authUser } from "../../middlewares/auth.middleware.js";

export const postLikeRouters: Router = Router();

postLikeRouters.post("/:postId/like", authUser, PostLikeController.toggleLike);