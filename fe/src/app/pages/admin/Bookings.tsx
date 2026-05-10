import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Filter, Check, X, Clock, MapPin, User, DollarSign, Calendar, RefreshCcw, DollarSign as MoneyIcon } from 'lucide-react';
import { bookingApi } from '../../../api/booking.api';
import { adminApi } from '../../../api/admin.api';
import { message, Spin } from 'antd';

export default function Bookings() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await bookingApi.getAllRequestAdmin({ page: 1 });
      setBookings(res.data?.booking || []);
    } catch(err) {
      message.error("Lỗi khi tải danh sách");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await adminApi.approveRequest({ bookId: id });
      message.success("Duyệt đơn thành công");
      fetchBookings();
    } catch(err) {
      message.error("Duyệt đơn thất bại");
    }
  };

  const handleReject = async (id: string) => {
    try {
      await adminApi.cancelBooking({ bookId: id });
      message.success("Đã từ chối/huỷ đơn");
      fetchBookings();
    } catch(err) {
      message.error("Từ chối thất bại");
    }
  };

  const handleVerifyPayment = async (id: string) => {
    try {
      await adminApi.verifyPayment({ bookId: id, paymentMethod: 'cash' });
      message.success("Xác nhận thu tiền thành công");
      fetchBookings();
    } catch(err) {
      message.error("Xác nhận thu tiền thất bại");
    }
  };

  const handleRefund = async (id: string) => {
    try {
      await adminApi.refundUser({ bookId: id });
      message.success("Đã hoàn cọc cho người dùng");
      fetchBookings();
    } catch(err) {
      message.error("Hoàn cọc thất bại");
    }
  };

  const filteredBookings = bookings.filter(booking => {
    const userName = booking.users?.fullName || '';
    const pitchName = booking.pitch?.namePitch || '';
    return userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
           pitchName.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold mb-1">Quản lý đặt sân</h2>
        <p className="text-sm text-black/50">Xem và quản lý tất cả các đặt sân</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-black/30" />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên hoặc sân..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white/80 backdrop-blur-xl border border-black/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/50"
          />
        </div>
      </div>

      {/* Bookings Table */}
      {loading ? <div className="p-10 flex justify-center"><Spin size="large" /></div> : 
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-black/5 overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-orange-50 to-red-50 border-b border-black/10">
                <th className="text-left py-4 px-6 text-sm font-semibold">Người dùng</th>
                <th className="text-left py-4 px-6 text-sm font-semibold">Sân</th>
                <th className="text-left py-4 px-6 text-sm font-semibold">Ngày</th>
                <th className="text-left py-4 px-6 text-sm font-semibold">Giờ</th>
                <th className="text-left py-4 px-6 text-sm font-semibold">Trạng thái/Thanh toán</th>
                <th className="text-right py-4 px-6 text-sm font-semibold">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((booking, index) => {
                const startTime = new Date(booking.startTime);
                const endTime = new Date(booking.endTime);
                
                let statusBadge = '';
                if (booking.status === 'pending') statusBadge = 'bg-yellow-100 text-yellow-700';
                else if (booking.status === 'approved') statusBadge = 'bg-green-100 text-green-700';
                else if (booking.status === 'rejected') statusBadge = 'bg-red-100 text-red-700';

                return (
                <motion.tr
                  key={booking.bookId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.05 }}
                  className="border-b border-black/5 hover:bg-orange-50/50 transition-colors"
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white font-semibold text-sm">
                        {booking.users?.avt ? <img src={booking.users.avt} className="w-full h-full rounded-full object-cover" /> : booking.users?.fullName?.substring(0, 2).toUpperCase() || 'U'}
                      </div>
                      <div>
                        <p className="font-medium">{booking.users?.fullName}</p>
                        <p className="text-xs text-black/50">{booking.users?.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-black/30" />
                      <span>{booking.pitch?.namePitch}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-black/30" />
                      <span>{startTime.toLocaleDateString('vi-VN')}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-black/30" />
                      <span>{startTime.getHours()}:{String(startTime.getMinutes()).padStart(2,'0')} - {endTime.getHours()}:{String(endTime.getMinutes()).padStart(2,'0')}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex flex-col gap-1">
                      <span className={`w-fit px-3 py-1 rounded-lg text-xs font-medium ${statusBadge}`}>
                        {booking.status === 'approved' ? 'Đã duyệt' : booking.status === 'rejected' ? 'Đã huỷ' : 'Chờ duyệt'}
                      </span>
                      <span className="text-xs text-black/50">
                        {booking.paymentStatus === 'paid' ? 'Đã thanh toán đủ' : booking.paymentStatus === 'partial' ? 'Đã cọc' : 'Chưa thanh toán'}
                      </span>
                      <span className="font-semibold">{booking.total?.toLocaleString()} VNĐ</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-end gap-2">
                      {booking.status === 'pending' && (
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleApprove(booking.bookId)}
                          className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
                          title="Duyệt đơn"
                        >
                          <Check className="w-4 h-4" />
                        </motion.button>
                      )}
                      
                      {booking.status === 'approved' && booking.paymentStatus === 'partial' && (
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleVerifyPayment(booking.bookId)}
                          className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                          title="Xác nhận thu tiền tại sân"
                        >
                          <MoneyIcon className="w-4 h-4" />
                        </motion.button>
                      )}

                      {booking.status === 'rejected' && booking.paymentStatus === 'partial' && (
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleRefund(booking.bookId)}
                          className="p-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-colors"
                          title="Hoàn cọc"
                        >
                          <RefreshCcw className="w-4 h-4" />
                        </motion.button>
                      )}

                      {(booking.status === 'pending' || booking.status === 'approved') && (
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleReject(booking.bookId)}
                          className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                          title="Huỷ đơn"
                        >
                          <X className="w-4 h-4" />
                        </motion.button>
                      )}
                    </div>
                  </td>
                </motion.tr>
              )})}
              {filteredBookings.length === 0 && <tr><td colSpan={6} className="py-4 text-center text-gray-500">Chưa có dữ liệu</td></tr>}
            </tbody>
          </table>
        </div>
      </motion.div>}
    </div>
  );
}