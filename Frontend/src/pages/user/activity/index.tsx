import React, { useEffect, useState } from 'react';
import { message } from 'antd';
import { UsersService } from '@/entities/user/api/userService';
import { ActivityStats } from '@/widgets/user-activity-stats';
import { AiCoachChat } from '@/widgets/user-ai-coach-chat';

const PersonalActivityStats: React.FC = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [statsLoading, setStatsLoading] = useState(false);

  useEffect(() => {
    fetchRealStats();
  }, []);

  const fetchRealStats = async () => {
    try {
      setStatsLoading(true);
      const res = await UsersService.getHistoryBooking(1);
      const history = res.history || [];
      setBookings(history);
    } catch (e) {
      console.error('Failed to load user booking statistics:', e);
      message.error('Không thể tải thống kê hoạt động');
    } finally {
      setStatsLoading(false);
    }
  };

  return (
    <div className="pb-xl max-w-7xl mx-auto px-4 md:px-0">
      {/* Title Header */}
      <div className="mb-8">
        <h2 className="font-h1 text-2xl font-bold text-primary">Hoạt động cá nhân</h2>
        <p className="text-secondary text-sm mt-1 font-body-md">
          Phân tích chi tiết số liệu thi đấu thực tế và trao đổi chiến thuật thông minh với Trợ lý AI.
        </p>
      </div>

      {/* Main Responsive Grid layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Real stats & Match list (5 cols) */}
        <div className="lg:col-span-5">
          <ActivityStats bookings={bookings} statsLoading={statsLoading} />
        </div>

        {/* Right Side: Interactive AI Coach (7 cols - Wider chat panel!) */}
        <div className="lg:col-span-7">
          <AiCoachChat />
        </div>

      </div>
    </div>
  );
};

export default PersonalActivityStats;
