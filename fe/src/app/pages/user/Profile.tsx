import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Mail, Phone, MapPin, Calendar, DollarSign, Trophy, Star, Camera, Edit, Save, CreditCard, XCircle, Check } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { userApi } from '../../../api/user.api';
import { bookingApi } from '../../../api/booking.api';
import { useAuthStore } from '../../../store/auth.store';
import { message, Spin, Modal } from 'antd';

const achievements = [
  { id: 1, icon: Trophy, title: 'Người chơi trung thành', desc: 'Tham gia thường xuyên', color: 'from-yellow-400 to-orange-500' },
  { id: 2, icon: Star, title: 'Đánh giá 5 sao', desc: 'Có nhiều đóng góp', color: 'from-blue-400 to-purple-500' },
  { id: 3, icon: Calendar, title: 'Thành viên', desc: 'Đã xác thực', color: 'from-green-400 to-emerald-500' },
];

export default function UserProfile() {
  const { user, setAuth } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    phone: user?.phone || '',
  });
  const [saving, setSaving] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await userApi.getHistoryBooking();
      setHistory(res.data || []);
    } catch(err) {
      message.error("Lỗi khi tải lịch sử");
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const form = new FormData();
      form.append('fullName', formData.fullName);
      if (formData.phone) form.append('phone', formData.phone);
      if (avatarFile) form.append('avt', avatarFile);
      
      const res = await userApi.updateProfile(form);
      setAuth(res.data);
      setIsEditing(false);
      setAvatarFile(null);
      setAvatarPreview(null);
      message.success("Cập nhật thành công");
    } catch(err: any) {
      message.error(err.response?.data?.message || "Cập nhật thất bại");
    } finally {
      setSaving(false);
    }
  };

  const handlePayDeposit = async (booking: any) => {
    Modal.confirm({
      title: 'Xác nhận thanh toán cọc',
      content: `Bạn sẽ thanh toán cọc ${(booking.pitchPriceAtBooking / 2).toLocaleString()}đ cho sân ${booking.pitch?.namePitch}. Tiếp tục?`,
      okText: 'Thanh toán (Banking)',
      cancelText: 'Huỷ',
      onOk: async () => {
        try {
          await bookingApi.partialPayment({
            bookingId: booking.bookId,
            amount: booking.pitchPriceAtBooking / 2,
            paymentMethod: 'banking'
          });
          message.success("Thanh toán cọc thành công");
          fetchHistory();
        } catch (error: any) {
          message.error(error.response?.data?.message || "Thanh toán thất bại");
        }
      }
    });
  };

  const handleCancelBooking = async (bookId: string) => {
    Modal.confirm({
      title: 'Xác nhận huỷ đơn',
      content: 'Bạn có chắc chắn muốn huỷ đơn đặt sân này không?',
      okText: 'Huỷ sân',
      okType: 'danger',
      cancelText: 'Quay lại',
      onOk: async () => {
        try {
          await bookingApi.cancelBookingUser({ bookId, content: "Tôi muốn huỷ sân do bận việc." });
          message.success("Đã gửi yêu cầu huỷ đơn");
          fetchHistory();
        } catch (error: any) {
          message.error(error.response?.data?.message || "Huỷ đơn thất bại");
        }
      }
    });
  };

  const totalSpent = history.reduce((acc, b) => acc + ((b.paymentStatus === 'paid' || b.paymentStatus === 'partial') ? b.total || 0 : 0), 0);
  const totalBookings = history.length;

  if (loading) return <div className="p-10 flex justify-center"><Spin size="large" /></div>;

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-xl rounded-2xl overflow-hidden shadow-lg border border-black/5"
      >
        {/* Cover Image */}
        <div className="h-32 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 relative">
        </div>

        {/* Profile Info */}
        <div className="p-6 relative">
          <div className="flex flex-col md:flex-row items-start md:items-end gap-6">
            {/* Avatar */}
            <div className="relative -mt-20">
              <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-4xl font-bold shadow-2xl border-4 border-white overflow-hidden">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="avatar preview" className="w-full h-full object-cover" />
                ) : user?.avt ? (
                  <img src={user.avt} alt="avatar" className="w-full h-full object-cover" />
                ) : (
                  user?.fullName?.substring(0, 2).toUpperCase() || 'JD'
                )}
              </div>
              <input
                type="file"
                id="avatar-input"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => document.getElementById('avatar-input')?.click()}
                className="absolute bottom-2 right-2 p-2 bg-blue-500 rounded-lg text-white shadow-lg hover:bg-blue-600 transition-colors"
              >
                <Camera className="w-4 h-4" />
              </motion.button>
            </div>

            {/* User Details */}
            <div className="flex-1">
              {isEditing ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    className="w-full px-4 py-2 bg-gray-50 border border-black/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  />
                  <input
                    type="tel"
                    placeholder="Số điện thoại"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-4 py-2 bg-gray-50 border border-black/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  />
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-bold mb-1">{user?.fullName || 'John Doe'}</h2>
                  <p className="text-black/50 mb-3">{user?.email || 'john.doe@example.com'}</p>
                </>
              )}

              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-black/50" />
                  <span>{user?.phone || '+84 123 456 789'}</span>
                </div>
              </div>
            </div>

            {/* Edit Button */}
            {isEditing ? (
               <motion.button
               whileHover={{ scale: 1.05 }}
               whileTap={{ scale: 0.95 }}
               onClick={handleSave}
               disabled={saving}
               className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-medium shadow-md hover:shadow-lg transition-shadow flex items-center gap-2"
             >
               <Save className="w-5 h-5" />
               {saving ? 'Đang lưu...' : 'Lưu'}
             </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-medium shadow-md hover:shadow-lg transition-shadow flex items-center gap-2"
              >
                <Edit className="w-5 h-5" />
                Chỉnh sửa
              </motion.button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { icon: Calendar, label: 'Tổng lượt đặt', value: totalBookings.toString(), color: 'from-blue-400 to-blue-600' },
          { icon: DollarSign, label: 'Tổng chi tiêu', value: totalSpent.toLocaleString() + 'đ', color: 'from-green-400 to-green-600' },
          { icon: Trophy, label: 'Đánh giá TB', value: '4.8', color: 'from-purple-400 to-purple-600' },
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-black/5"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm text-black/50 mb-2">{stat.label}</p>
                  <h3 className="text-3xl font-bold">{stat.value}</h3>
                </div>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-md`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Recent Bookings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-black/5"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Lịch sử đặt sân</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-black/10">
                <th className="text-left py-3 px-4 text-sm font-medium text-black/50">Sân</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-black/50">Ngày</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-black/50">Giờ</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-black/50">Thanh toán</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-black/50">Trạng thái</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-black/50">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {history.map((booking, index) => {
                const startTime = new Date(booking.startTime);
                const isPast = startTime < new Date();
                return (
                <motion.tr
                  key={booking.bookId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9 + index * 0.1 }}
                  className="border-b border-black/5 hover:bg-black/5 transition-colors"
                >
                  <td className="py-3 px-4">{booking.pitch?.namePitch}</td>
                  <td className="py-3 px-4">{startTime.toLocaleDateString('vi-VN')}</td>
                  <td className="py-3 px-4">{startTime.getHours()}:{String(startTime.getMinutes()).padStart(2,'0')} - {new Date(booking.endTime).getHours()}:{String(new Date(booking.endTime).getMinutes()).padStart(2,'0')}</td>
                  <td className="py-3 px-4 font-semibold">
                    <div className="flex flex-col">
                      <span>{booking.total?.toLocaleString()} VNĐ</span>
                      <span className="text-xs text-black/50 font-normal">
                        {booking.paymentStatus === 'paid' ? 'Đã thanh toán đủ' : booking.paymentStatus === 'partial' ? 'Đã cọc' : 'Chưa thanh toán'}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`text-xs px-3 py-1 rounded-lg ${
                      booking.status === 'approved'
                        ? 'bg-green-100 text-green-700'
                        : booking.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {booking.status === 'approved' ? 'Hoàn thành' : booking.status === 'rejected' ? 'Đã hủy' : 'Chờ duyệt'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {booking.paymentStatus === 'pending' && booking.status === 'pending' && (
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handlePayDeposit(booking)}
                          className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                          title="Thanh toán cọc"
                        >
                          <CreditCard className="w-4 h-4" />
                        </motion.button>
                      )}

                      {(booking.status === 'pending' || booking.status === 'approved') && (
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleCancelBooking(booking.bookId)}
                          className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                          title="Huỷ đặt sân"
                        >
                          <XCircle className="w-4 h-4" />
                        </motion.button>
                      )}
                      
                      {booking.status !== 'pending' && booking.status !== 'approved' && booking.paymentStatus !== 'pending' && (
                        <span className="text-xs text-black/30">-</span>
                      )}
                    </div>
                  </td>
                </motion.tr>
              )})}
              {history.length === 0 && <tr><td colSpan={6} className="py-4 text-center text-gray-500">Chưa có lịch sử</td></tr>}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
