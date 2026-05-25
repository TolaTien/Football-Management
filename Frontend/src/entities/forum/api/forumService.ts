import { axiosInstance } from '@/shared/api';

export interface CreatePostDto {
  description: string;
}

export interface UpdatePostDto {
  description?: string;
  status?: 'open' | 'closed' | 'canceled';
}

export const forumService = {
  getAllPosts: () =>
    axiosInstance.get('/postsManage'),

  createPost: (dto: CreatePostDto) =>
    axiosInstance.post('/postsManage', dto),

  updatePost: (postId: string, dto: UpdatePostDto) =>
    axiosInstance.put(`/postsManage/${postId}`, dto),

  deletePost: (postId: string) =>
    axiosInstance.delete(`/postsManage/${postId}`),
};
