import React, { useEffect, useState } from 'react';
import { useNavigate } from '@umijs/max';
import { useAppSelector, useAppDispatch } from '@/app/store/hooks';
import { logout } from '@/entities/user/model/userSlice';
import { AuthService } from '@/features/auth/api/authService';
import { NotificationItem } from '@/entities/notification/api/notificationService';
import { 
  fetchNotifications, 
  markNotificationRead, 
  markAllNotificationsRead 
} from '@/entities/notification/model/notificationSlice';
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
        <h4 className="font-bold text-gray-800">Notifications</h4>
        {unreadCount > 0 && (
          <button 
            className="text-xs text-primary hover:underline"
            onClick={() => {
              dispatch(markAllNotificationsRead());
            }}
          >
            Mark all as read
          </button>
        )}
      </div>
      
      {loadingNotifs ? (
        <div className="flex justify-center p-4"><Spin size="small" /></div>
      ) : notifications.length === 0 ? (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No notifications" />
      ) : (
        <div className="max-h-80 overflow-y-auto">
          <List
            itemLayout="horizontal"
            dataSource={notifications.slice(0, 5)}
            renderItem={(item) => (
              <List.Item 
                className={`px-3 py-2 cursor-pointer hover:bg-gray-50 transition-colors ${!item.isRead ? 'bg-emerald-50/50' : ''}`}
                onClick={async () => {
                  if (!item.isRead) {
                    dispatch(markNotificationRead(item.id));
                  }
                  setPopoverOpen(false);
                  navigate('/user/profile?tab=notifications');
                }}
              >
                <List.Item.Meta
                  avatar={<Avatar size="small" icon={<span className="material-symbols-outlined text-[16px]">notifications</span>} className={item.isRead ? 'bg-gray-200' : 'bg-primary'} />}
                  title={<span className={`text-xs ${item.isRead ? 'font-medium text-gray-600' : 'font-bold text-primary'}`}>{item.title || item.type?.toUpperCase() || 'System'}</span>}
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
          View all notifications
        </button>
      </div>
    </div>
  );

  return (
    <header className="h-16 px-8 flex justify-between items-center bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-gray-100 shadow-sm ml-[260px]">
      <div className="flex items-center gap-md w-1/3">
        <div className="relative w-full max-w-sm">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" data-icon="search">search</span>
          <input 
            className="w-full pl-10 pr-4 py-2 bg-surface-container-low border-none rounded-full text-body-md focus:ring-2 focus:ring-primary/10 outline-none" 
            placeholder="Search matches, pitches..." 
            type="text"
          />
        </div>
      </div>

      <div className="flex items-center gap-lg">
        {/* Wallet Balance Mock */}
        <div className="flex items-center gap-sm px-4 py-1.5 bg-emerald-50 rounded-full border border-emerald-100 cursor-pointer hover:bg-emerald-100 transition-colors" onClick={() => navigate('/user/wallet')}>
          <span className="material-symbols-outlined text-emerald-900" data-icon="payments">payments</span>
          <span className="font-button text-emerald-900">$150.00</span>
        </div>

        <div className="flex items-center gap-sm">
          <Popover 
            content={notificationContent} 
            trigger="click" 
            open={popoverOpen} 
            onOpenChange={setPopoverOpen} 
            placement="bottomRight"
            overlayInnerStyle={{ padding: 0 }}
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
                <p className="font-button text-on-surface text-sm leading-none">{user?.fullName || 'Player'}</p>
                <p className="text-[10px] font-label-caps text-gray-500 uppercase">{user?.role || 'USER'}</p>
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
                  Profile Settings
                </button>
                <div className="my-1 border-t border-gray-100" />
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-error hover:bg-error-container rounded-md flex items-center gap-2 transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">logout</span>
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
