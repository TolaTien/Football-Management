import { Router } from "express";
import { PostController } from "./posts.controller.js";
import { authUser } from "../../middlewares/auth.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js"; // Lôi ông middleware ra
import { PostsSchema } from "./posts.schema.js"; // Lôi cái khiên ra

export const postRouters: Router = Router();
postRouters.get("/", authUser, PostController.getAll);
postRouters.get("/:postId", authUser, validate(PostsSchema.paramsId), PostController.getOne);
postRouters.post("/", authUser, validate(PostsSchema.create), PostController.create);
postRouters.put("/:postId", authUser, validate(PostsSchema.update), PostController.update);
postRouters.delete("/:postId", authUser, validate(PostsSchema.paramsId), PostController.delete);