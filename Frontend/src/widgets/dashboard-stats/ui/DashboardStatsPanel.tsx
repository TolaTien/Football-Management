import React, { useEffect, useState } from 'react';
import { useNavigate } from '@umijs/max';
import { message, Spin, Empty, Avatar } from 'antd';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { 
  fetchNotifications, 
  markAllNotificationsRead 
} from '@/entities/notification';
import { UsersService } from '@/entities/user/api/userService';
import { StatCard } from '../../../entities/user/ui/StatCard';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const MOCK_SPENDERS = [
  { rank: 1, userId: 'm1', fullName: 'Leo Messi', avt: 'https://ui-avatars.com/api/?name=Leo+Messi&background=f59e0b&color=fff', bookingCount: 48, totalSpent: 2400000 },
  { rank: 2, userId: 'm2', fullName: 'Cristiano Ronaldo', avt: 'https://ui-avatars.com/api/?name=Cristiano+Ronaldo&background=3b82f6&color=fff', bookingCount: 42, totalSpent: 2100000 },
  { rank: 3, userId: 'm3', fullName: 'Neymar Jr', avt: 'https://ui-avatars.com/api/?name=Neymar+Jr&background=10b981&color=fff', bookingCount: 35, totalSpent: 1750000 },
  { rank: 4, userId: 'm4', fullName: 'Kylian Mbappé', avt: 'https://ui-avatars.com/api/?name=Kylian+Mbappe&background=ec4899&color=fff', bookingCount: 29, totalSpent: 1450000 },
  { rank: 5, userId: 'm5', fullName: 'Luka Modrić', avt: 'https://ui-avatars.com/api/?name=Luka+Modric&background=8b5cf6&color=fff', bookingCount: 24, totalSpent: 1200000 }
];

export const DashboardStatsPanel: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const notifications = useAppSelector((state) => state.notification.list);
  const loading = useAppSelector((state) => state.notification.loading);

  const [spenders, setSpenders] = useState<any[]>([]);
  const [spendersLoading, setSpendersLoading] = useState(false);
  const [totalPlayed, setTotalPlayed] = useState(0);

  useEffect(() => {
    dispatch(fetchNotifications(1));
    fetchLeaderboard();
    fetchTotalPlayed();
  }, [dispatch]);

  const fetchLeaderboard = async () => {
    setSpendersLoading(true);
    try {
      const data = await UsersService.getTopSpenders();
      if (Array.isArray(data) && data.length > 0) {
        setSpenders(data);
      } else {
        setSpenders(MOCK_SPENDERS); // mock data nếu chưa có data
      }
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
      setSpenders(MOCK_SPENDERS);
    } finally {
      setSpendersLoading(false);
    }
  };

  const fetchTotalPlayed = async () => {
    try {
      const res = await UsersService.getHistoryBooking(1);
      const approvedCount = (res.history || []).filter((b: any) => b.status === 'approved').length;
      setTotalPlayed(approvedCount);
    } catch (e) {
      console.error('Failed to fetch total played matches:', e);
    }
  };

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
      <StatCard title="TOTAL PLAYED" value={`${totalPlayed} Matches`} icon="sports_soccer" />

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

      {/* Top Players Leaderboard Widget */}
      <div className="bg-white border border-outline-variant rounded-xl p-lg shadow-sm">
        <div className="flex items-center gap-2 mb-md">
          <span className="material-symbols-outlined text-emerald-900 text-xl">emoji_events</span>
          <h3 className="font-h3 text-h3 text-emerald-900">Top Players</h3>
        </div>

        <div className="space-y-sm">
          {spendersLoading ? (
            <div className="flex justify-center py-4"><Spin size="small" /></div>
          ) : spenders.length === 0 ? (
            <Empty description="No leaderboard data" image={Empty.PRESENTED_IMAGE_SIMPLE} />
          ) : (
            spenders.slice(0, 5).map((spender, index) => {
              // Custom rank styles
              let rankBg = 'bg-gray-100 text-gray-700';
              if (spender.rank === 1) rankBg = 'bg-amber-100 text-amber-800 font-bold';
              else if (spender.rank === 2) rankBg = 'bg-slate-100 text-slate-800 font-bold';
              else if (spender.rank === 3) rankBg = 'bg-orange-100 text-orange-800 font-bold';

              return (
                <div key={spender.userId || index} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50/50 transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Rank Badge */}
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0 ${rankBg}`}>
                      {spender.rank}
                    </span>
                    
                    {/* Avatar */}
                    <Avatar 
                      src={spender.avt || `https://ui-avatars.com/api/?name=${spender.fullName || 'P'}&background=10b981&color=fff`} 
                      size="small" 
                      className="shrink-0 border border-gray-100"
                    />

                    {/* Profile Name */}
                    <span className="text-sm font-medium text-gray-800 truncate" title={spender.fullName}>
                      {spender.fullName || 'Anonymous'}
                    </span>
                  </div>

                  {/* Booking Stats / Total spent */}
                  <div className="text-right shrink-0">
                    <p className="text-xs font-bold text-emerald-900">{spender.bookingCount} bookings</p>
                    <p className="text-[10px] text-gray-400 font-medium">
                      {spender.totalSpent ? Number(spender.totalSpent).toLocaleString('vi-VN') + ' ₫' : '0 ₫'}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
