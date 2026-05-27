import React from 'react';
import { PostItem } from '@/entities/matchmaking-post/api/postService';

interface MyMatchesProps {
  myPosts: PostItem[];
  onToggleStatus: (post: PostItem) => void;
  onOpenEdit: (post: PostItem) => void;
  onDelete: (postId: string) => void;
  onOpenComment: (postId: string) => void;
  onOpenCreate: () => void;
}

export const MyMatches: React.FC<MyMatchesProps> = ({
  myPosts,
  onToggleStatus,
  onOpenEdit,
  onDelete,
  onOpenComment,
  onOpenCreate,
}) => {
  if (myPosts.length === 0) {
    return (
      <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
        <p className="text-gray-500 font-body-md mb-4">
          You haven't hosted any matchmaking opportunities yet.
        </p>
        <button
          onClick={onOpenCreate}
          className="bg-emerald-900 text-white px-6 py-2.5 rounded-lg font-button hover:bg-emerald-800 transition-all inline-flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          Host Your First Match
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {myPosts.map((post) => (
        <div
          key={post.postId}
          className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow relative flex flex-col justify-between p-6"
        >
          <div>
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center text-gray-500 text-sm gap-2">
                <span className="material-symbols-outlined text-sm">calendar_today</span>
                <span>{new Date(post.createdAt).toLocaleDateString()}</span>
              </div>
              <span
                className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider ${
                  post.status === 'open' ? 'bg-emerald-900 text-white' : 'bg-gray-100 text-gray-600'
                }`}
              >
                {post.status}
              </span>
            </div>
            <h3 className="font-h3 text-h3 text-emerald-900 mb-4 line-clamp-3 min-h-[4.5rem]">
              {post.description}
            </h3>
            <div className="flex items-center text-xs text-gray-400 font-bold gap-3 mb-6">
              <span
                className="flex items-center gap-1 cursor-pointer hover:text-emerald-900"
                onClick={() => onOpenComment(post.postId)}
              >
                <span className="material-symbols-outlined text-[16px]">chat_bubble</span>
                {post._count?.comments || 0} Comments
              </span>
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">thumb_up</span>
                {post._count?.postlike || 0} Likes
              </span>
            </div>
          </div>

          {/* High-visibility Action Panel */}
          <div className="flex gap-2 w-full mt-auto border-t border-gray-100 pt-4">
            <button
              onClick={() => onToggleStatus(post)}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold font-button border transition-all flex items-center justify-center gap-1.5 ${
                post.status === 'open'
                  ? 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
                  : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">
                {post.status === 'open' ? 'lock' : 'lock_open'}
              </span>
              {post.status === 'open' ? 'Close Match' : 'Reopen Match'}
            </button>
            <button
              onClick={() => onOpenEdit(post)}
              className="flex-1 py-2 px-3 rounded-lg text-xs font-bold font-button border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 transition-all flex items-center justify-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">edit</span>
              Edit
            </button>
            <button
              onClick={() => onDelete(post.postId)}
              className="py-2 px-3 rounded-lg text-xs font-bold font-button border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 transition-all flex items-center justify-center"
              title="Delete Match Opportunity"
            >
              <span className="material-symbols-outlined text-[16px]">delete</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
