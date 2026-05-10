import { StatusCodes } from "http-status-codes";
import { v4 as uuidv4 } from "uuid";
import { prisma } from "../../config/prisma.js";
import { ApiError } from "../../utils/ApiError.js";
import {
    CreateCommentDto,
    CreatePostDto,
    GetPostsQuery,
    ToggleLikeCommentDto,
    ToggleLikePostDto,
    UpdateCommentDto,
    UpdatePostDto,
    UserContext
} from "./posts.schema.js";

export class PostsService {
    static async getPosts(query: GetPostsQuery, context: UserContext) {
        const page = Math.max(Number(query.page) || 1, 1);
        const perPage = Math.min(Math.max(Number(query.perPage) || 10, 1), 50);
        const skip = (page - 1) * perPage;

        const filter: any = {};
        if (query.status) {
            filter.status = query.status;
        } else if (context.role !== "admin") {
            filter.status = { not: "canceled" };
        }
        if (query.hostId) filter.hostId = query.hostId;
        if (query.search) filter.description = { contains: String(query.search) };

        const [posts, total] = await Promise.all([
            prisma.post.findMany({
                where: filter,
                skip,
                take: perPage,
                orderBy: { createdAt: "desc" },
                include: {
                    users: {
                        select: {
                            userId: true,
                            fullName: true,
                            avt: true
                        }
                    },
                    _count: {
                        select: {
                            comments: true,
                            postlike: true
                        }
                    }
                }
            }),
            prisma.post.count({ where: filter })
        ]);

        const totalPages = Math.ceil(total / perPage);
        return { posts, pagination: { total, totalPages, page, perPage } };
    }

    static async getPostDetail(postId: string, context: UserContext) {
        const post = await prisma.post.findUnique({
            where: { postId },
            include: {
                users: {
                    select: {
                        userId: true,
                        fullName: true,
                        avt: true
                    }
                },
                _count: {
                    select: {
                        comments: true,
                        postlike: true
                    }
                }
            }
        });
        if (!post) {
            throw new ApiError(StatusCodes.NOT_FOUND, "Không tìm thấy bài viết");
        }
        if (context.role !== "admin" && post.status === "canceled") {
            throw new ApiError(StatusCodes.NOT_FOUND, "Không tìm thấy bài viết");
        }
        return post;
    }

    static async createPost(dto: CreatePostDto, context: UserContext) {
        if (!dto.description?.trim()) {
            throw new ApiError(StatusCodes.BAD_REQUEST, "Nội dung bài viết không được để trống");
        }

        return prisma.post.create({
            data: {
                postId: uuidv4(),
                hostId: context.userId,
                description: dto.description.trim(),
                status: "open"
            }
        });
    }

    static async updatePost(dto: UpdatePostDto, context: UserContext) {
        const post = await prisma.post.findUnique({ where: { postId: dto.postId } });
        if (!post) {
            throw new ApiError(StatusCodes.NOT_FOUND, "Không tìm thấy bài viết");
        }
        if (post.hostId !== context.userId && context.role !== "admin") {
            throw new ApiError(StatusCodes.FORBIDDEN, "Không có quyền cập nhật bài viết này");
        }

        if (dto.description !== undefined && !dto.description.trim()) {
            throw new ApiError(StatusCodes.BAD_REQUEST, "Nội dung bài viết không được để trống");
        }
        if (dto.status !== undefined && dto.status === "canceled" && context.role !== "admin") {
            throw new ApiError(StatusCodes.FORBIDDEN, "Bạn không có quyền hủy bài viết");
        }

        const updateData: any = {};
        if (dto.description !== undefined) updateData.description = dto.description.trim();
        if (dto.status !== undefined) updateData.status = dto.status;
        if (Object.keys(updateData).length === 0) {
            throw new ApiError(StatusCodes.BAD_REQUEST, "Không có dữ liệu để cập nhật");
        }

        return prisma.post.update({
            where: { postId: dto.postId },
            data: updateData
        });
    }

    static async deletePost(postId: string, context: UserContext) {
        const post = await prisma.post.findUnique({ where: { postId } });
        if (!post) {
            throw new ApiError(StatusCodes.NOT_FOUND, "Không tìm thấy bài viết");
        }
        if (post.hostId !== context.userId && context.role !== "admin") {
            throw new ApiError(StatusCodes.FORBIDDEN, "Không có quyền xóa bài viết này");
        }
        return prisma.post.delete({ where: { postId } });
    }

    static async toggleLikePost(dto: ToggleLikePostDto, context: UserContext) {
        const post = await prisma.post.findUnique({ where: { postId: dto.postId } });
        if (!post) {
            throw new ApiError(StatusCodes.NOT_FOUND, "Không tìm thấy bài viết");
        }
        if (post.status !== "open") {
            throw new ApiError(StatusCodes.BAD_REQUEST, "Chỉ có thể thích bài viết đang mở");
        }

        const existingLike = await prisma.postlike.findUnique({
            where: {
                userId_postId: {
                    userId: context.userId,
                    postId: dto.postId
                }
            }
        });

        let liked = false;
        if (existingLike) {
            await prisma.postlike.delete({
                where: {
                    userId_postId: {
                        userId: context.userId,
                        postId: dto.postId
                    }
                }
            });
        } else {
            await prisma.postlike.create({
                data: {
                    userId: context.userId,
                    postId: dto.postId
                }
            });
            liked = true;
        }

        const totalLikes = await prisma.postlike.count({ where: { postId: dto.postId } });
        return { liked, totalLikes };
    }

