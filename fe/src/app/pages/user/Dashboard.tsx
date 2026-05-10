import { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import { Calendar, TrendingUp, Users, DollarSign, Clock, MapPin } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { userApi } from '../../../api/user.api';
import { message, Spin } from 'antd';

export default function Dashboard() {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await userApi.getHistoryBooking();
        setHistory(res.data || []);
      } catch (err: any) {
        message.error("Lỗi khi tải dữ liệu");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const { totalBookings, totalSpent, activityData, upcomingMatches } = useMemo(() => {
    let spent = 0;
    const now = new Date();
    const upcoming: any[] = [];
    const monthlyActivity: Record<string, number> = {};

    history.forEach(booking => {
      // Tính tổng chi tiêu
      if (booking.paymentStatus === 'paid' || booking.paymentStatus === 'partial') {
        spent += booking.total || 0;
      }

      // Thống kê theo tháng
      const bookingDate = new Date(booking.createdAt);
      const monthKey = `T${bookingDate.getMonth() + 1}`;
      monthlyActivity[monthKey] = (monthlyActivity[monthKey] || 0) + 1;

      // Trận đấu sắp tới
      const startTime = new Date(booking.startTime);
      if (startTime > now && booking.status !== 'rejected') {
        upcoming.push({
          id: booking.bookId,
          pitch: booking.pitch?.namePitch || 'Sân bóng',
          time: `${startTime.getHours()}:${String(startTime.getMinutes()).padStart(2, '0')} - ${new Date(booking.endTime).getHours()}:${String(new Date(booking.endTime).getMinutes()).padStart(2, '0')}`,
          date: startTime.toLocaleDateString('vi-VN'),
          location: booking.pitch?.address || '',
          status: booking.status === 'approved' ? 'confirmed' : 'pending'
        });
      }
    });

    const formattedActivity = Object.keys(monthlyActivity).map(key => ({ month: key, bookings: monthlyActivity[key] })).sort((a,b) => a.month.localeCompare(b.month));

    return {
      totalBookings: history.length,
      totalSpent: spent,
      activityData: formattedActivity.length ? formattedActivity : [
        { month: 'T1', bookings: 0 }, { month: 'T2', bookings: 0 } // Mock initial
      ],
      upcomingMatches: upcoming.slice(0, 5) // top 5
    };
  }, [history]);

  const stats = [
    { icon: Calendar, label: 'Tổng đặt sân', value: totalBookings.toString(), change: '', color: 'from-blue-400 to-blue-600' },
    { icon: DollarSign, label: 'Chi tiêu', value: `${(totalSpent / 1000000).toFixed(1)}M`, change: '', color: 'from-green-400 to-green-600' },
    { icon: Clock, label: 'Giờ chơi', value: `${totalBookings}h`, change: '', color: 'from-purple-400 to-purple-600' },
    { icon: Users, label: 'Đội bóng', value: '1', change: '', color: 'from-pink-400 to-pink-600' },
  ];

  if (loading) return <div className="p-10 flex justify-center"><Spin size="large" /></div>;

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-black/5"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm text-black/50 mb-2">{stat.label}</p>
                  <h3 className="text-3xl font-bold mb-1">{stat.value}</h3>
                  <span className="text-sm text-green-500 font-medium">{stat.change}</span>
                </div>
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-md`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-black/5"
        >
          <h3 className="text-lg font-semibold mb-4">Hoạt động đặt sân</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={activityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid rgba(0,0,0,0.1)',
                  borderRadius: '12px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}
              />
              <Bar dataKey="bookings" fill="url(#colorGradient)" radius={[8, 8, 0, 0]} />
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Info or Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-black/5"
        >
          <h3 className="text-lg font-semibold mb-4">Lưu ý & Cập nhật</h3>
          <div className="text-sm text-gray-600">
             Hệ thống quản lý sân bóng luôn sẵn sàng hỗ trợ. Đừng quên đánh giá sau mỗi trận đấu và mời thêm bạn bè để nhận voucher nhé.
          </div>
        </motion.div>
      </div>

      {/* Upcoming Matches */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-black/5"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Lịch đặt sắp tới</h3>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl text-sm font-medium shadow-md"
          >
            Xem tất cả
          </motion.button>
        </div>

        <div className="space-y-4">
          {upcomingMatches.length === 0 ? <p className="text-gray-500">Chưa có lịch đặt sân sắp tới</p> : 
          upcomingMatches.map((match: any, index: number) => (
            <motion.div
              key={match.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 + index * 0.1 }}
              whileHover={{ scale: 1.02, x: 5 }}
              className="flex items-center gap-4 p-4 bg-gradient-to-r from-white/50 to-blue-50/50 rounded-xl border border-black/5 cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center shadow-md">
                <Calendar className="w-6 h-6 text-white" />
              </div>

              <div className="flex-1">
                <h4 className="font-semibold text-sm mb-1">{match.pitch}</h4>
                <div className="flex items-center gap-4 text-xs text-black/50">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {match.time}
                  </span>
                  <span>{match.date}</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {match.location}
                  </span>
                </div>
              </div>

              <div className={`px-3 py-1 rounded-lg text-xs font-medium ${
                match.status === 'confirmed'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-yellow-100 text-yellow-700'
              }`}>
                {match.status === 'confirmed' ? 'Đã xác nhận' : 'Chờ duyệt'}
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                className="text-blue-500"
              >
                <TrendingUp className="w-5 h-5" />
              </motion.div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
