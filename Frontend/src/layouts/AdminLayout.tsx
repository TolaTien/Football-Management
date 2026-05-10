import React, { useEffect, useState } from 'react';
import { Outlet, Link, useLocation, history } from '@umijs/max';

const ADMIN_NAV_ITEMS = [
  { icon: 'dashboard', label: 'Tổng quan', path: '/admin/dashboard' },
  { icon: 'calendar_month', label: 'Lịch đặt sân', path: '/admin/schedule' },
  { icon: 'sports_soccer', label: 'Quản lý sân', path: '/admin/pitches' },
  { icon: 'assessment', label: 'Báo cáo doanh thu', path: '/admin/finance' },
  { icon: 'group', label: 'Người dùng', path: '/admin/customers' },
  { icon: 'payments', label: 'Cấu hình giá', path: '/admin/pricing' },
  { icon: 'forum', label: 'Diễn đàn', path: '/admin/forum' },
];

const AdminLayout: React.FC = () => {
  const location = useLocation();
  const [admin, setAdmin] = useState<{ email: string; role: string } | null>(null);

  useEffect(() => {
    // Check if user is logged in as admin
    const adminStr = localStorage.getItem('pitchhub_user');
    if (!adminStr) {
      history.push('/auth/login');
      return;
    }
    
    try {
      const parsed = JSON.parse(adminStr);
      if (parsed.role !== 'admin') {
        history.push('/auth/login');
        return;
      }
      setAdmin(parsed);
    } catch (e) {
      history.push('/auth/login');
    }
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('pitchhub_user');
    history.push('/auth/login');
  };

  if (!admin) {
    return null; // or a loading spinner
  }

  const avatarChar = admin.email.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-[#f9fafb] flex">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-screen w-[260px] border-r border-gray-200 bg-white flex flex-col z-50">
        <div className="px-6 py-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-emerald-600 rounded-md flex items-center justify-center">
            <span className="material-symbols-outlined text-white text-lg">shield_person</span>
          </div>
          <div>
            <h1 className="text-lg font-bold text-emerald-900 leading-tight">TurfManager</h1>
            <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Admin Portal</p>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1.5 mt-4 overflow-y-auto">
          {ADMIN_NAV_ITEMS.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all no-underline ${
                  isActive
                    ? 'bg-emerald-500 text-white font-semibold shadow-sm'
                    : 'text-gray-600 hover:bg-emerald-50 hover:text-emerald-700 font-medium'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                <span className="text-sm">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Profile at bottom */}
        <div className="mt-auto p-4 border-t border-gray-100">
          <div className="bg-gray-50 rounded-xl p-3 flex items-center justify-between border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-700 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                {avatarChar}
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">{admin.email.split('@')[0]}</p>
                <p className="text-xs text-gray-500">Quản trị viên</p>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="text-gray-400 hover:text-red-500 transition-colors p-1.5 rounded-md hover:bg-red-50"
              title="Đăng xuất"
            >
              <span className="material-symbols-outlined text-[20px]">logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Header */}
      <header className="fixed top-0 left-[260px] right-0 h-16 bg-white border-b border-gray-200 shadow-sm flex justify-between items-center px-8 z-40">
        <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-full px-4 py-2 w-96 focus-within:bg-white focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-100 transition-all">
          <span className="material-symbols-outlined text-gray-400 text-[18px]">search</span>
          <input
            className="bg-transparent border-none outline-none text-sm w-full text-gray-700 placeholder-gray-400"
            placeholder="Tìm kiếm giao dịch, sân bóng, người dùng..."
            type="text"
          />
        </div>
        
        <div className="flex items-center gap-4">
          <button className="relative text-gray-500 hover:text-emerald-600 transition-colors p-1">
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
          </button>
          <button className="text-gray-500 hover:text-emerald-600 transition-colors p-1">
            <span className="material-symbols-outlined">settings</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="ml-[260px] pt-16 flex-1 min-h-screen">
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
