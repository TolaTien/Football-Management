import React from 'react';
import { Link, useLocation } from '@umijs/max';

const ADMIN_NAV_ITEMS = [
  { icon: 'dashboard', label: 'Tổng quan', path: '/admin/dashboard' },
  { icon: 'calendar_month', label: 'Lịch đặt sân', path: '/admin/schedule' },
  { icon: 'sports_soccer', label: 'Quản lý sân', path: '/admin/pitches' },
  { icon: 'assessment', label: 'Báo cáo doanh thu', path: '/admin/finance' },
  { icon: 'group', label: 'Người dùng', path: '/admin/customers' },
  { icon: 'payments', label: 'Cấu hình giá', path: '/admin/pricing' },
  { icon: 'inventory_2', label: 'Kho & Sản phẩm', path: '/admin/services' },
  { icon: 'forum', label: 'Diễn đàn', path: '/admin/forum' },
];

interface AdminSidebarProps {
  admin: { email: string; role: string } | null;
  onLogout: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ admin, onLogout }) => {
  const location = useLocation();

  if (!admin) return null;

  const avatarChar = admin.email.charAt(0).toUpperCase();

  return (
    <aside className="fixed left-0 top-0 h-screen w-[260px] border-r border-gray-200 bg-gray-50 flex flex-col z-50 overflow-y-auto">
      {/* Unified PitchHub Logo */}
      <div className="px-6 py-6 flex items-center gap-3 border-b border-gray-100">
        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-sm">
          <span className="material-symbols-outlined text-white text-xl">shield_person</span>
        </div>
        <div>
          <h1 className="text-lg font-bold text-primary font-h1 leading-tight tracking-tight">PitchHub</h1>
          <p className="text-[10px] font-semibold text-gray-500 font-label-caps uppercase tracking-wider">Admin Portal</p>
        </div>
      </div>

      {/* Nav Menu */}
      <nav className="flex-1 px-4 space-y-1.5 mt-6">
        {ADMIN_NAV_ITEMS.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all no-underline ${
                isActive
                  ? 'bg-primary text-white font-semibold shadow-sm'
                  : 'text-gray-600 hover:bg-primary/10 hover:text-primary font-medium'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
              <span className="text-sm">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Admin Profile Details at bottom */}
      <div className="mt-auto p-4 border-t border-gray-200 bg-white/50 backdrop-blur-sm">
        <div className="bg-white rounded-xl p-3 flex items-center justify-between border border-gray-200/80 shadow-sm">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-sm">
              {avatarChar}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-gray-900 truncate" title={admin.email}>{admin.email.split('@')[0]}</p>
              <p className="text-[10px] text-gray-500 font-medium">Quản trị viên</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="text-gray-400 hover:text-red-500 transition-colors p-1.5 rounded-md hover:bg-red-50 shrink-0"
            title="Đăng xuất"
          >
            <span className="material-symbols-outlined text-[20px]">logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
