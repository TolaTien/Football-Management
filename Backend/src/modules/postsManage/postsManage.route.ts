import { Router } from "express";
import { PostsManageController } from "./postsManage.controller.js";
<<<<<<< HEAD
import { authUser } from "../../middlewares/auth.middleware.js";

export const postsManageRouters: Router = Router();

postsManageRouters.get("/", authUser, PostsManageController.getAll);
postsManageRouters.post("/", authUser,  PostsManageController.create);
postsManageRouters.put("/:postId", authUser, PostsManageController.update);
postsManageRouters.delete("/:postId", authUser, PostsManageController.delete);
=======
import { authUser, authAdmin } from "../../middlewares/auth.middleware.js"; 

export const postsManageRouters: Router = Router();

postsManageRouters.get("/", authUser, authAdmin, PostsManageController.getAll);
postsManageRouters.post("/", authUser, authAdmin, PostsManageController.create);
postsManageRouters.put("/:postId", authUser, authAdmin, PostsManageController.update);
postsManageRouters.delete("/:postId", authUser, authAdmin, PostsManageController.delete);
>>>>>>> c3517840149118654f2ab2cd1889341c31ec390e
