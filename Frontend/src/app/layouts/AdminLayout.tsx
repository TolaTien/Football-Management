import React, { useEffect, useState } from 'react';
import { Outlet, useLocation, history } from '@umijs/max';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import { AdminAiChatWidget } from '@/widgets/admin-ai-chat';
import { AdminSidebar } from '@/widgets/admin-sidebar';
import { AdminNavbar } from '@/widgets/admin-navbar';

dayjs.locale('vi');

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

  return (
    <div className="min-h-screen bg-background font-body-md text-on-background flex">
      {/* Admin Sidebar Widget */}
      <AdminSidebar admin={admin} onLogout={handleLogout} />

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Admin Navbar Widget */}
        <AdminNavbar />

        {/* Dynamic Page Content */}
        <main className="ml-[260px] p-8 flex-1 overflow-x-hidden">
          <Outlet />
        </main>
      </div>

      {/* Admin AI Chat Widget */}
      <AdminAiChatWidget />
    </div>
  );
};

export default AdminLayout;