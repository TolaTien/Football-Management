import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Users, Calendar, DollarSign, TrendingUp, Edit, Trash2, Check, X } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { statisticApi } from '../../../api/statistic.api';
import { bookingApi } from '../../../api/booking.api';
import { pitchApi } from '../../../api/pitch.api';
import { adminApi } from '../../../api/admin.api';
import { message, Spin } from 'antd';

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [bookingRequests, setBookingRequests] = useState<any[]>([]);
  const [pitches, setPitches] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const date = new Date();
        const [statRes, bookRes, pitchRes, userRes] = await Promise.all([
          statisticApi.getMonthlyRevenue({ month: date.getMonth() + 1, year: date.getFullYear() }),
          bookingApi.getAllRequestAdmin({ page: 1 }),
          pitchApi.getAll({}),
          adminApi.getAllUsers()
        ]);

        const details = statRes.data?.details || [];
        const formattedRevenue = details.map((d: any) => {
          const dateStr = d.date.split('-')[2];
          return {
            day: dateStr,
            revenue: d.totalRevenue / 1000000 // Convert to millions
          };
        });
        setRevenueData(formattedRevenue);
        setTotalRevenue(statRes.data?.totalMonthlyRevenue || 0);
        
        setBookingRequests(bookRes.data?.booking || []);
        setPitches(pitchRes.data || []);
        setUsers(userRes.data?.users || []);
      } catch (err) {
        message.error("Lỗi khi tải dữ liệu dashboard");
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, []);

  const pitchUsageData = [
    { name: 'Sân 5', value: pitches.filter(p => p.pitchCategory === 5).length, color: '#3b82f6' },
    { name: 'Sân 7', value: pitches.filter(p => p.pitchCategory === 7).length, color: '#8b5cf6' },
    { name: 'Sân 11', value: pitches.filter(p => p.pitchCategory === 11).length, color: '#ec4899' },
  ].filter(d => d.value > 0);

  if (loading) return <div className="p-10 flex justify-center"><Spin size="large" /></div>;

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { icon: DollarSign, label: 'Doanh thu tháng', value: `${(totalRevenue / 1000000).toFixed(1)}M`, change: '', color: 'from-green-400 to-emerald-600' },
          { icon: Calendar, label: 'Yêu cầu chờ duyệt', value: bookingRequests.length.toString(), change: '', color: 'from-blue-400 to-blue-600' },
          { icon: Users, label: 'Người dùng', value: users.length.toString(), change: '', color: 'from-purple-400 to-purple-600' },
          { icon: TrendingUp, label: 'Số lượng sân', value: pitches.length.toString(), change: '', color: 'from-pink-400 to-pink-600' },
        ].map((stat, index) => {
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-black/5"
        >
          <h3 className="text-lg font-semibold mb-4">Doanh thu trong tháng (triệu VNĐ)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="day" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid rgba(0,0,0,0.1)',
                  borderRadius: '12px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}
              />
              <Bar dataKey="revenue" fill="url(#revenueGradient)" radius={[8, 8, 0, 0]} />
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#059669" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Pitch Usage Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-black/5"
        >
          <h3 className="text-lg font-semibold mb-4">Tỷ trọng loại sân</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={pitchUsageData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {pitchUsageData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-4">
            {pitchUsageData.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span>{item.name}</span>
                </div>
                <span className="font-semibold">{item.value} sân</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Booking Requests */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-black/5"
      >
        <h3 className="text-lg font-semibold mb-4">Yêu cầu đặt sân</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-black/10">
                <th className="text-left py-3 px-4 text-sm font-medium text-black/50">Người dùng</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-black/50">Sân</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-black/50">Ngày</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-black/50">Giờ</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-black/50">Số tiền</th>
              </tr>
            </thead>
            <tbody>
              {bookingRequests.map((request, index) => {
                const startTime = new Date(request.startTime);
                const endTime = new Date(request.endTime);
                return (
                <motion.tr
                  key={request.bookId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className="border-b border-black/5 hover:bg-black/5 transition-colors"
                >
                  <td className="py-3 px-4">{request.users?.fullName}</td>
                  <td className="py-3 px-4">{request.pitch?.namePitch}</td>
                  <td className="py-3 px-4">{startTime.toLocaleDateString('vi-VN')}</td>
                  <td className="py-3 px-4">{startTime.getHours()}:{String(startTime.getMinutes()).padStart(2,'0')} - {endTime.getHours()}:{String(endTime.getMinutes()).padStart(2,'0')}</td>
                  <td className="py-3 px-4 font-semibold">{request.total?.toLocaleString()} VNĐ</td>
                </motion.tr>
              )})}
              {bookingRequests.length === 0 && <tr><td colSpan={5} className="py-4 text-center text-gray-500">Chưa có yêu cầu đặt sân</td></tr>}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Users & Pitches Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Users Management */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-black/5"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Người dùng</h3>
          </div>
          <div className="space-y-3">
            {users.slice(0, 5).map((user, index) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9 + index * 0.1 }}
                className="flex items-center justify-between p-3 bg-gradient-to-r from-white to-blue-50/50 rounded-xl border border-black/5"
              >
                <div className="flex-1">
                  <h4 className="font-semibold text-sm">{user.name}</h4>
                  <p className="text-xs text-black/50">{user.email}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-1 rounded-lg ${
                    user.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {user.status === 'active' ? 'Hoạt động' : 'Chặn'}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Pitches Management */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-black/5"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Danh sách sân</h3>
          </div>
          <div className="space-y-3">
            {pitches.slice(0, 5).map((pitch, index) => (
              <motion.div
                key={pitch.pitchId}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.0 + index * 0.1 }}
                className="p-3 bg-gradient-to-r from-white to-purple-50/50 rounded-xl border border-black/5"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-semibold text-sm">{pitch.namePitch}</h4>
                    <p className="text-xs text-black/50">Sân {pitch.pitchCategory} người</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-lg ${
                    pitch.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                  }`}>
                    {pitch.status === 'active' ? 'Hoạt động' : 'Bảo trì'}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
