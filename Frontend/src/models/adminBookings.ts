import { useState, useCallback, useEffect } from 'react';
import api from '@/services/api';
import { message } from 'antd';

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

export default function useAdminBookingsModel() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);

  const mapBackendBookingToFrontend = (b: any): Booking => {
    const startDate = b.startTime ? new Date(b.startTime) : new Date();
    const endDate = b.endTime ? new Date(b.endTime) : new Date();

    // Format YYYY-MM-DD local time
    const localYear = startDate.getFullYear();
    const localMonth = String(startDate.getMonth() + 1).padStart(2, '0');
    const localDay = String(startDate.getDate()).padStart(2, '0');
    const dateStr = `${localYear}-${localMonth}-${localDay}`;

    const startHourStr = String(startDate.getHours()).padStart(2, '0') + ':' + String(startDate.getMinutes()).padStart(2, '0');
    const endHourStr = String(endDate.getHours()).padStart(2, '0') + ':' + String(endDate.getMinutes()).padStart(2, '0');

    let paymentStatus: 'deposited' | 'unpaid' | 'paid' = 'unpaid';
    if (b.paymentStatus === 'paid') {
      paymentStatus = 'paid';
    } else if (b.paymentStatus === 'partial') {
      paymentStatus = 'deposited';
    }

    return {
      id: b.bookId,
      userName: b.users?.fullName || `Khách (${b.phone || 'Vãng lai'})`,
      phone: b.phone || b.users?.phone || '',
      pitchId: b.pitchId,
      pitchName: b.pitch?.namePitch || `Sân ${b.pitchId}`,
      date: dateStr,
      startTime: startHourStr,
      endTime: endHourStr,
      status: b.status === 'rejected' ? 'rejected' : b.status === 'approved' ? 'approved' : 'pending',
      paymentStatus,
      price: b.total || b.pitchPriceAtBooking || 0,
      note: b.cancelrequests?.[0]?.content || '',
      source: b.userId ? 'app' : 'phone'
    };
  };

  // Tải tất cả bookings (kết hợp pending và approved)
  const fetchAllBookings = useCallback(async () => {
    setLoading(true);
    try {
      // 1. Tải các request đang chờ phê duyệt
      const pendingResponse = await api.get('/booking/get-all-request-admin');
      const pendingData = pendingResponse.data?.data?.booking || [];
      const mappedPending = pendingData.map((b: any) => mapBackendBookingToFrontend(b));

      // 2. Tải danh sách sân (chứa các booking đã duyệt)
      const pitchesResponse = await api.get('/pitch');
      const pitchesData = pitchesResponse.data?.data || [];

      const mappedApproved: Booking[] = [];
      pitchesData.forEach((p: any) => {
        if (p.booking && p.booking.length > 0) {
          p.booking.forEach((b: any) => {
            // Thêm thông tin sân vào booking để khớp giao diện
            mappedApproved.push(mapBackendBookingToFrontend({
              ...b,
              pitch: { namePitch: p.namePitch, pitchCategory: p.pitchCategory }
            }));
          });
        }
      });

      // Kết hợp 2 nguồn dữ liệu
      const combined = [...mappedPending, ...mappedApproved];

      // Loại bỏ trùng lặp nếu có
      const uniqueBookings = combined.filter((b, index, self) =>
        index === self.findIndex((t) => t.id === b.id)
      );

      setBookings(uniqueBookings);
    } catch (error) {
      console.error("Lỗi tải lịch đặt sân:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllBookings();
  }, [fetchAllBookings]);

  // Cập nhật trạng thái duyệt đặt sân
  const updateBookingStatus = useCallback(async (id: string, status: Booking['status']) => {
    try {
      if (status === 'approved') {
        await api.post('/admin/approve-request-user', { bookId: id });
        message.success('Đã phê duyệt yêu cầu đặt sân!');
      } else if (status === 'cancelled' || status === 'rejected') {
        await api.post('/admin/cancel-booking-admin', { bookId: id });
        message.success('Đã hủy đặt sân thành công!');
      }
      fetchAllBookings();
    } catch (error: any) {
      console.error("Lỗi cập nhật trạng thái đặt sân:", error);
      message.error(error.response?.data?.message || 'Không thể cập nhật trạng thái');
    }
  }, [fetchAllBookings]);

  // Cập nhật trạng thái thanh toán
  const updatePaymentStatus = useCallback(async (id: string, paymentStatus: Booking['paymentStatus']) => {
    try {
      // Ánh xạ sang phương thức thanh toán banking hoặc cash
      const method = paymentStatus === 'paid' ? 'banking' : 'cash';
      await api.post('/admin/verify-payment-user', {
        bookId: id,
        paymentMethod: method
      });
      message.success('Cập nhật trạng thái thanh toán thành công!');
      fetchAllBookings();
    } catch (error: any) {
      console.error("Lỗi cập nhật thanh toán:", error);
      message.error(error.response?.data?.message || 'Lỗi xác nhận thanh toán');
    }
  }, [fetchAllBookings]);

  // Tạo đặt sân thủ công từ Admin
  const addManualBooking = useCallback(async (booking: Omit<Booking, 'id'>) => {
    try {
      // Chuyển date và time sang đối tượng Date cho BE
      const startDateTime = new Date(`${booking.date}T${booking.startTime}:00`);
      const endDateTime = new Date(`${booking.date}T${booking.endTime}:00`);

      await api.post('/booking/booking-booking-admin', {
        pitchId: booking.pitchId,
        phone: booking.phone || '0000000000',
        startTime: startDateTime.toISOString(),
        endTime: endDateTime.toISOString(),
        pitchPriceAtBooking: booking.price,
        service: []
      });

      message.success('Tạo đặt sân mới thành công!');
      fetchAllBookings();
    } catch (error: any) {
      console.error("Lỗi đặt sân thủ công:", error);
      message.error(error.response?.data?.message || 'Lỗi tạo lịch đặt sân');
    }
  }, [fetchAllBookings]);

  // Xóa đặt lịch (Mock/State Filter)
  const deleteBooking = useCallback(async (id: string) => {
    try {
      // Hủy trên BE trước
      await api.post('/admin/cancel-booking-admin', { bookId: id });
      setBookings((prev) => prev.filter((b) => b.id !== id));
      message.success('Đã xóa lịch đặt!');
    } catch (error) {
      // Nếu hủy thất bại (do đã hủy rồi hoặc lỗi khác), vẫn lọc ở FE
      setBookings((prev) => prev.filter((b) => b.id !== id));
    }
  }, []);

  return {
    bookings,
    loading,
    fetchAllBookings,
    updateBookingStatus,
    updatePaymentStatus,
    addManualBooking,
    deleteBooking,
  };
}