import { Router } from "express";
import { authAdmin, authUser } from "../../middlewares/auth.middleware.js";
import Services from "./services.controller.js";

export const servicesRouters: Router = Router();

servicesRouters.get("/", authUser, Services.getAllServices);
servicesRouters.get("/:serviceId", authUser, Services.getServiceDetail);
servicesRouters.post("/create-service", authUser, authAdmin, Services.createService);
servicesRouters.put("/update-service", authUser, authAdmin, Services.updateService);
servicesRouters.delete("/delete-service/:serviceId", authUser, authAdmin, Services.deleteService);

