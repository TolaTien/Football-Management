import React, { useEffect, useState } from 'react';
import { Outlet, Link, useLocation, history } from '@umijs/max';
import { ConfigProvider, notification, Popover, Badge, List } from 'antd';
import viVN from 'antd/locale/vi_VN';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import AdminAiChatWidget from '@/widgets/admin-ai-chat/AdminAiChatWidget';
import { useAppDispatch, useAppSelector } from '@/shared/model/hooks';
import { fetchAllBookings } from '@/entities/booking/model/bookingSlice';

dayjs.locale('vi');

const ADMIN_NAV_ITEMS = [
  { icon: 'dashboard', label: 'Tổng quan', path: '/admin/dashboard' },
  { icon: 'calendar_month', label: 'Lịch đặt sân', path: '/admin/schedule' },
  { icon: 'sports_soccer', label: 'Quản lý sân', path: '/admin/pitches' },
  { icon: 'assessment', label: 'Báo cáo doanh thu', path: '/admin/finance' },
  { icon: 'group', label: 'Người dùng', path: '/admin/customers' },
  { icon: 'inventory_2', label: 'Kho & Sản phẩm', path: '/admin/services' },
  { icon: 'forum', label: 'Diễn đàn', path: '/admin/forum' },
];

const AdminLayout: React.FC = () => {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const [admin, setAdmin] = useState<{ email: string; role: string } | null>(null);

  const { bookings } = useAppSelector((state) => state.booking);
  const [initialLoaded, setInitialLoaded] = useState(false);
  const [knownBookingIds, setKnownBookingIds] = useState<Set<string>>(new Set());

  // 1. Kiểm tra xác thực admin
  useEffect(() => {
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

  // 2. Fetch danh sách đặt sân ban đầu và định kỳ 10 giây một lần (Real-time polling)
  useEffect(() => {
    if (admin) {
      dispatch(fetchAllBookings());
      const interval = setInterval(() => {
        dispatch(fetchAllBookings());
      }, 10000);
      return () => clearInterval(interval);
    }
  }, [dispatch, admin]);

  // 3. Lắng nghe và hiển thị thông báo Notification khi có đơn đặt sân mới xuất hiện
  useEffect(() => {
    if (bookings.length > 0) {
      if (!initialLoaded) {
        // Lần đầu load: lưu danh sách các ID đặt sân hiện hành
        const ids = new Set(bookings.map(b => b.id));
        setKnownBookingIds(ids);
        setInitialLoaded(true);
      } else {
        // Các lần tiếp theo: quét tìm ID mới
        bookings.forEach(b => {
          if (!knownBookingIds.has(b.id)) {
            // Có đơn đặt sân mới! Phát thông báo antd
            notification.info({
              message: '🔔 Có đơn đặt sân mới!',
              description: (
                <div style={{ fontSize: 13 }}>
                  <p style={{ margin: '4px 0' }}><strong>Khách hàng:</strong> {b.userName}</p>
                  <p style={{ margin: '4px 0' }}><strong>Sân:</strong> {b.pitchName}</p>
                  <p style={{ margin: '4px 0' }}><strong>Thời gian:</strong> {b.startTime} - {b.endTime} ({b.date})</p>
                </div>
              ),
              placement: 'topRight',
              duration: 6,
            });

            // Cập nhật danh sách ID đã biết
            setKnownBookingIds(prev => {
              const next = new Set(prev);
              next.add(b.id);
              return next;
            });
          }
        });
      }
    }
  }, [bookings, initialLoaded, knownBookingIds]);

  const handleLogout = () => {
    localStorage.removeItem('pitchhub_user');
    history.push('/auth/login');
  };

  if (!admin) {
    return null;
  }

  const avatarChar = admin.email.charAt(0).toUpperCase();
  const pendingBookings = bookings.filter(b => b.status === 'pending');

  // Nội dung Popover thông báo khi click vào Quả chuông
  const notificationContent = (
    <div style={{ width: 300 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, borderBottom: '1px solid #f1f5f9', paddingBottom: 8 }}>
        <span style={{ fontWeight: 700, color: '#0f172a' }}>Yêu cầu mới ({pendingBookings.length})</span>
        <Link to="/admin/schedule" style={{ fontSize: 12, color: '#059669', fontWeight: 600 }}>Xem tất cả</Link>
      </div>
      {pendingBookings.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '24px 0', color: '#94a3b8', fontSize: 13 }}>
          Không có yêu cầu chờ duyệt nào
        </div>
      ) : (
        <List
          dataSource={pendingBookings.slice(0, 5)}
          renderItem={(b) => (
            <List.Item style={{ padding: '10px 0' }} className="hover:bg-slate-50 transition-colors rounded-lg px-2">
              <div style={{ width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                  <span style={{ fontWeight: 600, color: '#0f172a' }}>{b.userName}</span>
                  <span style={{ color: '#059669', fontSize: 11, fontWeight: 500 }}>{b.startTime} - {b.endTime}</span>
                </div>
                <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>
                  Sân: {b.pitchName} · Ngày: {b.date}
                </div>
              </div>
            </List.Item>
          )}
        />
      )}
    </div>
  );

  return (
    <ConfigProvider
      locale={viVN}
      theme={{
        token: {
          colorPrimary: '#059669',
          borderRadius: 12,
        }
      }}
    >
      <div className="min-h-screen bg-slate-50 flex">
        {/* Sidebar */}
        <aside className="fixed left-0 top-0 h-screen w-[260px] border-r border-gray-200 bg-white flex flex-col z-50">
          <div className="px-6 py-6 flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-600 rounded-md flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-lg">shield_person</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-emerald-900 leading-tight">TurfManager</h1>
              <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Admin Portal</p>
            </div>
          </div>

          <nav className="flex-1 px-4 space-y-1.5 mt-4 overflow-y-auto">
            {ADMIN_NAV_ITEMS.map((item) => {
              const isActive = location.pathname.startsWith(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all no-underline ${isActive
                    ? 'bg-emerald-500 text-white font-semibold shadow-sm'
                    : 'text-gray-600 hover:bg-emerald-50 hover:text-emerald-700 font-medium'
                    }`}
                >
                  <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                  <span className="text-sm">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Profile at bottom */}
          <div className="mt-auto p-4 border-t border-gray-100">
            <div className="bg-gray-50 rounded-xl p-3 flex items-center justify-between border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-700 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                  {avatarChar}
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">{admin.email.split('@')[0]}</p>
                  <p className="text-xs text-gray-500">Quản trị viên</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="text-gray-400 hover:text-red-500 transition-colors p-1.5 rounded-md hover:bg-red-50"
                title="Đăng xuất"
              >
                <span className="material-symbols-outlined text-[20px]">logout</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Header */}
        <header className="fixed top-0 left-[260px] right-0 h-16 bg-white border-b border-gray-200 shadow-sm flex justify-between items-center px-8 z-45">
          <div className="text-lg font-extrabold text-[#006644] tracking-wider uppercase">
            {location.pathname.startsWith('/admin/dashboard') && 'Tổng quan hệ thống'}
            {location.pathname.startsWith('/admin/schedule') && 'Lịch đặt sân'}
            {location.pathname.startsWith('/admin/pitches') && 'Quản lý hệ thống sân'}
            {location.pathname.startsWith('/admin/finance') && 'Báo cáo doanh thu'}
            {location.pathname.startsWith('/admin/customers') && 'Quản lý người dùng'}
            {location.pathname.startsWith('/admin/services') && 'Kho & Sản phẩm'}
            {location.pathname.startsWith('/admin/forum') && 'Diễn đàn'}
          </div>

          <div className="flex items-center gap-5">
            {/* Quả chuông thông báo */}
            <Popover
              content={notificationContent}
              trigger="click"
              placement="bottomRight"
              arrow
            >
              <button className="relative text-slate-500 hover:text-emerald-700 transition-colors p-1 bg-transparent border-none cursor-pointer flex items-center">
                <Badge count={pendingBookings.length} size="small" offset={[-2, 4]} color="#ef4444">
                  <span className="material-symbols-outlined text-[22px]">notifications</span>
                </Badge>
              </button>
            </Popover>

            {/* Avatar Admin */}
            <div className="w-8 h-8 rounded-full bg-[#dbeafe] text-[#1d4ed8] font-bold text-xs flex items-center justify-center shadow-sm select-none border border-[#bfdbfe]">
              {avatarChar}
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="ml-[260px] pt-16 flex-1 min-h-screen">
          <div className="p-8">
            <Outlet />
          </div>
        </main>
      </div>
      <AdminAiChatWidget />
    </ConfigProvider>
  );
};

export default AdminLayout;