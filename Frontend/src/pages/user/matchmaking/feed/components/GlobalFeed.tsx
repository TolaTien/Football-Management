import React, { useState } from 'react';
import { Dropdown, Segmented } from 'antd';
import { PostItem } from '@/entities/matchmaking-post/api/postService';
import { MatchmakingCard } from '@/entities/matchmaking-post/ui/MatchmakingCard';

interface GlobalFeedProps {
  posts: PostItem[];
  likedPosts: Record<string, boolean>;
  currentUser: { userId: string } | null;
  onToggleLike: (postId: string) => void;
  onOpenComment: (postId: string) => void;
  onOpenEdit: (post: PostItem) => void;
  onDelete: (postId: string) => void;
}

const TEAM_REGEX = /ghép đội|tuyển thêm|tìm thủ môn|thiếu người|tìm đồng đội|tìm cầu|tìm chân|đá hộ|ghép kèo|tuyển mem|tuyển quân/i;

export const GlobalFeed: React.FC<GlobalFeedProps> = ({
  posts,
  likedPosts,
  currentUser,
  onToggleLike,
  onOpenComment,
  onOpenEdit,
  onDelete,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'opponent' | 'team'>('all');
  const [isHistoryExpanded, setIsHistoryExpanded] = useState(false);

  // 1. Tiền xử lý bài đăng để giải mã tiền tố (Mã hóa description ẩn)
  const processedPosts = Array.isArray(posts)
    ? posts.map((post) => {
        let cleanDescription = post.description || '';
        let computedType: 'opponent' | 'team';

        if (cleanDescription.startsWith('[TÌM ĐỐI] ')) {
          computedType = 'opponent';
          cleanDescription = cleanDescription.replace('[TÌM ĐỐI] ', '');
        } else if (cleanDescription.startsWith('[GHÉP ĐỘI] ')) {
          computedType = 'team';
          cleanDescription = cleanDescription.replace('[GHÉP ĐỘI] ', '');
        } else {
          // Tương thích ngược: Phán đoán dựa trên từ khóa Regex
          computedType = TEAM_REGEX.test(cleanDescription) ? 'team' : 'opponent';
        }

        return {
          ...post,
          computedType,
          cleanDescription,
        };
      })
    : [];

  // Phân loại Hoạt động (status = open) vs Lịch sử (status = closed / canceled)
  const openPosts = processedPosts.filter((post) => post.status === 'open');
  const closedPosts = processedPosts.filter((post) => post.status === 'closed' || post.status === 'canceled');

  // Tính số lượng kèo theo từng Tab phân loại (chỉ tính kèo đang mở)
  const countAll = openPosts.length;
  const countOpponent = openPosts.filter((p) => p.computedType === 'opponent').length;
  const countTeam = openPosts.filter((p) => p.computedType === 'team').length;

  // Lọc danh sách kèo Đang mở dựa trên tab được chọn
  const filteredOpenPosts = openPosts.filter((post) => {
    if (activeTab === 'opponent') {
      return post.computedType === 'opponent';
    } else if (activeTab === 'team') {
      return post.computedType === 'team';
    }
    return true;
  });

  // 2. Trích xuất Kèo Hot nhất (tối đa 2 bài viết đang mở có tổng tương tác Like + Comment cao nhất)
  const trendingPosts = [...openPosts]
    .sort((a, b) => {
      const scoreA = (a._count?.postlike ?? 0) + (a._count?.comments ?? 0);
      const scoreB = (b._count?.postlike ?? 0) + (b._count?.comments ?? 0);
      return scoreB - scoreA;
    })
    .slice(0, 2);

  const getStatusBadge = (status: 'open' | 'closed' | 'canceled') => {
    switch (status) {
      case 'open':
        return (
          <span className="text-[10px] font-bold px-2 py-1 rounded bg-emerald-100 text-emerald-800 border border-emerald-200 uppercase tracking-wider flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
            Đang mở
          </span>
        );
      case 'closed':
        return (
          <span className="text-[10px] font-bold px-2 py-1 rounded bg-gray-100 text-gray-600 border border-gray-200 uppercase tracking-wider">
            Đã ghép xong
          </span>
        );
      case 'canceled':
        return (
          <span className="text-[10px] font-bold px-2 py-1 rounded bg-rose-100 text-rose-800 border border-rose-200 uppercase tracking-wider">
            Đã hủy
          </span>
        );
      default:
        return (
          <span className="text-[10px] font-bold px-2 py-1 rounded bg-gray-100 text-gray-500 uppercase tracking-wider">
            Không rõ
          </span>
        );
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* BỐ CỤC 2 CỘT: 65% - 35% */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* CỘT TRÁI (65%): Bảng tin Hoạt động */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
            <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
              <span className="material-symbols-outlined text-emerald-600">sports_soccer</span>
              Kèo ghép cặp đang diễn ra
            </h3>
            
            {/* Bộ lọc Tab Phân loại từ khóa */}
            <Segmented
              options={[
                {
                  label: (
                    <div className="flex items-center gap-1.5 px-2 py-0.5 text-xs font-bold">
                      <span className="material-symbols-outlined text-[15px]">explore</span>
                      Tất cả ({countAll})
                    </div>
                  ),
                  value: 'all',
                },
                {
                  label: (
                    <div className="flex items-center gap-1.5 px-2 py-0.5 text-xs font-bold">
                      <span className="material-symbols-outlined text-[15px]">sports_martial_arts</span>
                      Tìm đối thủ ({countOpponent})
                    </div>
                  ),
                  value: 'opponent',
                },
                {
                  label: (
                    <div className="flex items-center gap-1.5 px-2 py-0.5 text-xs font-bold">
                      <span className="material-symbols-outlined text-[15px]">diversity_3</span>
                      Tìm đồng đội ({countTeam})
                    </div>
                  ),
                  value: 'team',
                },
              ]}
              value={activeTab}
              onChange={(val) => setActiveTab(val as 'all' | 'opponent' | 'team')}
              className="bg-emerald-50/60 text-emerald-950 p-0.5 rounded-lg border border-emerald-100/50 self-start sm:self-auto"
            />
          </div>

          {filteredOpenPosts.length === 0 ? (
            <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
              <span className="material-symbols-outlined text-4xl text-gray-300 mb-3">sports_soccer</span>
              <p className="text-gray-500 font-medium">Không tìm thấy bài viết ghép cặp nào đang mở phù hợp.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredOpenPosts.map((post) => (
                <MatchmakingCard
                  key={post.postId || Math.random().toString()}
                  post={post}
                  isLiked={!!likedPosts[post.postId]}
                  currentUser={currentUser}
                  onToggleLike={onToggleLike}
                  onOpenComment={onOpenComment}
                  onOpenEdit={onOpenEdit}
                  onDelete={onDelete}
                />
              ))}
            </div>
          )}
        </div>

        {/* CỘT PHẢI (35%): Tiện ích phụ (Widget Kèo Hot & Lịch sử) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* WIDGET KÈO HOT TRONG TUẦN (TRENDING) */}
          <div className="bg-gradient-to-br from-amber-50/60 to-orange-50/60 border border-orange-100 rounded-2xl p-5 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-orange-400/5 to-red-400/5 rounded-full blur-xl group-hover:scale-125 transition-transform duration-500"></div>
            
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-orange-500 animate-pulse text-[20px]">
                local_fire_department
              </span>
              <h4 className="font-bold text-orange-950 text-sm uppercase tracking-wider">Kèo Hot Trong Tuần</h4>
            </div>

            {trendingPosts.length === 0 ? (
              <p className="text-gray-400 text-xs py-4 text-center font-medium">Chưa có kèo nào nổi bật tuần này.</p>
            ) : (
              <div className="flex flex-col gap-3">
                {trendingPosts.map((post, idx) => {
                  return (
                    <div
                      key={post.postId}
                      onClick={() => onOpenComment(post.postId)}
                      className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-orange-100 hover:border-orange-300 hover:shadow-sm transition-all cursor-pointer flex flex-col gap-2.5 relative"
                    >
                      {/* Huy hiệu thứ hạng */}
                      <span className={`absolute -top-1.5 -left-1.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black text-white shadow-sm ${
                        idx === 0 ? 'bg-orange-500' : 'bg-amber-500'
                      }`}>
                        {idx + 1}
                      </span>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <img
                            src={
                              post?.users?.avt ||
                              `https://ui-avatars.com/api/?name=${post?.users?.fullName || 'U'}&background=f97316&color=fff`
                            }
                            className="w-5 h-5 rounded-full object-cover border border-orange-100"
                            alt="avatar"
                          />
                          <span className="text-[10px] font-bold text-gray-600 line-clamp-1">
                            {post?.users?.fullName || 'Ẩn danh'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-[9px] text-gray-400 font-bold">
                          <span className="flex items-center gap-0.5">
                            <span className="material-symbols-outlined text-[12px] text-orange-400">thumb_up</span>
                            {post?._count?.postlike || 0}
                          </span>
                          <span className="flex items-center gap-0.5">
                            <span className="material-symbols-outlined text-[12px] text-orange-400">chat_bubble</span>
                            {post?._count?.comments || 0}
                          </span>
                        </div>
                      </div>
                      
                      {/* Hiển thị mô tả đã làm sạch */}
                      <p className="text-xs font-semibold text-gray-700 line-clamp-2 leading-relaxed">
                        {post.cleanDescription}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* LỊCH SỬ GHÉP CẶP THÀNH CÔNG (ACCORDION) */}
          <div className="bg-white border border-gray-200/80 rounded-2xl overflow-hidden shadow-sm">
            <button
              onClick={() => setIsHistoryExpanded(!isHistoryExpanded)}
              className="w-full flex items-center justify-between p-4 bg-gray-50/50 hover:bg-gray-50 transition-colors text-left"
            >
              <div className="flex items-center gap-2 text-gray-700 font-bold text-xs uppercase tracking-wider">
                <span className="material-symbols-outlined text-gray-500 text-[18px]">history</span>
                <span>Lịch sử ghép kèo ({closedPosts.length})</span>
              </div>
              <span className={`material-symbols-outlined text-gray-400 transition-transform duration-300 text-[18px] ${
                isHistoryExpanded ? 'rotate-180' : ''
              }`}>
                expand_more
              </span>
            </button>
            
            {isHistoryExpanded && (
              <div className="p-4 border-t border-gray-100 flex flex-col gap-3 bg-gray-50/10 max-h-[360px] overflow-y-auto">
                {closedPosts.length === 0 ? (
                  <p className="text-center py-6 text-xs text-gray-400 font-medium">Không có lịch sử kèo nào phù hợp.</p>
                ) : (
                  closedPosts.map((post) => {
                    const isHost = post?.hostId === currentUser?.userId;
                    return (
                      <div
                        key={post.postId}
                        className="bg-white border border-gray-100 p-3 rounded-lg flex flex-col gap-2 relative opacity-60 hover:opacity-100 transition-opacity"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5">
                            <img
                              src={
                                post?.users?.avt ||
                                `https://ui-avatars.com/api/?name=${post?.users?.fullName || 'U'}&background=9ca3af&color=fff`
                              }
                              className="w-4 h-4 rounded-full object-cover"
                              alt="avatar"
                            />
                            <span className="text-[9px] font-bold text-gray-500 line-clamp-1">
                              {post?.users?.fullName || 'Ẩn danh'}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            {getStatusBadge(post.status)}
                            {isHost && (
                              <Dropdown
                                menu={{
                                  items: [
                                    {
                                      key: 'delete',
                                      label: (
                                        <span className="flex items-center gap-1 text-xs font-semibold text-red-600">
                                          <span className="material-symbols-outlined text-[14px]">delete</span>
                                          Xóa lịch sử
                                        </span>
                                      ),
                                      onClick: () => onDelete(post.postId),
                                    },
                                  ],
                                }}
                                trigger={['click']}
                                placement="bottomRight"
                              >
                                <button className="text-gray-400 hover:text-gray-900 transition-colors flex items-center justify-center p-0.5 hover:bg-gray-100 rounded">
                                  <span className="material-symbols-outlined text-[14px]">more_vert</span>
                                </button>
                              </Dropdown>
                            )}
                          </div>
                        </div>

                        {/* Hiển thị mô tả đã làm sạch */}
                        <p className="text-xs font-medium text-gray-500 line-clamp-2 leading-relaxed">
                          {post.cleanDescription}
                        </p>

                        <div className="flex justify-between items-center text-[9px] text-gray-400 font-semibold pt-1 border-t border-gray-50">
                          <span>{post?.createdAt ? new Date(post.createdAt).toLocaleDateString('vi-VN') : ''}</span>
                          <span
                            onClick={() => onOpenComment(post.postId)}
                            className="text-emerald-700 cursor-pointer hover:underline flex items-center gap-0.5"
                          >
                            <span className="material-symbols-outlined text-[10px]">chat_bubble</span>
                            {post?._count?.comments || 0} bình luận
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
