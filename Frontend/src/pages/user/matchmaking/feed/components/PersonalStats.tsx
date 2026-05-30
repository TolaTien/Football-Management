import React from 'react';

interface PersonalStatsProps {
  totalMyPosts: number;
  activeMyPosts: number;
  totalLikesOnMyPosts: number;
  totalCommentsOnMyPosts: number;
}

export const PersonalStats: React.FC<PersonalStatsProps> = ({
  totalMyPosts,
  activeMyPosts,
  totalLikesOnMyPosts,
  totalCommentsOnMyPosts,
}) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <div className="bg-emerald-50/40 border border-emerald-100/80 rounded-xl p-5 flex flex-col justify-between">
        <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Tổng số bài đăng</span>
        <span className="text-3xl font-extrabold text-emerald-950 mt-2">{totalMyPosts}</span>
      </div>
      <div className="bg-emerald-50/40 border border-emerald-100/80 rounded-xl p-5 flex flex-col justify-between">
        <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Số bài đăng đang mở</span>
        <span className="text-3xl font-extrabold text-emerald-950 mt-2">{activeMyPosts}</span>
      </div>
      <div className="bg-emerald-50/40 border border-emerald-100/80 rounded-xl p-5 flex flex-col justify-between">
        <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Lượt thích nhận được</span>
        <span className="text-3xl font-extrabold text-emerald-950 mt-2">{totalLikesOnMyPosts}</span>
      </div>
      <div className="bg-emerald-50/40 border border-emerald-100/80 rounded-xl p-5 flex flex-col justify-between">
        <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Số lượt bình luận</span>
        <span className="text-3xl font-extrabold text-emerald-950 mt-2">{totalCommentsOnMyPosts}</span>
      </div>
    </div>
  );
};
