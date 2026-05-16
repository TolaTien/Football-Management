import { useState, useCallback } from 'react';

export interface Booking {
  id: string;
  userName: string;
  phone?: string;
  pitchId: string;
  pitchName: string;
  date: string;       // 'YYYY-MM-DD'
  startTime: string;  // 'HH:mm'
  endTime: string;    // 'HH:mm'
  status: 'approved' | 'pending' | 'rejected' | 'cancelled';
  paymentStatus: 'deposited' | 'unpaid' | 'paid';
  price: number;
  note?: string;
  source?: 'admin' | 'app' | 'phone';
}

const initialBookings: Booking[] = [
  { id: 'b1', userName: 'Nguyễn Văn A', phone: '0901234567', pitchId: 'p1', pitchName: 'Sân 5 - A1', date: '2023-10-24', startTime: '08:00', endTime: '09:30', status: 'approved', paymentStatus: 'deposited', price: 300000, source: 'app' },
  { id: 'b2', userName: 'CLB Phóng Viên', phone: '0912345678', pitchId: 'p1', pitchName: 'Sân 5 - A1', date: '2023-10-24', startTime: '10:00', endTime: '11:30', status: 'approved', paymentStatus: 'deposited', price: 300000, source: 'phone', note: 'Đã TT 50%' },
  { id: 'b3', userName: 'FC Đoàn Kết', phone: '0923456789', pitchId: 'p2', pitchName: 'Sân 7 - B2', date: '2023-10-24', startTime: '07:00', endTime: '09:00', status: 'approved', paymentStatus: 'unpaid', price: 500000, source: 'app' },
  { id: 'b4', userName: 'Team Xanh', phone: '0934567890', pitchId: 'p2', pitchName: 'Sân 7 - B2', date: '2023-10-24', startTime: '17:30', endTime: '19:00', status: 'approved', paymentStatus: 'paid', price: 400000, source: 'admin' },
  { id: 'b5', userName: 'Minh Tú FC', phone: '0945678901', pitchId: 'p3', pitchName: 'Sân 5 - C1', date: '2023-10-24', startTime: '16:00', endTime: '17:30', status: 'pending', paymentStatus: 'unpaid', price: 800000, source: 'app' },
  { id: 'b6', userName: 'Lê Anh Dũng', phone: '0956789012', pitchId: 'p2', pitchName: 'Sân 7 - B2', date: '2023-10-24', startTime: '19:30', endTime: '21:00', status: 'approved', paymentStatus: 'deposited', price: 400000, source: 'phone' },
  { id: 'b7', userName: 'Hội Cựu Sinh Viên', phone: '0967890123', pitchId: 'p1', pitchName: 'Sân 5 - A1', date: '2023-10-24', startTime: '14:00', endTime: '16:00', status: 'approved', paymentStatus: 'paid', price: 600000, source: 'app' },
  { id: 'b8', userName: 'CLB Thanh Niên', phone: '0978901234', pitchId: 'p3', pitchName: 'Sân 5 - C1', date: '2023-10-24', startTime: '18:00', endTime: '20:00', status: 'pending', paymentStatus: 'unpaid', price: 1600000, source: 'phone' },
];

export default function useAdminBookingsModel() {
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);

  const updateBookingStatus = useCallback((id: string, status: Booking['status']) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status } : b))
    );
  }, []);

  const updatePaymentStatus = useCallback((id: string, paymentStatus: Booking['paymentStatus']) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, paymentStatus } : b))
    );
  }, []);

  const addManualBooking = useCallback((booking: Omit<Booking, 'id'>) => {
    setBookings((prev) => [{ ...booking, id: `b${Date.now()}` }, ...prev]);
  }, []);

  const deleteBooking = useCallback((id: string) => {
    setBookings((prev) => prev.filter((b) => b.id !== id));
  }, []);

  return {
    bookings,
    updateBookingStatus,
    updatePaymentStatus,
    addManualBooking,
    deleteBooking,
  };
}
