import { $api } from '@/shared/api/axiosInstance';

export interface CommentUser {
  userId: string;
  fullName: string;
  avt: string | null;
}

export interface CommentItem {
  commentId: string;
  content: string;
  postId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  users: CommentUser;
  _count?: {
    commentlike: number;
  };
  isLiked?: boolean; // We might need to map this based on current user if API returns it, or handle locally
}

export const commentsService = {
  getCommentsByPost: async (postId: string): Promise<CommentItem[]> => {
    // Backend trả về array trực tiếp, axios wrap thêm 1 lớp 'data'
    const { data } = await $api.get(`/comments/post/${postId}`);
    return Array.isArray(data) ? data : [];
  },

  createComment: async (postId: string, content: string): Promise<CommentItem> => {
    // Backend trả về { message, data: newComment }
    const { data } = await $api.post('/comments/', { postId, content });
    return data.data;
  },

  deleteComment: async (commentId: string): Promise<void> => {
    await $api.delete(`/comments/${commentId}`);
  },

  toggleLikeComment: async (commentId: string): Promise<{ action: 'liked' | 'unliked', message: string }> => {
    // Backend trả về { action, message } trực tiếp
    const { data } = await $api.post(`/comments/${commentId}/like`);
    return data;
  }
};
