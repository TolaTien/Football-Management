import { Router } from "express";
import PostAdminController from "./posts.admin.controller.js";
import { authUser } from "../../middlewares/auth.middleware.js";

export const postAdminRouters: Router = Router();

postAdminRouters.get("/", authUser, PostAdminController.getAll);
postAdminRouters.get("/:id", authUser, PostAdminController.getOne);
postAdminRouters.patch("/:id/status", authUser, PostAdminController.changeStatus);
postAdminRouters.delete("/:id", authUser, PostAdminController.remove);