import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate, useLocation } from 'react-router';
import { Menu, Calendar, Users, BarChart3, MapPin, Bell, LogOut, Settings, Shield, Package } from 'lucide-react';
import { useAuthStore } from '../../store/auth.store';
import { authApi } from '../../api/auth.api';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { user, clearAuth } = useAuthStore();

  const navItems = [
    { id: 'dashboard', path: '/admin/dashboard', icon: BarChart3, label: 'Dashboard' },
    { id: 'bookings', path: '/admin/bookings', icon: Calendar, label: 'Quản lý đặt sân' },
    { id: 'users', path: '/admin/users', icon: Users, label: 'Quản lý người dùng' },
    { id: 'pitches', path: '/admin/pitches', icon: MapPin, label: 'Quản lý sân' },
    { id: 'services', path: '/admin/services', icon: Package, label: 'Quản lý dịch vụ' },
  ];

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error(error);
    } finally {
      clearAuth();
      navigate('/login');
    }
  };

  return (
    <div className="size-full overflow-hidden">
      {/* Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: "spring", damping: 20, stiffness: 150 }}
            className="fixed left-0 top-0 h-full w-[280px] bg-white/80 backdrop-blur-xl border-r border-black/5 shadow-lg z-50"
          >
            {/* Header */}
            <div className="p-6 border-b border-black/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="font-semibold">Football Pitch</h1>
                  <p className="text-xs text-black/50">Admin Portal</p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="p-4 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;

                return (
                  <motion.button
                    key={item.id}
                    whileHover={{ scale: 1.02, x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate(item.path)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md'
                        : 'text-black/70 hover:bg-black/5'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                    {isActive && (
                      <motion.div
                        layoutId="adminActiveIndicator"
                        className="ml-auto w-2 h-2 rounded-full bg-white"
                      />
                    )}
                  </motion.button>
                );
              })}
            </nav>

            {/* Admin Info */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-black/5 bg-white/50">
              <div className="flex items-center gap-3 px-3 py-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white font-semibold overflow-hidden">
                  {user?.avt ? <img src={user.avt} alt="avatar" className="w-full h-full object-cover" /> : user?.fullName?.substring(0, 2).toUpperCase() || 'AD'}
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="font-medium text-sm truncate">{user?.fullName || 'Admin'}</p>
                  <p className="text-xs text-black/50 truncate">{user?.email || 'admin@example.com'}</p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleLogout}
                  className="p-2 hover:bg-black/5 rounded-lg transition-colors"
                  title="Đăng xuất"
                >
                  <LogOut className="w-4 h-4 text-black/50" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className={`h-full transition-all duration-300 ${isSidebarOpen ? 'ml-[280px]' : 'ml-0'}`}>
        {/* Top Bar */}
        <div className="bg-white/80 backdrop-blur-xl border-b border-black/5 px-6 py-4 flex items-center justify-between">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-black/5 rounded-xl transition-colors"
          >
            <Menu className="w-6 h-6" />
          </motion.button>

          <div className="flex items-center gap-4">
            <div className="px-4 py-2 bg-gradient-to-r from-orange-100 to-red-100 rounded-xl border border-orange-200">
              <p className="text-sm font-medium text-orange-700">Admin Dashboard</p>
            </div>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="relative p-2 hover:bg-black/5 rounded-xl transition-colors"
            >
              <Bell className="w-6 h-6" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 hover:bg-black/5 rounded-xl transition-colors"
            >
              <Settings className="w-6 h-6" />
            </motion.button>
          </div>
        </div>

        {/* View Container */}
        <div className="h-[calc(100%-73px)] overflow-y-auto p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
