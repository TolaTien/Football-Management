import axiosClient from './axiosClient';

export const adminApi = {
  approveRequest: (data: { bookId: string }) => axiosClient.post('/admin/approve-request-user', data),
  cancelBooking: (data: { bookId: string }) => axiosClient.post('/admin/cancel-booking-admin', data),
  refundUser: (data: { bookId: string }) => axiosClient.post('/admin/refund-user', data),
  verifyPayment: (data: { bookId: string, paymentMethod: string }) => axiosClient.post('/admin/verify-payment-user', data),
  getAllHistoryUser: (userId: string) => axiosClient.get(`/admin/get-all-history-user/${userId}`),
  getAllUsers: (params?: any) => axiosClient.get('/admin/users', { params }),
};
