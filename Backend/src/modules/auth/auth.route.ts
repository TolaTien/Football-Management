import { Router } from "express";
import  Auth from "../auth/auth.controller.js"
import { authUser } from "../../middlewares/auth.middleware.js";
export const authRouters: Router = Router();

authRouters.post('/login', Auth.login );
authRouters.post('/register', Auth.register);
authRouters.post('/refresh-token',authUser, Auth.refreshToken);
authRouters.get('/checkAuth', authUser, Auth.checkAuth);
authRouters.post('/logout', authUser, Auth.logout);
