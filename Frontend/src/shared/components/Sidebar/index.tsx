import React, { useEffect } from 'react';
import { history, useLocation, Link } from '@umijs/max';

const NAV_ITEMS = [
  { icon: 'dashboard', label: 'Dashboard', path: '/user/dashboard' },
  { icon: 'calendar_month', label: 'Book a Pitch', path: '/booking/availability' },
  { icon: 'groups', label: 'Matchmaking', path: '/matchmaking/feed' },
  { icon: 'forum', label: 'Messages', path: '/matchmaking/messages' },
  { icon: 'sports_soccer', label: 'My Team', path: '/user/team' },
  { icon: 'leaderboard', label: 'Activity', path: '/user/activity' },
  { icon: 'account_balance_wallet', label: 'Wallet', path: '/user/wallet' },
];

// Prefetch all route chunks so first navigation is instant
const prefetchRoutes = () => {
  const imports = [
    () => import('@/pages/user/dashboard'),
    () => import('@/pages/user/activity'),
    () => import('@/pages/user/team'),
    () => import('@/pages/user/wallet'),
    () => import('@/pages/booking/availability'),
    () => import('@/pages/matchmaking/feed'),
    () => import('@/pages/matchmaking/messages'),
  ];
  // Stagger prefetch after 1s so login page loads first
  setTimeout(() => {
    imports.forEach((fn, i) => setTimeout(fn, i * 200));
  }, 1000);
};

const Sidebar: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    prefetchRoutes();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('pitchhub_user');
    history.push('/auth/login');
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-[260px] border-r border-gray-200 bg-gray-50 flex flex-col overflow-y-auto z-50">
      <div className="px-lg py-xl">
        <h1 className="text-xl font-bold text-emerald-900 font-h1 tracking-tight">PitchMaster</h1>
        <p className="text-xs font-medium text-gray-500 font-label-caps mt-xs">Player Portal</p>
      </div>

      <nav className="flex-1 px-sm space-y-xs">
        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 border-l-4 transition-all no-underline ${
                isActive
                  ? 'text-emerald-900 font-bold border-emerald-900 bg-white'
                  : 'text-gray-500 border-transparent hover:bg-emerald-50 hover:text-emerald-900'
              }`}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span className="font-button text-button">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto px-sm pb-lg space-y-xs">
        <Link
          to="/booking/availability"
          className="w-full bg-emerald-900 text-white py-3 rounded-lg font-button flex items-center justify-center gap-2 mb-md shadow-sm active:scale-95 transition-all hover:bg-emerald-800 no-underline"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          Quick Book
        </Link>
        <a
          className="flex items-center gap-3 px-4 py-3 text-gray-500 border-l-4 border-transparent hover:bg-emerald-50 transition-colors cursor-pointer"
          href="#"
          onClick={(e) => e.preventDefault()}
        >
          <span className="material-symbols-outlined">settings</span>
          <span className="font-button text-button">Settings</span>
        </a>
        <a
          className="flex items-center gap-3 px-4 py-3 text-red-400 border-l-4 border-transparent hover:bg-red-50 transition-colors cursor-pointer"
          onClick={(e) => { e.preventDefault(); handleLogout(); }}
          href="#"
        >
          <span className="material-symbols-outlined">logout</span>
          <span className="font-button text-button">Logout</span>
        </a>
      </div>
    </aside>
  );
};

export default Sidebar;
