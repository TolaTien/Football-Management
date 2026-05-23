import { Router } from "express";
import { PostsManageController } from "./postsManage.controller.js";
import { authUser, authAdmin } from "../../middlewares/auth.middleware.js"; 

export const postsManageRouters: Router = Router();

postsManageRouters.get("/", authUser, authAdmin, PostsManageController.getAll);
postsManageRouters.post("/", authUser, authAdmin, PostsManageController.create);
postsManageRouters.put("/:postId", authUser, authAdmin, PostsManageController.update);
postsManageRouters.delete("/:postId", authUser, authAdmin, PostsManageController.delete);