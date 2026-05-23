import React, { useEffect, useState } from 'react';
import { Spin, Empty, message } from 'antd';
import { MatchCard, type MatchData } from '../../../entities/booking/ui/MatchCard';
import { MatchmakingCard, type MatchmakingData } from '../../../entities/matchmaking-post/ui/MatchmakingCard';
import { UsersService } from '@/entities/user/api/userService';
import { useAppSelector } from '@/app/store/hooks';
import dayjs from 'dayjs';

const MATCHMAKING_POSTS: MatchmakingData[] = [
  {
    id: 'm1',
    type: 'match',
    startsIn: '45m',
    title: 'Evening Scrimmage',
    spotsLeft: 1,
    level: 'Intermediate Level',
    price: '$12.00',
  },
  {
    id: 'm2',
    type: 'team',
    startsIn: '1h 20m',
    title: 'Friday Night Lights',
    spotsLeft: 3,
    level: 'Casual Play',
    price: '$10.00',
  }
];

export const UpcomingMatchesList: React.FC = () => {
  const [matches, setMatches] = useState<MatchData[]>([]);
  const [loading, setLoading] = useState(false);
  const user = useAppSelector((state) => state.user.currentUser);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const res = await UsersService.getHistoryBooking(1);
      
      const mappedMatches = (res.history || []).slice(0, 4).map((booking: any) => {
        const startDate = dayjs(booking.startTime);
        const isToday = startDate.isSame(dayjs(), 'day');
        
        return {
          id: booking.bookId,
          dateLabel: isToday ? 'TODAY' : startDate.format('ddd, DD'),
          time: startDate.format('HH:mm'),
          team1Logo: user?.avt || `https://ui-avatars.com/api/?name=${user?.fullName || 'U'}&background=10b981&color=fff`,
          team2Logo: 'https://ui-avatars.com/api/?name=Opponent&background=f3f4f6&color=6b7280', // Dummy opponent
          title: `Booking: ${booking.pitch?.namePitch || 'Unknown Pitch'}`,
          location: booking.pitch?.namePitch || 'Unknown Location',
          pitchType: booking.pitch?.pitchCategory ? `${booking.pitch.pitchCategory}-a-side` : 'Unknown',
          isToday: isToday,
          status: booking.status // Add status if you want to display it
        } as MatchData;
      });

      setMatches(mappedMatches);
    } catch (error) {
      console.error('Failed to fetch booking history', error);
      message.error('Không thể tải lịch sử đặt sân');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-lg">
      <section className="space-y-md">
        <div className="flex justify-between items-end mb-sm">
          <h3 className="font-h2 text-h2 text-emerald-900">Upcoming Matches</h3>
          <a className="text-primary font-button text-sm hover:underline cursor-pointer">View Schedule</a>
        </div>
        <div className="grid grid-cols-1 gap-md">
          {loading ? (
             <div className="flex justify-center p-8 bg-white rounded-xl border border-gray-100">
               <Spin size="large" />
             </div>
          ) : matches.length === 0 ? (
             <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
                <Empty description="Bạn chưa có lịch đặt sân nào" image={Empty.PRESENTED_IMAGE_SIMPLE} />
             </div>
          ) : (
            matches.map(match => (
              <MatchCard key={match.id} data={match} />
            ))
          )}
        </div>
      </section>

      <section className="pt-sm">
        <div className="flex justify-between items-end mb-md">
          <h3 className="font-h2 text-h2 text-emerald-900">Quick Join Matchmaking</h3>
          <span className="text-xs font-label-caps text-emerald-600 bg-emerald-50 px-2 py-1 rounded">Live matches nearby</span>
        </div>
        <div className="grid grid-cols-2 gap-md">
          {MATCHMAKING_POSTS.map(post => (
            <MatchmakingCard key={post.id} data={post} />
          ))}
        </div>
      </section>
    </div>
  );
};
