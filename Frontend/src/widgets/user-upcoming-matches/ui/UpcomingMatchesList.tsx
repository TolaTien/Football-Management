import React, { useEffect, useState } from 'react';
import { Spin, Empty, message } from 'antd';
import { Link } from '@umijs/max';
import { MatchCard, type MatchData, BookingDetailModal } from '@/entities/booking';
import { MatchmakingCard, postService, type PostItem } from '@/entities/matchmaking-post';
import { UsersService } from '@/entities/user';
import { useAppSelector } from '@/app/store/hooks';
import { CommentModal } from '@/features/user-matchmaking';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

interface UpcomingMatchesListProps {
  onLoadCount?: (count: number) => void;
}

export const UpcomingMatchesList: React.FC<UpcomingMatchesListProps> = ({ onLoadCount }) => {
  const [matches, setMatches] = useState<MatchData[]>([]);
  const [loading, setLoading] = useState(false);
  const [rawBookings, setRawBookings] = useState<any[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [matchmakingPosts, setMatchmakingPosts] = useState<PostItem[]>([]);
  const [matchmakingLoading, setMatchmakingLoading] = useState(false);
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});
  const [activePostId, setActivePostId] = useState<string | null>(null);
  const [isCommentOpen, setIsCommentOpen] = useState(false);
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
          dateLabel: isToday ? 'HÔM NAY' : startDate.format('ddd, DD'),
          time: startDate.format('HH:mm'),
          team1Logo: user?.avt || `https://ui-avatars.com/api/?name=${user?.fullName || 'U'}&background=10b981&color=fff`,
          team2Logo: 'https://ui-avatars.com/api/?name=Opponent&background=f3f4f6&color=6b7280', // Dummy opponent
          title: `Đơn đặt: ${booking.pitch?.namePitch || 'Sân chưa rõ'}`,
          location: booking.pitch?.namePitch || 'Sân chưa rõ',
          pitchType: booking.pitch?.pitchCategory ? `Sân ${booking.pitch.pitchCategory} người` : 'Chưa rõ',
          isToday: isToday,
          status: booking.status
        } as MatchData;
      });

      setMatches(mappedMatches);
      if (onLoadCount) {
        onLoadCount(mappedMatches.length);
      }
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

      // Lọc tối đa 2 bài viết đang hoạt động (open)
      const openPosts = posts.filter(p => p.status === 'open').slice(0, 2);
      setMatchmakingPosts(openPosts);

      // Cập nhật trạng thái Thích ban đầu từ dữ liệu backend
      const initialLikes: Record<string, boolean> = {};
      openPosts.forEach(p => {
        if (p.isLiked) {
          initialLikes[p.postId] = true;
        }
      });
      setLikedPosts(prev => ({ ...prev, ...initialLikes }));
    } catch (error) {
      console.error('Failed to fetch matchmaking posts', error);
    } finally {
      setMatchmakingLoading(false);
    }
  };

  const handleOpenComment = (postId: string) => {
    setActivePostId(postId);
    setIsCommentOpen(true);
  };

  const handleToggleLikePost = async (postId: string) => {
    const isCurrentlyLiked = !!likedPosts[postId];

    // Cập nhật UI nhanh (Optimistic UI)
    setLikedPosts(prev => ({ ...prev, [postId]: !isCurrentlyLiked }));
    setMatchmakingPosts(prev =>
      prev.map(p => {
        if (p.postId === postId) {
          const currentLikes = p._count?.postlike ?? 0;
          const newCount = isCurrentlyLiked ? Math.max(0, currentLikes - 1) : currentLikes + 1;
          return {
            ...p,
            _count: {
              ...p._count,
              postlike: newCount,
            },
          };
        }
        return p;
      })
    );

    try {
      await postService.toggleLikePost(postId);
    } catch (error) {
      console.error('Failed to toggle like', error);
      // Revert lại trạng thái nếu gọi API thất bại
      setLikedPosts(prev => ({ ...prev, [postId]: isCurrentlyLiked }));
      setMatchmakingPosts(prev =>
        prev.map(p => {
          if (p.postId === postId) {
            const currentLikes = p._count?.postlike ?? 0;
            const newCount = isCurrentlyLiked ? currentLikes + 1 : Math.max(0, currentLikes - 1);
            return {
              ...p,
              _count: {
                ...p._count,
                postlike: newCount,
              },
            };
          }
          return p;
        })
      );
    }
  };

  return (
    <div className="space-y-lg">
      <section className="space-y-md">
        <div className="flex justify-between items-end mb-sm">
          <h3 className="font-h2 text-h2 text-primary">Trận đấu sắp tới</h3>
          <Link to="/user/profile?tab=bookings" className="text-primary font-button text-sm hover:underline no-underline cursor-pointer">Xem lịch đấu</Link>
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
          <h3 className="font-h2 text-h2 text-primary">Tham gia cáp kèo nhanh</h3>
          <span className="text-xs font-label-caps text-primary bg-primary-container px-2 py-1 rounded">Kèo đấu trực tiếp gần đây</span>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
            {matchmakingPosts.map(post => (
              <MatchmakingCard
                key={post.postId}
                post={post}
                isLiked={!!likedPosts[post.postId]}
                currentUser={user}
                onToggleLike={handleToggleLikePost}
                onOpenComment={handleOpenComment}
              />
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

      {/* Reusable Matchmaking Comment Modal */}
      <CommentModal
        isOpen={isCommentOpen}
        onClose={() => setIsCommentOpen(false)}
        postId={activePostId}
      />
    </div>
  );
};
