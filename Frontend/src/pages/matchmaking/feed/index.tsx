import React, { useState, useEffect } from 'react';
import { CommentModal } from '../../../features/matchmaking/ui/CommentModal';
import { postService, PostItem } from '@/entities/matchmaking-post/api/postService';
import { message } from 'antd';

const SocialMatchmakingFeed: React.FC = () => {
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activePostId, setActivePostId] = useState<string | null>(null);
  const [isCommentOpen, setIsCommentOpen] = useState(false);
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const data = await postService.getAllPosts();
      setPosts(data);
    } catch (error) {
      console.error('Failed to fetch posts', error);
      message.error('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenComment = (postId: string) => {
    setActivePostId(postId);
    setIsCommentOpen(true);
  };

  const handleToggleLikePost = (postId: string) => {
    setLikedPosts(prev => ({ ...prev, [postId]: !prev[postId] }));
  };

  return (
    <div className="p-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h2 className="font-h1 text-h1 text-emerald-900">Team Matchmaking</h2>
          <p className="font-body-md text-gray-500 mt-1">Find opponent teams for your next competitive or casual fixture.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white border border-gray-200 rounded-lg px-3 py-2 gap-2">
            <span className="text-xs font-label-caps text-gray-400">SKILL LEVEL:</span>
            <select className="border-none bg-transparent text-sm font-bold text-emerald-900 focus:ring-0 p-0">
              <option>All Levels</option>
              <option>Amateur</option>
              <option>Intermediate</option>
              <option>Professional</option>
            </select>
          </div>
          <button className="bg-emerald-50 text-emerald-900 px-4 py-2 rounded-lg font-button flex items-center gap-2 hover:bg-emerald-100 transition-colors">
            <span className="material-symbols-outlined text-sm">filter_list</span>
            More Filters
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <span className="material-symbols-outlined animate-spin text-4xl text-emerald-600">autorenew</span>
        </div>
      ) : (!Array.isArray(posts) || posts.length === 0) ? (
        <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
          <p className="text-gray-500 font-body-md">No posts found. Be the first to host a match!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <div key={post?.postId || Math.random()} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow group relative">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2">
                    <img 
                      src={post?.users?.avt || `https://ui-avatars.com/api/?name=${post?.users?.fullName || 'U'}&background=10b981&color=fff`} 
                      className="w-8 h-8 rounded-full border border-gray-100"
                      alt="avatar"
                    />
                    <span className="text-sm font-bold text-gray-700">{post?.users?.fullName || 'Anonymous'}</span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider ${
                    post?.status === 'open' ? 'bg-emerald-900 text-white' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {post?.status || 'unknown'}
                  </span>
                </div>
                <h3 className="font-h3 text-h3 text-emerald-900 mb-2 line-clamp-2 min-h-[3rem]">
                  {post?.description || 'No description provided'}
                </h3>
                <div className="space-y-2 mb-6">
                  <div className="flex items-center text-gray-500 text-sm gap-2">
                    <span className="material-symbols-outlined text-sm">calendar_today</span>
                    <span>{post?.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'N/A'}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-xs text-gray-400 font-bold gap-3">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">chat_bubble</span>
                      {post?._count?.comments || 0}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => post?.postId && handleToggleLikePost(post.postId)}
                      className={`flex items-center gap-1 transition-colors ${post?.postId && likedPosts[post.postId] ? 'text-emerald-600' : 'text-gray-500 hover:text-emerald-900'}`}
                    >
                      <span className="material-symbols-outlined text-[18px]">thumb_up</span>
                      <span className="text-xs font-bold font-button">Like</span>
                    </button>
                    <button 
                      onClick={() => post?.postId && handleOpenComment(post.postId)}
                      className="flex items-center gap-1 text-gray-500 hover:text-emerald-900 transition-colors"
                    >
                      <span className="material-symbols-outlined text-[18px]">chat_bubble_outline</span>
                      <span className="text-xs font-bold font-button">Comment</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-12 flex justify-center">
        <button className="border border-gray-200 bg-white text-emerald-900 px-8 py-3 rounded-lg font-button hover:bg-gray-50 transition-all flex items-center gap-2">
          Load More Opportunities
          <span className="material-symbols-outlined text-sm">expand_more</span>
        </button>
      </div>

      <div className="fixed bottom-8 right-8">
        <button className="bg-emerald-900 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all group">
          <span className="material-symbols-outlined">add</span>
          <span className="absolute right-full mr-4 bg-emerald-900 text-white px-4 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none font-button">Host a Match</span>
        </button>
      </div>

      <CommentModal 
        isOpen={isCommentOpen}
        onClose={() => setIsCommentOpen(false)}
        postId={activePostId}
      />
    </div>
  );
};

export default SocialMatchmakingFeed;
