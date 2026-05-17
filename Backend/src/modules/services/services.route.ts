import { Router } from "express";
import ServiceController from "./services.controller.js";
import { authUser, authAdmin } from "../../middlewares/auth.middleware.js";

export const serviceRouters: Router = Router();

serviceRouters.get("/", ServiceController.getAll);
serviceRouters.get("/:id", ServiceController.getOne);

serviceRouters.post("/", authUser, authAdmin, ServiceController.create);
serviceRouters.put("/:id", authUser, authAdmin, ServiceController.update);
serviceRouters.delete("/:id", authUser, authAdmin, ServiceController.delete);
