import { Router } from "express";
import { PostsManageController } from "./postsManage.controller.js";
import { authUser } from "../../middlewares/auth.middleware.js";

export const postsManageRouters: Router = Router();

postsManageRouters.get("/", authUser, PostsManageController.getAll);
postsManageRouters.post("/", authUser,  PostsManageController.create);
postsManageRouters.put("/:postId", authUser, PostsManageController.update);
postsManageRouters.delete("/:postId", authUser, PostsManageController.delete);