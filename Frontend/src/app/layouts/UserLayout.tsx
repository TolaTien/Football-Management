import React, { useEffect, useState } from 'react';
import { Outlet, Navigate, useLocation } from '@umijs/max';
import { Spin } from 'antd';
import { UserSidebar } from '@/widgets/user-sidebar';
import { UserNavbar } from '@/widgets/user-navbar';
import { FloatingChatbot } from '@/widgets/shared-floating-chatbot';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { fetchCurrentUser } from '@/entities/user';

const UserLayout: React.FC = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const { currentUser, isInitialized, loading } = useAppSelector((state) => state.user);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isInitialized) {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch, isInitialized]);

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  // Wait for initial auth check to complete
  if (!isInitialized || loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Spin size="large" tip="Đang tải thông tin..." />
      </div>
    );
  }

  // Protect route: Redirect to login if not authenticated
  if (!currentUser) {
    return <Navigate to="/auth/login" replace />;
  }

  return (
    <div className="min-h-screen bg-background font-body-md text-on-background flex overflow-x-hidden">
      {sidebarOpen && (
        <button
          type="button"
          className="fixed inset-0 z-[45] bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-label="Đóng menu"
        />
      )}

      {/* Sidebar Widget */}
      <UserSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Navbar Widget */}
        <UserNavbar onMenuClick={() => setSidebarOpen(true)} />

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-x-hidden px-4 py-5 sm:px-6 lg:ml-[260px] lg:p-container-margin">
          <Outlet />
        </main>
      </div>

      {/* Global AI Chatbot Widget */}
      <FloatingChatbot />
    </div>
  );
};

export default UserLayout;
