import { Router } from "express";
import  Auth from "../auth/auth.controller.js"
import { authUser } from "../../middlewares/auth.middleware.js";
export const userRouters: Router = Router();

userRouters.post('/login', Auth.login );
userRouters.post('/register', Auth.register);
userRouters.post('/refresh-token',authUser, Auth.refreshToken);
userRouters.get('/checkAuth', authUser, Auth.checkAuth);
userRouters.post('/logout', authUser, Auth.logout);
