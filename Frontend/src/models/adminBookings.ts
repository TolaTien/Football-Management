import { useState, useCallback } from 'react';

export default function useAdminBookingsModel() {
  const [bookings, setBookings] = useState([
    { id: 'b1', userName: 'Nguyễn Văn Hùng', pitch: 'Sân 7 - Khu A', time: '17:30 - 19:00', date: '2023-10-24', status: 'approved', price: 500000 },
    { id: 'b2', userName: 'Minh Tú FC', pitch: 'Sân 5 - Khu B', time: '18:00 - 19:30', date: '2023-10-24', status: 'pending', price: 300000 },
    { id: 'b3', userName: 'Lê Anh Dũng', pitch: 'Sân 7 - Khu A', time: '19:30 - 21:00', date: '2023-10-24', status: 'approved', price: 500000 },
    { id: 'b4', userName: 'Team Xanh', pitch: 'Sân 5 - Khu A', time: '20:00 - 21:30', date: '2023-10-25', status: 'pending', price: 400000 },
  ]);

  const updateBookingStatus = useCallback((id: string, status: 'approved' | 'rejected') => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status } : b))
    );
  }, []);

  const addManualBooking = useCallback((booking: any) => {
    setBookings((prev) => [{ ...booking, id: `b${Date.now()}`, status: 'approved' }, ...prev]);
  }, []);

  return {
    bookings,
    updateBookingStatus,
    addManualBooking,
  };
}
