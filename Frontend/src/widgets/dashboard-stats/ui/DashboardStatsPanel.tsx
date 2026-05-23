import React, { useEffect } from 'react';
import { useNavigate } from '@umijs/max';
import { message, Spin, Empty } from 'antd';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { 
  fetchNotifications, 
  markAllNotificationsRead 
} from '@/entities/notification/model/notificationSlice';
import { StatCard } from '../../../entities/user/ui/StatCard';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export const DashboardStatsPanel: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const notifications = useAppSelector((state) => state.notification.list);
  const loading = useAppSelector((state) => state.notification.loading);

  useEffect(() => {
    dispatch(fetchNotifications(1));
  }, [dispatch]);

  const handleMarkReadAll = async () => {
    try {
      await dispatch(markAllNotificationsRead()).unwrap();
      message.success('Đã đánh dấu tất cả là đã đọc');
    } catch (err) {
      message.error('Thao tác thất bại');
    }
  };

  return (
    <div className="space-y-lg">
      <StatCard title="TOTAL PLAYED" value="42 Matches" icon="sports_soccer" />

      {/* Notifications Widget inline */}
      <div className="bg-white border border-outline-variant rounded-xl p-lg shadow-sm">
        <div className="flex justify-between items-center mb-md">
          <h3 className="font-h3 text-h3 text-emerald-900">Notifications</h3>
          <button 
            onClick={handleMarkReadAll}
            className="text-xs font-button text-gray-400 hover:text-primary transition-colors"
          >
            Mark read
          </button>
        </div>
        
        <div className="space-y-md min-h-[100px]">
          {loading ? (
            <div className="flex justify-center py-4"><Spin size="small" /></div>
          ) : notifications.slice(0, 3).length === 0 ? (
            <Empty description="No notifications" image={Empty.PRESENTED_IMAGE_SIMPLE} />
          ) : (
            notifications.slice(0, 3).map(notif => (
              <div key={notif.id} className={`flex gap-md group ${notif.isRead ? 'opacity-70' : ''}`}>
                <div className={`w-2 h-2 rounded-full mt-2 ${!notif.isRead ? 'bg-primary' : 'bg-transparent border border-gray-300'}`}></div>
                <div className="flex-1">
                  <p className="text-sm font-button text-on-surface line-clamp-1">{notif.title || (notif.type ? notif.type.toUpperCase() : 'Notification')}</p>
                  <p className="text-xs text-gray-500 line-clamp-2">{notif.content}</p>
                  <p className="text-[10px] text-gray-400 mt-1 uppercase font-label-caps">{dayjs(notif.createdAt).fromNow()}</p>
                </div>
              </div>
            ))
          )}
        </div>
        
        <button 
          onClick={() => navigate('/user/profile?tab=notifications')}
          className="w-full mt-lg pt-md border-t border-gray-100 text-sm font-button text-gray-500 hover:text-primary transition-colors"
        >
          View All Notifications
        </button>
      </div>

      {/* Pitch Status Widget inline */}
      <div className="bg-white border border-outline-variant rounded-xl p-lg overflow-hidden relative shadow-sm">
        <h3 className="font-h3 text-h3 text-emerald-900 mb-md">Pitch Status</h3>
        <div className="space-y-sm">
          <div className="flex items-center justify-between text-xs font-button mb-xs">
            <span className="text-gray-600">Stadium Arena</span>
            <span className="text-error font-bold">BUSY</span>
          </div>
          <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
            <div className="bg-error w-[85%] h-full"></div>
          </div>
          
          <div className="flex items-center justify-between text-xs font-button mt-4 mb-xs">
            <span className="text-gray-600">West Wing Pitches</span>
            <span className="text-emerald-600 font-bold">AVAILABLE</span>
          </div>
          <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
            <div className="bg-emerald-500 w-[30%] h-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