    static async getCommentsByPost(postId: string, context: UserContext) {
        const post = await prisma.post.findUnique({ where: { postId } });
        if (!post) {
            throw new ApiError(StatusCodes.NOT_FOUND, "Không tìm thấy bài viết");
        }
        if (context.role !== "admin" && post.status === "canceled") {
            throw new ApiError(StatusCodes.NOT_FOUND, "Không tìm thấy bài viết");
        }

        const comments = await prisma.comments.findMany({
            where: { postId },
            orderBy: { createdAt: "asc" },
            include: {
                users: {
                    select: {
                        userId: true,
                        fullName: true,
                        avt: true
                    }
                },
                _count: {
                    select: { commentlike: true }
                }
            }
        });

        type CommentNode = (typeof comments)[number] & { replies: CommentNode[] };
        const mapped = new Map<string, CommentNode>();
        comments.forEach((item) => {
            mapped.set(item.commentId, { ...item, replies: [] });
        });

        const roots: CommentNode[] = [];
        mapped.forEach((item) => {
            if (item.parentId && mapped.has(item.parentId)) {
                mapped.get(item.parentId)!.replies.push(item);
            } else {
                roots.push(item);
            }
        });

        return roots;
    }

    static async createComment(dto: CreateCommentDto, context: UserContext) {
        if (!dto.content?.trim()) {
            throw new ApiError(StatusCodes.BAD_REQUEST, "Nội dung bình luận không được để trống");
        }

        const post = await prisma.post.findUnique({ where: { postId: dto.postId } });
        if (!post) {
            throw new ApiError(StatusCodes.NOT_FOUND, "Không tìm thấy bài viết");
        }
        if (post.status !== "open") {
            throw new ApiError(StatusCodes.BAD_REQUEST, "Bài viết đã đóng, không thể bình luận");
        }

        if (dto.parentId) {
            const parent = await prisma.comments.findUnique({ where: { commentId: dto.parentId } });
            if (!parent || parent.postId !== dto.postId) {
                throw new ApiError(StatusCodes.BAD_REQUEST, "Bình luận cha không hợp lệ");
            }
        }

        return prisma.comments.create({
            data: {
                commentId: uuidv4(),
                postId: dto.postId,
                userId: context.userId,
                content: dto.content.trim(),
                parentId: dto.parentId
            },
            include: {
                users: {
                    select: {
                        userId: true,
                        fullName: true,
                        avt: true
                    }
                },
                _count: {
                    select: { commentlike: true }
                }
            }
        });
    }

    static async updateComment(dto: UpdateCommentDto, context: UserContext) {
        if (!dto.content?.trim()) {
            throw new ApiError(StatusCodes.BAD_REQUEST, "Nội dung bình luận không được để trống");
        }

        const comment = await prisma.comments.findUnique({ where: { commentId: dto.commentId } });
        if (!comment) {
            throw new ApiError(StatusCodes.NOT_FOUND, "Không tìm thấy bình luận");
        }
        if (comment.userId !== context.userId && context.role !== "admin") {
            throw new ApiError(StatusCodes.FORBIDDEN, "Không có quyền cập nhật bình luận này");
        }

        return prisma.comments.update({
            where: { commentId: dto.commentId },
            data: { content: dto.content.trim() }
        });
    }

    static async deleteComment(commentId: string, context: UserContext) {
        const comment = await prisma.comments.findUnique({ where: { commentId } });
        if (!comment) {
            throw new ApiError(StatusCodes.NOT_FOUND, "Không tìm thấy bình luận");
        }
        if (comment.userId !== context.userId && context.role !== "admin") {
            throw new ApiError(StatusCodes.FORBIDDEN, "Không có quyền xóa bình luận này");
        }

        return prisma.comments.delete({ where: { commentId } });
    }

    static async toggleLikeComment(dto: ToggleLikeCommentDto, context: UserContext) {
        const comment = await prisma.comments.findUnique({ where: { commentId: dto.commentId } });
        if (!comment) {
            throw new ApiError(StatusCodes.NOT_FOUND, "Không tìm thấy bình luận");
        }

        const existingLike = await prisma.commentlike.findUnique({
            where: {
                userId_commentId: {
                    userId: context.userId,
                    commentId: dto.commentId
                }
            }
        });

        let liked = false;
        if (existingLike) {
            await prisma.commentlike.delete({
                where: {
                    userId_commentId: {
                        userId: context.userId,
                        commentId: dto.commentId
                    }
                }
            });
        } else {
            await prisma.commentlike.create({
                data: {
                    userId: context.userId,
                    commentId: dto.commentId
                }
            });
            liked = true;
        }

        const totalLikes = await prisma.commentlike.count({ where: { commentId: dto.commentId } });
        return { liked, totalLikes };
    }
}

