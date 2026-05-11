import React from 'react';
import { Outlet, Link, useLocation, history } from '@umijs/max';

const NAV_ITEMS = [
  { icon: 'dashboard', label: 'Dashboard', path: '/user/dashboard' },
  { icon: 'calendar_month', label: 'Book a Pitch', path: '/booking/availability' },
  { icon: 'groups', label: 'Matchmaking', path: '/matchmaking/feed' },
  { icon: 'forum', label: 'Messages', path: '/matchmaking/messages' },
  { icon: 'sports_soccer', label: 'My Team', path: '/user/team' },
  { icon: 'leaderboard', label: 'Activity', path: '/user/activity' },
  { icon: 'account_balance_wallet', label: 'Wallet', path: '/user/wallet' },
];

const UserLayout: React.FC = () => {
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('pitchhub_user');
    history.push('/auth/login');
  };

  // Get user from localStorage for display
  let user = { email: 'user@pitchhub.com' };
  try {
    const userStr = localStorage.getItem('pitchhub_user');
    if (userStr) {
      user = JSON.parse(userStr);
    }
  } catch (e) {
    console.error('Failed to parse user from localStorage', e);
  }
  const initials = user.email.slice(0, 2).toUpperCase();

  return (
    <div className="min-h-screen bg-background flex">
      {/* ===== SIDEBAR (persistent - never unmounts) ===== */}
      <aside className="fixed left-0 top-0 h-screen w-[260px] border-r border-gray-200 bg-gray-50 flex flex-col overflow-y-auto z-50">
        <div className="px-6 py-8">
          <h1 className="text-xl font-bold text-emerald-900 tracking-tight">PitchMaster</h1>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mt-1">Player Portal</p>
        </div>

        <nav className="flex-1 px-3 space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg border-l-4 transition-all no-underline ${
                  isActive
                    ? 'text-emerald-900 font-bold border-emerald-900 bg-white shadow-sm'
                    : 'text-gray-500 border-transparent hover:bg-emerald-50 hover:text-emerald-900'
                }`}
              >
                <span className="material-symbols-outlined text-[22px]">{item.icon}</span>
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto px-3 pb-6 space-y-1 border-t border-gray-200 pt-4">
          <Link
            to="/booking/availability"
            className="w-full bg-emerald-900 text-white py-3 rounded-lg text-sm font-bold flex items-center justify-center gap-2 mb-3 shadow-sm hover:bg-emerald-800 transition-all no-underline"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            Quick Book
          </Link>
          <a
            className="flex items-center gap-3 px-4 py-3 text-gray-400 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
            onClick={(e) => e.preventDefault()}
            href="#"
          >
            <span className="material-symbols-outlined text-[22px]">settings</span>
            <span className="text-sm font-medium">Settings</span>
          </a>
          <a
            className="flex items-center gap-3 px-4 py-3 text-red-400 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
            onClick={(e) => { e.preventDefault(); handleLogout(); }}
            href="#"
          >
            <span className="material-symbols-outlined text-[22px]">logout</span>
            <span className="text-sm font-medium">Logout</span>
          </a>
        </div>
      </aside>

      {/* ===== HEADER (persistent) ===== */}
      <header className="fixed top-0 left-[260px] right-0 h-16 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm flex justify-between items-center px-8 z-40">
        <div className="flex items-center gap-3 bg-gray-100 rounded-full px-4 py-2 w-80">
          <span className="material-symbols-outlined text-gray-400 text-[20px]">search</span>
          <input
            className="bg-transparent border-none outline-none text-sm w-full text-on-surface"
            placeholder="Search pitches, teams, bookings..."
            type="text"
          />
        </div>
        <div className="flex items-center gap-3">
          <button className="hover:bg-gray-100 rounded-full p-2 transition-all">
            <span className="material-symbols-outlined text-gray-600">notifications</span>
          </button>
          <button className="hover:bg-gray-100 rounded-full p-2 transition-all">
            <span className="material-symbols-outlined text-gray-600">mail</span>
          </button>
          <div className="h-8 w-px bg-gray-200 mx-1"></div>
          <div className="flex items-center gap-3 cursor-pointer">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-emerald-900 leading-none">{user.email.split('@')[0]}</p>
              <p className="text-[10px] text-gray-500 uppercase tracking-wider">Pro Player</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-emerald-900 flex items-center justify-center text-white font-bold text-sm border-2 border-emerald-100">
              {initials}
            </div>
          </div>
        </div>
      </header>

      {/* ===== PAGE CONTENT (only this part changes on navigate) ===== */}
      <main className="ml-[260px] pt-16 flex-1 min-h-screen">
        <Outlet />
      </main>
    </div>
  );
};

export default UserLayout;
