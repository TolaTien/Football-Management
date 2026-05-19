import { Router } from "express";
import ServiceController from "./services.controller.js";
import { authUser } from "../../middlewares/auth.middleware.js"; // Middleware check đăng nhập (nếu có)
import { validate } from "../../middlewares/validate.middleware.js"; // Middleware kiểm tra schema
import { ServicesSchema } from "./services.schema.js"; // Cái khuôn vừa viết

export const serviceRouters: Router = Router();

serviceRouters.get("/", authUser, ServiceController.getAll);
serviceRouters.get("/:id", authUser, validate(ServicesSchema.paramsId), ServiceController.getOne);
serviceRouters.post("/", authUser, validate(ServicesSchema.create), ServiceController.create);
serviceRouters.put("/:id", authUser, validate(ServicesSchema.paramsId), validate(ServicesSchema.update), ServiceController.update);
serviceRouters.delete("/:id", authUser, validate(ServicesSchema.paramsId), ServiceController.delete);