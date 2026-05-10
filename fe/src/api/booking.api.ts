import axiosClient from './axiosClient';

export const bookingApi = {
  bookPitchUser: (data: any) => axiosClient.post('/booking/booking-pitch-user', data),
  partialPayment: (data: any) => axiosClient.post('/booking/payment-user', data),
  cancelBookingUser: (data: { bookId: string, content: string }) => axiosClient.post('/booking/cancel-booking-user', data),
  
  // Admin only
  bookPitchAdmin: (data: any) => axiosClient.post('/booking/booking-booking-admin', data),
  getAllRequestAdmin: (params: any) => axiosClient.get('/booking/get-all-request-admin', { params }),
};
