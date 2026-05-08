import { Router } from "express";
import AdminUserController from "./admin-user.controller.js";
import { authUser, authAdmin } from "../../middlewares/auth.middleware.js";

export const adminRouters: Router = Router();

// Kẹp middleware: Phải đi qua authUser để có req.user, rồi mới tới authAdmin check role
adminRouters.use(authUser, authAdmin);

// Các endpoint quản lý User
adminRouters.get("/users", AdminUserController.getAll);
adminRouters.get("/users/:id", AdminUserController.getById);
adminRouters.post("/users", AdminUserController.create);
adminRouters.put("/users/:id", AdminUserController.update);
adminRouters.delete("/users/:id", AdminUserController.delete);