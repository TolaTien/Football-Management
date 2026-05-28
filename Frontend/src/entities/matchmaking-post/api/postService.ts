import { $api } from '@/shared/api/axiosInstance';

export interface PostUser {
  userId: string;
  fullName: string;
  avt: string | null;
}

export interface PostItem {
  postId: string;
  hostId: string;
  description: string;
  status: 'open' | 'closed' | 'canceled';
  createdAt: string;
  users: PostUser;
  _count: {
    comments: number;
    postlike: number;
  };
  isLiked?: boolean;
}

export const postService = {
  getAllPosts: async (): Promise<PostItem[]> => {
    const { data } = await $api.get('/posts');
    // The new backend returns a paginated object { meta, items }
    if (data && data.items && Array.isArray(data.items)) {
      return data.items;
    }
    // Fallback for older/other structures
    return Array.isArray(data) ? data : (data.data || []);
  },

  toggleLikePost: async (postId: string): Promise<void> => {
    await $api.post(`/postlikes/${postId}/like`);
  },

  createPost: async (description: string): Promise<PostItem> => {
    const { data } = await $api.post('/posts', { description });
    return data.data;
  },

  updatePost: async (postId: string, description: string, status?: 'open' | 'closed' | 'canceled'): Promise<PostItem> => {
    const { data } = await $api.put(`/posts/${postId}`, { description, status });
    return data.data;
  },

  deletePost: async (postId: string): Promise<void> => {
    await $api.delete(`/posts/${postId}`);
  }
};
