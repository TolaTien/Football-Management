import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router';
import { useEffect } from 'react';
import Login from './pages/Login';
import Register from './pages/Register';
import UserLayout from './layouts/UserLayout';
import AdminLayout from './layouts/AdminLayout';

// User Pages
import UserDashboard from './pages/user/Dashboard';
import UserBooking from './pages/user/Booking';
import UserMatchmaking from './pages/user/Matchmaking';
import UserProfile from './pages/user/Profile';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminBookings from './pages/admin/Bookings';
import AdminUsers from './pages/admin/Users';
import AdminPitches from './pages/admin/Pitches';
import AdminServices from './pages/admin/Services';
import { useAuthStore } from '../store/auth.store';
import { authApi } from '../api/auth.api';
import { Spin } from 'antd';

export default function App() {
  const { isAuthenticated, userRole, setAuth, clearAuth, isInitialized, setInitialized } = useAuthStore();

  useEffect(() => {
    const initAuth = async () => {
      try {
        const response = await authApi.checkAuth();
        if (response.data?.user) {
          setAuth(response.data.user);
        } else {
          clearAuth();
        }
      } catch (error) {
        clearAuth();
      } finally {
        setInitialized();
      }
    };
    initAuth();
  }, [setAuth, clearAuth, setInitialized]);

  if (!isInitialized) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gradient-to-br from-pink-50 via-blue-50 to-purple-50">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <Router>
      <div className="size-full bg-gradient-to-br from-pink-50 via-blue-50 to-purple-50">
        <Routes>
          {/* Public Routes */}
          <Route
            path="/login"
            element={
              isAuthenticated ?
                <Navigate to={userRole === 'admin' ? '/admin/dashboard' : '/user/dashboard'} /> :
                <Login />
            }
          />
          <Route
            path="/register"
            element={
              isAuthenticated ?
                <Navigate to="/user/dashboard" /> :
                <Register />
            }
          />

          {/* User Routes */}
          <Route
            path="/user/*"
            element={
              isAuthenticated && userRole === 'user' ?
                <UserLayout>
                  <Routes>
                    <Route path="dashboard" element={<UserDashboard />} />
                    <Route path="booking" element={<UserBooking />} />
                    <Route path="matchmaking" element={<UserMatchmaking />} />
                    <Route path="profile" element={<UserProfile />} />
                    <Route path="*" element={<Navigate to="/user/dashboard" />} />
                  </Routes>
                </UserLayout> :
                <Navigate to="/login" />
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin/*"
            element={
              isAuthenticated && userRole === 'admin' ?
                <AdminLayout>
                  <Routes>
                    <Route path="dashboard" element={<AdminDashboard />} />
                    <Route path="bookings" element={<AdminBookings />} />
                    <Route path="users" element={<AdminUsers />} />
                    <Route path="pitches" element={<AdminPitches />} />
                    <Route path="services" element={<AdminServices />} />
                    <Route path="*" element={<Navigate to="/admin/dashboard" />} />
                  </Routes>
                </AdminLayout> :
                <Navigate to="/login" />
            }
          />

          {/* Default Route */}
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}
