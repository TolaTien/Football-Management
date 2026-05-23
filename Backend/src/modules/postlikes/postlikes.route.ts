import { Router } from "express";
import { PostLikeController } from "./postlikes.controller.js";
import { authUser } from "../../middlewares/auth.middleware.js";

<<<<<<< HEAD

export const postLikeRouters: Router = Router();
postLikeRouters.post("/:postId/like", authUser,  PostLikeController.toggleLike);
=======
export const postLikeRouters: Router = Router();

postLikeRouters.post("/:postId/like", authUser, PostLikeController.toggleLike);
>>>>>>> c3517840149118654f2ab2cd1889341c31ec390e
