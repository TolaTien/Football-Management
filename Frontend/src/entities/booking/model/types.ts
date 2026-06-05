export type BookingStatus = 'approved' | 'pending' | 'rejected' | 'cancelled';
export type PaymentStatus = 'deposited' | 'unpaid' | 'paid';
export type BookingSource = 'admin' | 'app' | 'phone';

export interface BookingPayment {
  amount?: number;
  paymentMethod?: 'banking' | 'cash' | string | null;
  type?: string | null;
}

export interface BookingServiceItem {
  servicePriceAtBooking?: number;
  quantity?: number;
  services?: {
    nameProduct?: string;
    price?: number;
  };
}

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
  pitchPriceAtBooking?: number;
  total?: number;
  payments?: BookingPayment[];
  bookingservices?: BookingServiceItem[];
  avt?: string;
  email?: string;
}

export interface CreateBookingDto {
  pitchId: string;
  phone: string;
  startTime: string;
  endTime: string;
  pitchPriceAtBooking: number;
  service: string[];
}
