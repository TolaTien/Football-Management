import { Router } from "express";
import { authUser } from "../../middlewares/auth.middleware.js";
import Posts from "./posts.controller.js";

export const postsRouters: Router = Router();

postsRouters.get("/", authUser, Posts.getPosts);
postsRouters.get("/detail/:postId", authUser, Posts.getPostDetail);
postsRouters.post("/create-post", authUser, Posts.createPost);
postsRouters.put("/update-post", authUser, Posts.updatePost);
postsRouters.delete("/delete-post/:postId", authUser, Posts.deletePost);
postsRouters.post("/toggle-like-post", authUser, Posts.toggleLikePost);

postsRouters.get("/comments/:postId", authUser, Posts.getCommentsByPost);
postsRouters.post("/comment", authUser, Posts.createComment);
postsRouters.put("/update-comment", authUser, Posts.updateComment);
postsRouters.delete("/delete-comment/:commentId", authUser, Posts.deleteComment);
postsRouters.post("/toggle-like-comment", authUser, Posts.toggleLikeComment);

