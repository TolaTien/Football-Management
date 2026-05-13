import React from 'react';
import { Outlet, Navigate, useModel } from '@umijs/max';
import { UserSidebar } from '../widgets/user-sidebar';
import { UserNavbar } from '../widgets/user-navbar';

const UserLayout: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const user = initialState?.currentUser;

  // Protect route: Redirect to login if not authenticated
  if (!user) {
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
