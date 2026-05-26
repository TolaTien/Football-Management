import React from 'react';
import { Dropdown } from 'antd';
import { PostItem } from '@/entities/matchmaking-post/api/postService';

interface GlobalFeedProps {
  posts: PostItem[];
  likedPosts: Record<string, boolean>;
  currentUser: { userId: string } | null;
  onToggleLike: (postId: string) => void;
  onOpenComment: (postId: string) => void;
  onOpenEdit: (post: PostItem) => void;
  onDelete: (postId: string) => void;
}

export const GlobalFeed: React.FC<GlobalFeedProps> = ({
  posts,
  likedPosts,
  currentUser,
  onToggleLike,
  onOpenComment,
  onOpenEdit,
  onDelete,
}) => {
  if (!Array.isArray(posts) || posts.length === 0) {
    return (
      <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
        <p className="text-gray-500 font-body-md">No posts found. Be the first to host a match!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post) => {
        const pId = post?.postId || Math.random().toString();
        const isLiked = !!likedPosts[post.postId];
        const isHost = post?.hostId === currentUser?.userId;

        return (
          <div
            key={pId}
            className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow group relative flex flex-col justify-between"
          >
            <div className="p-6 flex-grow">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                  <img
                    src={
                      post?.users?.avt ||
                      `https://ui-avatars.com/api/?name=${post?.users?.fullName || 'U'}&background=10b981&color=fff`
                    }
                    className="w-8 h-8 rounded-full border border-gray-100"
                    alt="avatar"
                  />
                  <span className="text-sm font-bold text-gray-700">
                    {post?.users?.fullName || 'Anonymous'}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span
                    className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider ${
                      post?.status === 'open' ? 'bg-emerald-900 text-white' : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {post?.status || 'unknown'}
                  </span>
                  {isHost && (
                    <Dropdown
                      menu={{
                        items: [
                          {
                            key: 'edit',
                            label: (
                              <span className="flex items-center gap-2 text-sm font-medium">
                                <span className="material-symbols-outlined text-[16px]">edit</span>
                                Edit Post
                              </span>
                            ),
                            onClick: () => onOpenEdit(post),
                          },
                          {
                            key: 'delete',
                            label: (
                              <span className="flex items-center gap-2 text-sm font-medium text-red-600">
                                <span className="material-symbols-outlined text-[16px]">delete</span>
                                Delete Post
                              </span>
                            ),
                            onClick: () => onDelete(post.postId),
                          },
                        ],
                      }}
                      trigger={['click']}
                      placement="bottomRight"
                    >
                      <button className="text-gray-400 hover:text-gray-900 transition-colors p-1 rounded-full hover:bg-gray-50 flex items-center justify-center">
                        <span className="material-symbols-outlined text-[18px]">more_vert</span>
                      </button>
                    </Dropdown>
                  )}
                </div>
              </div>
              <h3 className="font-h3 text-h3 text-emerald-900 mb-2 line-clamp-2 min-h-[3rem]">
                {post?.description || 'No description provided'}
              </h3>
              <div className="space-y-2 mb-6">
                <div className="flex items-center text-gray-500 text-sm gap-2">
                  <span className="material-symbols-outlined text-sm">calendar_today</span>
                  <span>
                    {post?.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between mt-auto">
                <div className="flex items-center text-xs text-gray-400 font-bold gap-3">
                  <span className="flex items-center gap-1" title="Comments">
                    <span className="material-symbols-outlined text-[16px]">chat_bubble</span>
                    {post?._count?.comments || 0}
                  </span>
                  <span className="flex items-center gap-1" title="Likes">
                    <span className="material-symbols-outlined text-[16px]">thumb_up</span>
                    {post?._count?.postlike || 0}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => post?.postId && onToggleLike(post.postId)}
                    className={`flex items-center gap-1 transition-colors ${
                      isLiked ? 'text-emerald-600' : 'text-gray-500 hover:text-emerald-900'
                    }`}
                  >
                    <span
                      className="material-symbols-outlined text-[18px]"
                      style={{
                        fontVariationSettings: isLiked ? "'FILL' 1" : "'FILL' 0",
                      }}
                    >
                      thumb_up
                    </span>
                    <span className="text-xs font-bold font-button">Like</span>
                  </button>
                  <button
                    onClick={() => post?.postId && onOpenComment(post.postId)}
                    className="flex items-center gap-1 text-gray-500 hover:text-emerald-900 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      chat_bubble_outline
                    </span>
                    <span className="text-xs font-bold font-button">Comment</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
