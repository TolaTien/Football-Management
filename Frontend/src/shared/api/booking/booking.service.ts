import { $api } from '../base';

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
