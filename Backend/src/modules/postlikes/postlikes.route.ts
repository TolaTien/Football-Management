import { Router } from "express";
import { PostLikeController } from "./postlikes.controller.js";
import { authUser } from "../../middlewares/auth.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { PostLikesSchema } from "./postlikes.schema.js";

export const postLikeRouters: Router = Router();
postLikeRouters.post("/:postId/like", authUser, validate(PostLikesSchema.toggleLike), PostLikeController.toggleLike);