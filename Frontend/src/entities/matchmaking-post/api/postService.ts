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
    const { data } = await $api.get('/post');
    return data.data;
  },

  toggleLikePost: async (postId: string): Promise<void> => {
    await $api.post(`/post/${postId}/like`);
  }
};
