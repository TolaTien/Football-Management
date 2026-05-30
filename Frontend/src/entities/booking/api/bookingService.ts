import { axiosInstance } from '@/shared/api';
import { $api } from '@/shared/api/axiosInstance';
import type { CreateBookingDto } from '../model/types';

export interface BookPitchPayload {
  pitchId: string;
  startTime: string;
  endTime: string;
  services?: string[];
  paymentMethod: string;
}

export interface PaymentPayload {
  bookingId: string;
  amount: number;
}

// Admin-facing service (lowercase)
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

  refund: (bookId: string) =>
    axiosInstance.post('/admin/refund-user', { bookId }),
};

// Customer-facing service (PascalCase)
export const BookingService = {
  /**
   * Đặt sân cho người dùng.
   */
  bookPitchForUser: async (payload: BookPitchPayload): Promise<any> => {
    const { data } = await $api.post('/booking/booking-pitch-user', payload);
    return data.data;
  },

  /**
   * Thanh toán (một phần hoặc toàn bộ).
   */
  partialPayment: async (payload: PaymentPayload): Promise<any> => {
    const { data } = await $api.post('/booking/payment-user', payload);
    return data.data;
  },

  /**
   * Hủy đặt sân.
   */
  cancelBooking: async (bookId: string, content: string = 'Người dùng yêu cầu hủy'): Promise<any> => {
    const { data } = await $api.post('/booking/cancel-booking-user', { bookId, content });
    return data.data;
  },
};
