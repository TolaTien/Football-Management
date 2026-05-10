import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Edit, Trash2, Plus, X, Mail, Phone, MapPin, Calendar, Ban, CheckCircle } from 'lucide-react';
import { adminApi } from '../../../api/admin.api';
import { message, Spin } from 'antd';

type UserStatus = 'active' | 'blocked';

interface UserData {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  joinDate: string;
  bookings: number;
  spent: string;
  status: UserStatus;
}

export default function Users() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<UserStatus | 'all'>('all');
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await adminApi.getAllUsers();
      setUsers(res.data?.users || []);
    } catch(err) {
      message.error("Lỗi khi tải danh sách người dùng");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = (id: string) => {
    // Tạm thời chỉ cập nhật ở FE vì database chưa có cột status
    setUsers(users.map(u => u.id === id ? { ...u, status: u.status === 'active' ? 'blocked' : 'active' } : u));
    message.info("Cập nhật trạng thái tạm thời trên giao diện");
  };

  const handleDeleteUser = (id: string) => {
    if (confirm('Bạn có chắc muốn xóa người dùng này?')) {
      // Gọi api xóa nếu có
      setUsers(users.filter(u => u.id !== id));
    }
  };

  const handleEditUser = (user: UserData) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || user.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-1">Quản lý người dùng</h2>
          <p className="text-sm text-black/50">Xem và quản lý tất cả người dùng hệ thống</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setSelectedUser(null);
            setShowUserModal(true);
          }}
          className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-shadow flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Thêm người dùng
        </motion.button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Tổng người dùng', value: users.length, color: 'from-blue-400 to-blue-600' },
          { label: 'Đang hoạt động', value: users.filter(u => u.status === 'active').length, color: 'from-green-400 to-emerald-500' },
          { label: 'Bị chặn', value: users.filter(u => u.status === 'blocked').length, color: 'from-red-400 to-red-600' },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05, y: -5 }}
            className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-black/5"
          >
            <p className="text-sm text-black/50 mb-2">{stat.label}</p>
            <h3 className={`text-4xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
              {stat.value}
            </h3>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-black/30" />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên hoặc email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white/80 backdrop-blur-xl border border-black/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/50"
          />
        </div>
        <div className="flex gap-3">
          {[
            { label: 'Tất cả', value: 'all' },
            { label: 'Hoạt động', value: 'active' },
            { label: 'Bị chặn', value: 'blocked' },
          ].map((filter) => (
            <motion.button
              key={filter.value}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilterStatus(filter.value as UserStatus | 'all')}
              className={`px-4 py-2 rounded-xl font-medium transition-all ${
                filterStatus === filter.value
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md'
                  : 'bg-white/80 backdrop-blur-xl border border-black/10 hover:bg-black/5'
              }`}
            >
              {filter.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map((user, index) => (
          <motion.div
            key={user.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + index * 0.05 }}
            whileHover={{ y: -5 }}
            className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-black/5"
          >
            {/* User Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white font-bold">
                  {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div>
                  <h4 className="font-semibold">{user.name}</h4>
                  <span className={`text-xs px-2 py-1 rounded-lg ${
                    user.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {user.status === 'active' ? 'Hoạt động' : 'Bị chặn'}
                  </span>
                </div>
              </div>
            </div>

            {/* User Info */}
            <div className="space-y-2 mb-4 text-sm">
              <div className="flex items-center gap-2 text-black/70">
                <Mail className="w-4 h-4 text-black/30" />
                <span>{user.email}</span>
              </div>
              <div className="flex items-center gap-2 text-black/70">
                <Phone className="w-4 h-4 text-black/30" />
                <span>{user.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-black/70">
                <MapPin className="w-4 h-4 text-black/30" />
                <span>{user.location}</span>
              </div>
              <div className="flex items-center gap-2 text-black/70">
                <Calendar className="w-4 h-4 text-black/30" />
                <span>Tham gia {user.joinDate}</span>
              </div>
            </div>

            {/* User Stats */}
            <div className="flex gap-4 mb-4 p-3 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl">
              <div>
                <p className="text-xs text-black/50">Lượt đặt</p>
                <p className="font-bold text-lg">{user.bookings}</p>
              </div>
              <div className="border-l border-black/10 pl-4">
                <p className="text-xs text-black/50">Chi tiêu</p>
                <p className="font-bold text-lg text-green-600">{user.spent}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleEditUser(user)}
                className="flex-1 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
              >
                <Edit className="w-4 h-4" />
                Sửa
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleToggleStatus(user.id)}
                className={`flex-1 px-3 py-2 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm font-medium ${
                  user.status === 'active'
                    ? 'bg-red-100 text-red-700 hover:bg-red-200'
                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                }`}
              >
                {user.status === 'active' ? (
                  <>
                    <Ban className="w-4 h-4" />
                    Chặn
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Mở
                  </>
                )}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleDeleteUser(user.id)}
                className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* User Modal */}
      <AnimatePresence>
        {showUserModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowUserModal(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white rounded-2xl shadow-2xl p-6 z-50"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">
                  {selectedUser ? 'Chỉnh sửa người dùng' : 'Thêm người dùng mới'}
                </h3>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowUserModal(false)}
                  className="p-2 hover:bg-black/5 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Họ và tên"
                  defaultValue={selectedUser?.name}
                  className="w-full px-4 py-3 bg-gray-50 border border-black/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                />
                <input
                  type="email"
                  placeholder="Email"
                  defaultValue={selectedUser?.email}
                  className="w-full px-4 py-3 bg-gray-50 border border-black/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                />
                <input
                  type="tel"
                  placeholder="Số điện thoại"
                  defaultValue={selectedUser?.phone}
                  className="w-full px-4 py-3 bg-gray-50 border border-black/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                />
                <input
                  type="text"
                  placeholder="Khu vực"
                  defaultValue={selectedUser?.location}
                  className="w-full px-4 py-3 bg-gray-50 border border-black/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                />

                <div className="flex gap-3 pt-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowUserModal(false)}
                    className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                  >
                    Hủy
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowUserModal(false)}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-shadow"
                  >
                    {selectedUser ? 'Cập nhật' : 'Thêm mới'}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
