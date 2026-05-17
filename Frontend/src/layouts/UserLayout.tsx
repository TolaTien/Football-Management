import React from 'react';
import { Link, Outlet, history, useLocation, useModel } from '@umijs/max';
import { Spin } from 'antd';
import { authApi } from '@/shared/api/modules';

const navItems = [
  { label: 'Tổng quan', path: '/user/dashboard' },
  { label: 'Danh sách sân', path: '/pitches' },
  { label: 'Đặt sân', path: '/booking/availability' },
  { label: 'Lịch sử đặt sân', path: '/user/bookings' },
  { label: 'Thông báo', path: '/user/notifications' },
  { label: 'Hồ sơ', path: '/user/profile' },
];

const UserLayout: React.FC = () => {
  const location = useLocation();
  const { user, loading } = useModel('auth');

  const handleLogout = async () => {
    await authApi.logout();
    localStorage.removeItem('pitchhub_user');
    history.push('/auth/login');
  };

  if (loading) return <div className="min-h-screen grid place-items-center"><Spin /></div>;
  if (!user) {
    history.replace('/auth/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <aside className="fixed left-0 top-0 h-screen w-64 border-r bg-white p-5">
        <div className="mb-8">
          <h1 className="text-xl font-bold text-emerald-700">Football Hub</h1>
          <p className="text-sm text-slate-500">{user.fullName}</p>
        </div>
        <nav className="space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`block rounded-lg px-4 py-3 no-underline ${
                location.pathname === item.path
                  ? 'bg-emerald-600 text-white'
                  : 'text-slate-700 hover:bg-emerald-50'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <button className="absolute bottom-5 left-5 right-5 rounded-lg border px-4 py-3" onClick={handleLogout}>
          Đăng xuất
        </button>
      </aside>
      <main className="ml-64 min-h-screen p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default UserLayout;
