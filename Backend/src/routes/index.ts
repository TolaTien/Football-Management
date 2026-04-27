import { Router } from "express";
import { authRouters } from "../modules/auth/auth.route.js";
import { userRouters } from "../modules/users/users.route.js";

export const Routers: Router = Router();

Routers.use('/auth', authRouters)
Routers.use('/user', userRouters)