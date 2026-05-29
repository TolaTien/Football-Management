import React, { useEffect, useState } from 'react';
import { useNavigate } from '@umijs/max';
import { useAppSelector, useAppDispatch } from '@/app/store/hooks';
import { logout } from '@/entities/user/model/userSlice';
import { AuthService } from '@/features/auth/api/authService';
import { 
  NotificationItem,
  fetchNotifications, 
  markNotificationRead, 
  markAllNotificationsRead 
} from '@/entities/notification';
import { getSocket, connectSocket, disconnectSocket } from '@/shared/api/socket';
import { Badge, Popover, List, Spin, Empty, Avatar, notification } from 'antd';

export const UserNavbar: React.FC = () => {
  const user = useAppSelector((state) => state.user.currentUser);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const notifications = useAppSelector((state) => state.notification.list);
  const unreadCount = useAppSelector((state) => state.notification.unreadCount);
  const loadingNotifs = useAppSelector((state) => state.notification.loading);
  const [popoverOpen, setPopoverOpen] = useState(false);

  const sortedNotifications = React.useMemo(() => {
    return [...notifications].sort((a, b) => {
      if (a.isRead !== b.isRead) {
        return a.isRead ? 1 : -1; // unread first
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(); // newest first
    });
  }, [notifications]);

  const getNotificationTitle = (notif: any) => {
    if (notif.title) return notif.title;
    switch (notif.type) {
      case 'booking':
        return 'Đặt sân bóng';
      case 'payment':
        return 'Thanh toán';
      case 'post':
        return 'Cáp kèo & Ghép đội';
      case 'system':
      default:
        return 'Thông báo hệ thống';
    }
  };

  useEffect(() => {
    if (user) {
      dispatch(fetchNotifications(1));
      // Poll every 1 minute for new notifications as fallback
      const interval = setInterval(() => {
        dispatch(fetchNotifications(1));
      }, 60000);
      
      // Setup Socket.io
      connectSocket();
      const socket = getSocket();
      
      const handleNewNotification = (data: any) => {
        notification.info({
          message: 'New Notification',
          description: data.content || 'You have a new update.',
          placement: 'bottomRight',
        });
        dispatch(fetchNotifications(1));
      };
      
      socket.on('newNotification', handleNewNotification);
      
      return () => {
        clearInterval(interval);
        socket.off('newNotification', handleNewNotification);
      };
    }
  }, [user, dispatch]);

  const handleLogout = async () => {
    try {
      await AuthService.logout();
      dispatch(logout());
      navigate('/auth/login');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  const notificationContent = (
    <div className="w-80">
      <div className="flex justify-between items-center mb-2 px-2 pt-2">
        <h4 className="font-bold text-gray-800">Thông báo</h4>
        {unreadCount > 0 && (
          <button 
            className="text-xs text-primary hover:underline"
            onClick={() => {
              dispatch(markAllNotificationsRead());
            }}
          >
            Đánh dấu tất cả đã đọc
          </button>
        )}
      </div>
      
      {loadingNotifs ? (
        <div className="flex justify-center p-4"><Spin size="small" /></div>
      ) : notifications.length === 0 ? (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Không có thông báo mới" />
      ) : (
        <div className="max-h-80 overflow-y-auto">
          <List
            itemLayout="horizontal"
            dataSource={sortedNotifications.slice(0, 10)}
            renderItem={(item) => (
              <List.Item 
                className={`pl-5 pr-3 py-2.5 cursor-pointer hover:bg-gray-50 transition-colors ${!item.isRead ? 'bg-emerald-50/50' : ''}`}
                onClick={async () => {
                  if (!item.isRead) {
                    dispatch(markNotificationRead(item.id));
                  }
                  setPopoverOpen(false);
                  navigate('/user/profile?tab=notifications');
                }}
              >
                <List.Item.Meta
                  avatar={
                    <Avatar 
                      size="small" 
                      className={item.isRead ? 'bg-gray-200 text-gray-500' : 'bg-primary text-white'}
                      style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      <span 
                        className="material-symbols-outlined flex items-center justify-center" 
                        style={{ fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', lineHeight: 1 }}
                      >
                        notifications
                      </span>
                    </Avatar>
                  }
                  title={<span className={`text-xs ${item.isRead ? 'font-medium text-gray-600' : 'font-bold text-primary'}`}>{getNotificationTitle(item)}</span>}
                  description={<span className="text-xs text-gray-500 line-clamp-2">{item.content}</span>}
                />
              </List.Item>
            )}
          />
        </div>
      )}
      
      <div className="mt-2 pt-2 border-t border-gray-100 text-center pb-1">
        <button 
          className="text-sm text-primary font-medium hover:underline w-full py-1"
          onClick={() => {
            setPopoverOpen(false);
            navigate('/user/profile?tab=notifications');
          }}
        >
          Xem tất cả thông báo
        </button>
      </div>
    </div>
  );

  return (
    <header className="h-16 px-8 flex justify-between items-center bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-gray-100 shadow-sm ml-[260px]">
      <div />

      <div className="flex items-center gap-lg">
        <div className="flex items-center gap-sm">
          <Popover 
            content={notificationContent} 
            trigger="click" 
            open={popoverOpen} 
            onOpenChange={setPopoverOpen} 
            placement="bottomRight"
            styles={{ body: { padding: 0 } }}
          >
            <button className="hover:bg-gray-100 rounded-full p-2 transition-all relative">
              <Badge count={unreadCount} size="small" offset={[2, 2]}>
                <span className="material-symbols-outlined text-gray-600" data-icon="notifications">notifications</span>
              </Badge>
            </button>
          </Popover>
          
          <div className="h-8 w-px bg-gray-200 mx-2"></div>
          
          {/* User Profile — Click to navigate to Profile page */}
          <div className="flex items-center gap-3 group relative cursor-pointer">
            <div
              className="flex items-center gap-3"
              onClick={() => navigate('/user/profile')}
            >
              <div className="text-right">
                <p className="font-button text-on-surface text-sm leading-none">{user?.fullName || 'Người chơi'}</p>
                <p className="text-[10px] font-label-caps text-gray-500 uppercase">{user?.role === 'admin' ? 'Quản trị viên' : 'Thành viên'}</p>
              </div>
              <img
                alt="User Avatar"
                className="w-10 h-10 rounded-full border-2 border-white shadow-sm object-cover bg-gray-200"
                src={user?.avt || "https://api.dicebear.com/7.x/avataaars/svg?seed=" + (user?.email || 'default')}
              />
            </div>

            {/* Hover Dropdown */}
            <div className="absolute top-full right-0 mt-2 w-52 bg-white border border-gray-100 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
              <div className="p-2">
                <button
                  onClick={() => navigate('/user/profile')}
                  className="w-full text-left px-4 py-2 text-sm text-on-surface hover:bg-surface-container rounded-md flex items-center gap-2 transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">manage_accounts</span>
                  Thông tin cá nhân
                </button>
                <div className="my-1 border-t border-gray-100" />
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-error hover:bg-error-container rounded-md flex items-center gap-2 transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">logout</span>
                  Đăng xuất
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
