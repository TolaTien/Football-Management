import type { Role } from "../../config/types.js";

export type PostStatus = "open" | "closed" | "canceled";

export interface CreatePostDto {
    description: string;
}

export interface UpdatePostDto {
    postId: string;
    description?: string;
    status?: PostStatus;
}

export interface GetPostsQuery {
    page?: string;
    perPage?: string;
    search?: string;
    status?: PostStatus;
    hostId?: string;
}

export interface ToggleLikePostDto {
    postId: string;
}

export interface CreateCommentDto {
    postId: string;
    content: string;
    parentId?: string;
}

export interface UpdateCommentDto {
    commentId: string;
    content: string;
}

export interface ToggleLikeCommentDto {
    commentId: string;
}

export interface UserContext {
    userId: string;
    role: Role;
}

