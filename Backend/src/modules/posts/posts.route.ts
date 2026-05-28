import { Router } from "express";
import { PostController } from "./posts.controller.js";
import { authUser } from "../../middlewares/auth.middleware.js";

export const postRouters: Router = Router();
postRouters.get("/", authUser, PostController.getAll);
postRouters.get("/:postId", authUser, PostController.getOne);
postRouters.post("/", authUser, PostController.create);
postRouters.put("/:postId", authUser, PostController.update);
postRouters.delete("/:postId", authUser, PostController.delete);