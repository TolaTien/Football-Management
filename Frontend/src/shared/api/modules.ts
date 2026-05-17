import { $api } from './base';
import type { ApiEnvelope, PaginationMeta } from '../types/api';
import type {
  Booking,
  ForumComment,
  ForumPost,
  Notification,
  PaymentMethod,
  Pitch,
  ServiceItem,
  User,
} from '../types/domain';

export const authApi = {
  login: (payload: { email: string; password: string }) =>
    $api.post<ApiEnvelope<{ accessToken: string; refreshToken: string }>>('/auth/login', payload),
  register: (payload: { email: string; password: string; phone: string; fullName: string }) =>
    $api.post<ApiEnvelope<{ accessToken: string; refreshToken: string }>>('/auth/register', payload),
  me: () => $api.get<ApiEnvelope<User>>('/auth/checkAuth'),
  logout: () => $api.post('/auth/logout'),
};

export const userApi = {
  updateProfile: (payload: FormData) =>
    $api.put<ApiEnvelope<User>>('/user/update-profile-user', payload),
  history: (page = 1) =>
    $api.get<ApiEnvelope<{ history: Booking[]; pagination: PaginationMeta }>>('/user/get-all-history-booking', {
      params: { page },
    }),
};

export const pitchApi = {
  list: (params?: Record<string, unknown>) =>
    $api.get<ApiEnvelope<Pitch[]>>('/pitch', { params }),
  create: (payload: Record<string, unknown>) => $api.post('/pitch/create-pitch', payload),
  update: (payload: Record<string, unknown>) => $api.put('/pitch/update-pitch', payload),
  updatePrices: (payload: { pitchId: string; config: Record<string, unknown>[] }) =>
    $api.put('/pitch/update-pitch-price', payload),
};

export const serviceApi = {
  list: () => $api.get<ServiceItem[]>('/services'),
  create: (payload: Record<string, unknown>) => $api.post('/services', payload),
  update: (id: string, payload: Record<string, unknown>) => $api.put(`/services/${id}`, payload),
  remove: (id: string) => $api.delete(`/services/${id}`),
};

export const bookingApi = {
  createForUser: (payload: Record<string, unknown>) => $api.post<ApiEnvelope<Booking>>('/booking/booking-pitch-user', payload),
  payDeposit: (payload: { bookingId: string; amount: number; paymentMethod: PaymentMethod }) =>
    $api.post('/booking/payment-user', payload),
  cancelForUser: (payload: { bookId: string; content: string }) =>
    $api.post('/booking/cancel-booking-user', payload),
  createForAdmin: (payload: Record<string, unknown>) => $api.post('/booking/booking-booking-admin', payload),
  pendingRequests: (page = 1) =>
    $api.get<ApiEnvelope<{ booking: Booking[]; pagination: PaginationMeta }>>('/booking/get-all-request-admin', {
      params: { page },
    }),
};

export const adminApi = {
  approveBooking: (bookId: string) => $api.post('/admin/approve-request-user', { bookId }),
  cancelBooking: (bookId: string) => $api.post('/admin/cancel-booking-admin', { bookId }),
  refundBooking: (bookId: string) => $api.post('/admin/refund-user', { bookId }),
  verifyPayment: (bookId: string, paymentMethod: PaymentMethod) =>
    $api.post('/admin/verify-payment-user', { bookId, paymentMethod }),
  userHistory: (userId: string, page = 1) =>
    $api.get(`/admin/get-all-history-user/${userId}`, { params: { page } }),
  banUser: (userId: string, status: 'active' | 'banned') =>
    $api.patch(`/admin/ban-user/${userId}`, { status }),
  users: (params?: Record<string, unknown>) => $api.get<ApiEnvelope<{ users: User[]; meta: PaginationMeta }>>('/admin/users', { params }),
  createUser: (payload: Record<string, unknown>) => $api.post('/admin/users', payload),
  updateUser: (id: string, payload: Record<string, unknown>) => $api.put(`/admin/users/${id}`, payload),
  removeUser: (id: string) => $api.delete(`/admin/users/${id}`),
};

export const statisticApi = {
  revenue: (params?: Record<string, unknown>) => $api.get('/statistic/pitch-revenue', { params }),
  overview: (params?: Record<string, unknown>) => $api.get('/statistic/system-overview', { params }),
  topSpenders: () => $api.get('/statistic/top-spenders'),
  exportRevenue: (params?: Record<string, unknown>) =>
    $api.get('/statistic/export-revenue', { params, responseType: 'blob' }),
};

export const notificationApi = {
  list: (page = 1) =>
    $api.get<ApiEnvelope<{ notification: Notification[]; pagination: PaginationMeta }>>('/notification/get-all-notification', {
      params: { page },
    }),
  markRead: (id: string) => $api.patch(`/notification/mark-read/${id}`),
  markAllRead: () => $api.patch('/notification/mark-read-all'),
};

export const forumApi = {
  posts: (params?: Record<string, unknown>) => $api.get<ApiEnvelope<ForumPost[]>>('/posts', { params }),
  detail: (postId: string) => $api.get<ApiEnvelope<ForumPost>>(`/posts/detail/${postId}`),
  createPost: (payload: { description: string }) => $api.post('/posts/create-post', payload),
  updatePost: (payload: Record<string, unknown>) => $api.put('/posts/update-post', payload),
  deletePost: (postId: string) => $api.delete(`/posts/delete-post/${postId}`),
  likePost: (postId: string) => $api.post('/posts/toggle-like-post', { postId }),
  comments: (postId: string) => $api.get<ApiEnvelope<ForumComment[]>>(`/posts/comments/${postId}`),
  createComment: (payload: Record<string, unknown>) => $api.post('/posts/comment', payload),
  updateComment: (payload: Record<string, unknown>) => $api.put('/posts/update-comment', payload),
  deleteComment: (commentId: string) => $api.delete(`/posts/delete-comment/${commentId}`),
  likeComment: (commentId: string) => $api.post('/posts/toggle-like-comment', { commentId }),
};
