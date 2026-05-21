import { axiosInstance } from '@/shared/api';
import type { CreateBookingDto } from '../model/types';

export const bookingService = {
  getAllRequests: () =>
    axiosInstance.get('/booking/get-all-request-admin'),

  getPitchesWithBookings: () =>
    axiosInstance.get('/pitch'),

  approve: (bookId: string) =>
    axiosInstance.post('/admin/approve-request-user', { bookId }),

  cancel: (bookId: string) =>
    axiosInstance.post('/admin/cancel-booking-admin', { bookId }),

  verifyPayment: (bookId: string, paymentMethod: 'banking' | 'cash') =>
    axiosInstance.post('/admin/verify-payment-user', { bookId, paymentMethod }),

  createAdminBooking: (dto: CreateBookingDto) =>
    axiosInstance.post('/booking/booking-booking-admin', dto),
};
