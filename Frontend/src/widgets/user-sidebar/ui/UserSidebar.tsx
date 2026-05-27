import React from 'react';
import { Link, useLocation } from '@umijs/max';

const NAV_ITEMS = [
  { path: '/user/dashboard', icon: 'dashboard', label: 'Dashboard' },
  { path: '/booking/availability', icon: 'calendar_month', label: 'Book Pitch' },
  { path: '/matchmaking/feed', icon: 'groups', label: 'Matchmaking' },
  { path: '/user/rules', icon: 'gavel', label: 'Pitch Rules' },
  { path: '/user/activity', icon: 'leaderboard', label: 'Activity' },
];

export const UserSidebar: React.FC = () => {
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-0 h-screen w-[260px] border-r border-gray-200 bg-gray-50 flex flex-col overflow-y-auto z-50">
      <div className="px-lg py-xl">
        <h1 className="text-xl font-bold text-emerald-900 font-h1 tracking-tight">PitchMaster</h1>
        <p className="text-xs font-medium text-gray-500 font-label-caps mt-xs">Player Portal</p>
      </div>

      <nav className="flex-1 px-sm space-y-xs">
        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 font-button text-button transition-all ${
                isActive
                  ? 'text-emerald-900 border-l-4 border-emerald-900 bg-white shadow-sm'
                  : 'text-gray-500 border-l-4 border-transparent hover:bg-emerald-50 hover:text-emerald-900'
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

      <div className="mt-auto px-sm pb-lg space-y-xs">
        <Link 
          to="/booking/availability"
          className="w-full bg-primary-container text-white py-3 rounded-lg font-button flex items-center justify-center gap-2 mb-md shadow-sm active:scale-95 transition-all hover:opacity-90"
        >
          <span className="material-symbols-outlined text-sm" data-icon="add">add</span>
          Quick Book
        </Link>
        <Link to="/user/settings" className="flex items-center gap-3 px-4 py-3 text-gray-500 border-l-4 border-transparent hover:bg-emerald-50 transition-colors">
          <span className="material-symbols-outlined" data-icon="settings">settings</span>
          <span className="font-button text-button">Settings</span>
        </Link>
        <Link to="/support" className="flex items-center gap-3 px-4 py-3 text-gray-500 border-l-4 border-transparent hover:bg-emerald-50 transition-colors">
          <span className="material-symbols-outlined" data-icon="contact_support">contact_support</span>
          <span className="font-button text-button">Support</span>
        </Link>
      </div>
    </aside>
  );
};
