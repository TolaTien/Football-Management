import { Router } from "express";
import { userRouters } from "../modules/auth/auth.route.js";

export const Routers: Router = Router();

Routers.use('/auth', userRouters)