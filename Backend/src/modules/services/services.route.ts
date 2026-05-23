import { Router } from "express";
import ServiceController from "./services.controller.js";
import { authUser } from "../../middlewares/auth.middleware.js"; 

export const serviceRouters: Router = Router();

serviceRouters.get("/", authUser, ServiceController.getAll);
serviceRouters.get("/:id", authUser, ServiceController.getOne);
serviceRouters.post("/", authUser,  ServiceController.create);
serviceRouters.put("/:id", authUser, ServiceController.update);
serviceRouters.delete("/:id", authUser, ServiceController.delete);