import React, { useEffect } from 'react';
import { Outlet, Navigate } from '@umijs/max';
import { Spin } from 'antd';
import { UserSidebar } from '../widgets/user-sidebar';
import { UserNavbar } from '../widgets/user-navbar';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { fetchCurrentUser } from '@/entities/user/model/userSlice';

const UserLayout: React.FC = () => {
  const dispatch = useAppDispatch();
  const { currentUser, isInitialized, loading } = useAppSelector((state) => state.user);

  useEffect(() => {
    if (!isInitialized) {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch, isInitialized]);

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
    <div className="min-h-screen bg-background font-body-md text-on-background flex">
      {/* Sidebar Widget */}
      <UserSidebar />

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Navbar Widget */}
        <UserNavbar />

        {/* Dynamic Page Content */}
        <main className="ml-[260px] p-container-margin flex-1 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default UserLayout;