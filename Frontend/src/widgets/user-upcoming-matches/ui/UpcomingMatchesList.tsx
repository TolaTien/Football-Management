import React, { useEffect, useState } from 'react';
import { Spin, Empty, message } from 'antd';
import { MatchCard, type MatchData, BookingDetailModal } from '@/entities/booking';
import { MatchmakingCard, type MatchmakingData } from '../../../entities/matchmaking-post/ui/MatchmakingCard';
import { UsersService } from '@/entities/user/api/userService';
import { postService } from '@/entities/matchmaking-post/api/postService';
import { useAppSelector } from '@/app/store/hooks';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export const UpcomingMatchesList: React.FC = () => {
  const [matches, setMatches] = useState<MatchData[]>([]);
  const [loading, setLoading] = useState(false);
  const [rawBookings, setRawBookings] = useState<any[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [matchmakingPosts, setMatchmakingPosts] = useState<MatchmakingData[]>([]);
  const [matchmakingLoading, setMatchmakingLoading] = useState(false);
  const user = useAppSelector((state) => state.user.currentUser);

  useEffect(() => {
    fetchHistory();
    fetchMatchmaking();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const res = await UsersService.getHistoryBooking(1);
      const bookingList = res.history || [];
      setRawBookings(bookingList);
      
      const mappedMatches = bookingList.slice(0, 4).map((booking: any) => {
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
          status: booking.status
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

  const fetchMatchmaking = async () => {
    try {
      setMatchmakingLoading(true);
      const posts = await postService.getAllPosts();
      const slicedPosts = posts.slice(0, 2);
      
      const mapped: MatchmakingData[] = slicedPosts.map((post, index) => {
        const type = index % 2 === 0 ? 'match' : 'team';
        const startsIn = dayjs(post.createdAt).fromNow();
        
        return {
          id: post.postId,
          type,
          startsIn,
          title: post.users?.fullName || 'Anonymous Host',
          spotsLeft: (index * 2) + 1,
          level: post.description && post.description.trim() 
            ? (post.description.length > 30 ? post.description.substring(0, 30) + '...' : post.description) 
            : 'General Matchmaking',
          price: 'Free Opportunity',
        };
      });
      setMatchmakingPosts(mapped);
    } catch (error) {
      console.error('Failed to fetch matchmaking posts', error);
    } finally {
      setMatchmakingLoading(false);
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
            matches.map(match => {
              const originalBooking = rawBookings.find(b => b.bookId === match.id);
              return (
                <MatchCard 
                  key={match.id} 
                  data={match} 
                  onViewDetails={() => {
                    setSelectedBooking(originalBooking);
                    setIsDetailModalOpen(true);
                  }}
                />
              );
            })
          )}
        </div>
      </section>

      <section className="pt-sm">
        <div className="flex justify-between items-end mb-md">
          <h3 className="font-h2 text-h2 text-emerald-900">Quick Join Matchmaking</h3>
          <span className="text-xs font-label-caps text-emerald-600 bg-emerald-50 px-2 py-1 rounded">Live matches nearby</span>
        </div>
        
        {matchmakingLoading ? (
          <div className="flex justify-center p-8 bg-white rounded-xl border border-gray-100">
            <Spin size="small" />
          </div>
        ) : matchmakingPosts.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
            <Empty description="Không có bài đăng matchmaking nào gần đây" image={Empty.PRESENTED_IMAGE_SIMPLE} />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-md">
            {matchmakingPosts.map(post => (
              <MatchmakingCard key={post.id} data={post} />
            ))}
          </div>
        )}
      </section>

      {/* Reusable Booking Details Modal */}
      <BookingDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedBooking(null);
        }}
        booking={selectedBooking}
        userFullName={user?.fullName}
      />
    </div>
  );
};
