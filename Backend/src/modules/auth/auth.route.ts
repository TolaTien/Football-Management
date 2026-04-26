import { Router } from "express";
import  Auth from "../auth/auth.controller.js"
export const userRouters: Router = Router();

userRouters.post('/login', Auth.login );
userRouters.post('/register', Auth.register);