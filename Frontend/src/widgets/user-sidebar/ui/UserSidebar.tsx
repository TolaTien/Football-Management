import React from 'react';
import { Link, useLocation } from '@umijs/max';

const NAV_ITEMS = [
  { path: '/user/dashboard', icon: 'dashboard', label: 'Tổng quan' },
  { path: '/booking/availability', icon: 'calendar_month', label: 'Đặt sân bóng' },
  { path: '/matchmaking/feed', icon: 'groups', label: 'Cáp kèo & Ghép đội' },
  { path: '/user/rules', icon: 'gavel', label: 'Quy định sân bóng' },
  { path: '/user/activity', icon: 'leaderboard', label: 'Hoạt động cá nhân' },
];

export const UserSidebar: React.FC = () => {
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-0 h-screen w-[260px] border-r border-gray-200 bg-gray-50 flex flex-col overflow-y-auto z-50">
      {/* Unified PitchHub Logo */}
      <div className="px-6 py-6 flex items-center gap-3 border-b border-gray-100">
        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-sm">
          <span className="material-symbols-outlined text-white text-xl">sports_soccer</span>
        </div>
        <div>
          <h1 className="text-lg font-bold text-primary font-h1 leading-tight tracking-tight">PitchHub</h1>
          <p className="text-[10px] font-semibold text-gray-500 font-label-caps uppercase tracking-wider">Cổng người chơi</p>
        </div>
      </div>

      <nav className="flex-1 px-sm space-y-xs mt-6">
        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 font-button text-button transition-all no-underline ${
                isActive
                  ? 'text-primary border-l-4 border-primary bg-white shadow-sm font-semibold'
                  : 'text-gray-500 border-l-4 border-transparent hover:bg-primary/10 hover:text-primary'
              }`}
            >
              <span className="material-symbols-outlined" data-icon={item.icon}>
                {item.icon}
              </span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto px-sm pb-lg space-y-xs border-t border-gray-100 pt-4 bg-white/50 backdrop-blur-sm">
        <Link 
          to="/booking/availability"
          className="w-full bg-primary text-white py-3 rounded-lg font-button flex items-center justify-center gap-2 mb-md shadow-sm active:scale-95 transition-all hover:bg-primary/95 no-underline"
        >
          <span className="material-symbols-outlined text-sm" data-icon="add">add</span>
          Đặt sân nhanh
        </Link>
        <Link to="/user/profile" className="flex items-center gap-3 px-4 py-3 text-gray-500 border-l-4 border-transparent hover:bg-primary/10 hover:text-primary transition-colors no-underline">
          <span className="material-symbols-outlined" data-icon="settings">settings</span>
          <span className="font-button text-button">Thiết lập</span>
        </Link>
        <Link to="/user/support" className="flex items-center gap-3 px-4 py-3 text-gray-500 border-l-4 border-transparent hover:bg-primary/10 hover:text-primary transition-colors no-underline">
          <span className="material-symbols-outlined" data-icon="contact_support">contact_support</span>
          <span className="font-button text-button">Hỗ trợ</span>
        </Link>
      </div>
    </aside>
  );
};
