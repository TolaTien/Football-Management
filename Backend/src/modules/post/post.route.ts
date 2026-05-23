import { Router } from "express";
import PostController from "./post.controller.js";

export const postRouters: Router = Router();

postRouters.get("/", PostController.getAllPosts);