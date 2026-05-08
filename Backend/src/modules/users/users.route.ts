import { Router } from "express";
import { authUser } from "../../middlewares/auth.middleware.js";
import  User  from './users.controller.js';
import upload from "../../middlewares/upload.middlewares.js";

export const userRouters: Router = Router();

userRouters.put('/update-profile-user', authUser, upload.single('avt'), User.updateProfileUser)