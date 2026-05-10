import axiosClient from './axiosClient';

export const postsApi = {
  getAll: (params: any) => axiosClient.get('/posts', { params }),
  getDetail: (postId: string) => axiosClient.get(`/posts/detail/${postId}`),
  create: (data: any) => axiosClient.post('/posts/create-post', data),
  update: (data: any) => axiosClient.put('/posts/update-post', data),
  delete: (postId: string) => axiosClient.delete(`/posts/delete-post/${postId}`),
  toggleLikePost: (data: { postId: string }) => axiosClient.post('/posts/toggle-like-post', data),
  
  getComments: (postId: string) => axiosClient.get(`/posts/comments/${postId}`),
  createComment: (data: any) => axiosClient.post('/posts/comment', data),
  updateComment: (data: any) => axiosClient.put('/posts/update-comment', data),
  deleteComment: (commentId: string) => axiosClient.delete(`/posts/delete-comment/${commentId}`),
  toggleLikeComment: (data: { commentId: string }) => axiosClient.post('/posts/toggle-like-comment', data),
};
