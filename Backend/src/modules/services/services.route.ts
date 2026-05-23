import { Router } from "express";
import ServiceController from "./services.controller.js";
import { authUser } from "../../middlewares/auth.middleware.js"; 

<<<<<<< HEAD

=======
>>>>>>> c3517840149118654f2ab2cd1889341c31ec390e
export const serviceRouters: Router = Router();

serviceRouters.get("/", authUser, ServiceController.getAll);
serviceRouters.get("/:id", authUser, ServiceController.getOne);
serviceRouters.post("/", authUser,  ServiceController.create);
serviceRouters.put("/:id", authUser, ServiceController.update);
<<<<<<< HEAD
serviceRouters.delete("/:id", authUser, ServiceController.delete); 
=======
serviceRouters.delete("/:id", authUser, ServiceController.delete);
>>>>>>> c3517840149118654f2ab2cd1889341c31ec390e
