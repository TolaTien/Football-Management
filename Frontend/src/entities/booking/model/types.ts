export type BookingStatus = 'approved' | 'pending' | 'rejected' | 'cancelled';
export type PaymentStatus = 'deposited' | 'unpaid' | 'paid';
export type BookingSource = 'admin' | 'app' | 'phone';

export interface Booking {
  id: string;
  userName: string;
  phone?: string;
  pitchId: string;
  pitchName: string;
  date: string;
  startTime: string;
  endTime: string;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  price: number;
  note?: string;
  source?: BookingSource;
}

export interface CreateBookingDto {
  pitchId: string;
  phone: string;
  startTime: string;
  endTime: string;
  pitchPriceAtBooking: number;
  service: string[];
}
