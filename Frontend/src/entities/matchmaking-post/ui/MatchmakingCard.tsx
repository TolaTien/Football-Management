import React from 'react';
import type { PostItem } from '../api/postService';

interface MatchmakingCardProps {
  post: PostItem;
  isLiked: boolean;
  currentUser: { userId: string } | null;
  onToggleLike: (postId: string) => void;
  onOpenComment: (postId: string) => void;
  onOpenEdit?: (post: PostItem) => void;
  onDelete?: (postId: string) => void;
}

const TEAM_REGEX = /ghép đội|tuyển thêm|tìm thủ môn|thiếu người|tìm đồng đội|tìm cầu|tìm chân|đá hộ|ghép kèo|tuyển mem|tuyển quân/i;

export const MatchmakingCard: React.FC<MatchmakingCardProps> = ({
  post,
  isLiked,
  currentUser,
  onToggleLike,
  onOpenComment,
}) => {
  let cleanDescription = post.description || '';
  let computedType: 'opponent' | 'team';

  if (cleanDescription.startsWith('[TÌM ĐỐI] ')) {
    computedType = 'opponent';
    cleanDescription = cleanDescription.replace('[TÌM ĐỐI] ', '');
  } else if (cleanDescription.startsWith('[GHÉP ĐỘI] ')) {
    computedType = 'team';
    cleanDescription = cleanDescription.replace('[GHÉP ĐỘI] ', '');
  } else {
    computedType = TEAM_REGEX.test(cleanDescription) ? 'team' : 'opponent';
  }

  const icon = computedType === 'opponent' ? 'sports_soccer' : 'groups';
  const typeLabel = computedType === 'opponent' ? 'Tìm đối thủ' : 'Tìm đồng đội';

  const getStatusBadge = (status: 'open' | 'closed' | 'canceled') => {
    switch (status) {
      case 'open':
        return (
          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200 uppercase tracking-wider flex items-center gap-1">
            <span className="w-1 h-1 rounded-full bg-emerald-500 animate-ping"></span>
            Đang mở
          </span>
        );
      case 'closed':
        return (
          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-gray-100 text-gray-600 border border-gray-200 uppercase tracking-wider">
            Đã xong
          </span>
        );
      case 'canceled':
        return (
          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-rose-100 text-rose-800 border border-rose-200 uppercase tracking-wider">
            Đã hủy
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div 
      onClick={() => post?.postId && onOpenComment(post.postId)}
      className="bg-white border border-gray-200/80 rounded-xl overflow-hidden hover:shadow-md hover:border-primary transition-all group flex flex-col justify-between p-6 cursor-pointer"
    >
      <div className="flex-grow">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-2">
            <img
              src={
                post?.users?.avt ||
                `https://ui-avatars.com/api/?name=${post?.users?.fullName || 'U'}&background=059669&color=fff`
              }
              className="w-8 h-8 rounded-full border border-primary-container object-cover"
              alt="avatar"
            />
            <div className="flex flex-col">
              <span className="text-xs font-bold text-gray-700 leading-tight">
                {post?.users?.fullName || 'Người dùng ẩn danh'}
              </span>
              <span className="text-[10px] text-gray-400 font-medium">
                {post?.createdAt ? new Date(post.createdAt).toLocaleDateString('vi-VN') : 'N/A'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-primary-container text-primary border border-primary/10 uppercase tracking-wider flex items-center gap-1">
              <span className="material-symbols-outlined text-[12px]">{icon}</span>
              {typeLabel}
            </span>
            {getStatusBadge(post.status)}
          </div>
        </div>

        {/* Description */}
        <div className="mb-4">
          <p className="font-body-md text-slate-800 leading-relaxed line-clamp-3 text-sm font-medium whitespace-pre-line min-h-[3rem]">
            {cleanDescription || 'Không có mô tả chi tiết'}
          </p>
        </div>
      </div>

      {/* Footer and interactive buttons */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-2">
        <div className="flex items-center text-[10px] text-gray-400 font-bold gap-3">
          <span className="flex items-center gap-1" title="Lượt thích">
            <span className="material-symbols-outlined text-[14px]">thumb_up</span>
            {post?._count?.postlike || 0}
          </span>
          <span className="flex items-center gap-1" title="Bình luận">
            <span className="material-symbols-outlined text-[14px]">chat_bubble</span>
            {post?._count?.comments || 0}
          </span>
        </div>

        <div className="flex gap-1.5">
          <button
            onClick={(e) => {
              e.stopPropagation();
              post?.postId && onToggleLike(post.postId);
            }}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all no-underline ${
              isLiked
                ? 'bg-primary-container text-primary'
                : 'text-gray-500 hover:text-primary hover:bg-primary-container/20'
            }`}
          >
            <span
              className="material-symbols-outlined text-[15px]"
              style={{
                fontVariationSettings: isLiked ? "'FILL' 1" : "'FILL' 0",
              }}
            >
              thumb_up
            </span>
            Thích
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              post?.postId && onOpenComment(post.postId);
            }}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold text-gray-500 hover:text-primary hover:bg-primary-container/20 transition-all no-underline"
          >
            <span className="material-symbols-outlined text-[15px]">
              chat_bubble_outline
            </span>
            Bình luận
          </button>
        </div>
      </div>
    </div>
  );
};
