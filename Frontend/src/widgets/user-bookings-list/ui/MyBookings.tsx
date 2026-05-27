import React, { useEffect, useState } from 'react';
import { useAppDispatch } from '@/app/store/hooks';
import { Button, Spin, Empty, Modal, Tag, message } from 'antd';
import { UsersService } from '@/entities/user/api/userService';
import { BookingService } from '@/entities/booking/api/bookingService';
import { addNotification } from '@/entities/notification/model/notificationSlice';
import dayjs from 'dayjs';

const MyBookings: React.FC = () => {
  const dispatch = useAppDispatch();
  const [bookings, setBookings] = useState<any[]>([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setBookingsLoading(true);
    try {
      const res = await UsersService.getHistoryBooking(1);
      setBookings(res.history || []);
    } catch (err) {
      message.error('Không thể tải lịch sử đặt sân');
    } finally {
      setBookingsLoading(false);
    }
  };

  const handleCancelBooking = (bookingId: string) => {
    if (!bookingId) {
      message.error('Mã đơn hàng không hợp lệ');
      return;
    }
    
    Modal.confirm({
      title: 'Xác nhận hủy đặt sân',
      content: 'Bạn có chắc chắn muốn hủy yêu cầu đặt sân này không? Hành động này không thể hoàn tác.',
      okText: 'Hủy sân',
      okType: 'danger',
      cancelText: 'Quay lại',
      onOk: async () => {
        try {
          await BookingService.cancelBooking(bookingId);
          
          dispatch(addNotification({
            id: `cancel-${Date.now()}`,
            title: 'Hủy đặt sân thành công',
            content: `Yêu cầu hủy đặt sân (Mã đơn: ${bookingId}) đã được xử lý thành công.`,
            type: 'booking'
          }));

          message.success('Đã hủy đặt sân thành công');
          await fetchBookings();
        } catch (err: any) {
          const errMsg = err?.response?.data?.message || err?.message || 'Không thể hủy đặt sân';
          message.error(errMsg);
        }
      },
    });
  };

  const getStatusTag = (status: string) => {
    const s = status?.toLowerCase();
    switch (s) {
      case 'approved': 
      case 'confirmed':
        return <Tag color="success">Approved</Tag>;
      case 'pending': 
        return <Tag color="warning">Pending</Tag>;
      case 'rejected': 
      case 'cancelled':
        return <Tag color="error">Cancelled</Tag>;
      default: return <Tag color="default">{status || 'Unknown'}</Tag>;
    }
  };

  return (
    <section className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/20">
        <h3 className="text-lg font-semibold text-primary flex items-center gap-2 m-0">
          Booking History
        </h3>
        <Button onClick={fetchBookings} size="small" type="link" className="text-primary font-bold">Refresh</Button>
      </div>
      <div className="p-6">
        {bookingsLoading ? (
          <div className="flex justify-center py-10"><Spin tip="Đang tải lịch sử..." /></div>
        ) : bookings.length === 0 ? (
          <Empty description="No bookings found" />
        ) : (
          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
            {bookings.map((booking) => (
              <div key={booking.bookId} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50/50 transition-colors gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600 font-bold text-lg select-none">
                    ⚽
                  </div>
                  <div>
                    <h4 className="font-bold text-emerald-900 m-0">{booking.pitch?.namePitch || 'Sân bóng'}</h4>
                    <p className="text-xs text-secondary mt-0.5 m-0 font-body-sm">
                      {dayjs(booking.startTime).format('DD/MM/YYYY')} • {dayjs(booking.startTime).format('HH:mm')} - {dayjs(booking.endTime).format('HH:mm')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 justify-between sm:justify-end">
                  <div className="text-right">
                    <p className="text-sm font-bold text-primary m-0">{(booking.total || 0).toLocaleString('vi-VN')} đ</p>
                    {getStatusTag(booking.status)}
                  </div>
                  {booking.status?.toLowerCase() === 'pending' && (
                    <Button 
                      danger 
                      size="small" 
                      onClick={() => handleCancelBooking(booking.bookId)}
                      className="font-semibold text-xs rounded-lg"
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default MyBookings;
