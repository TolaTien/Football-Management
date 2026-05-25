import React, { useState, useEffect } from 'react';
import { CommentModal } from '../../../features/matchmaking/ui/CommentModal';
import { CreatePostModal } from '../../../features/matchmaking/ui/CreatePostModal';
import { postService, PostItem } from '@/entities/matchmaking-post/api/postService';
import { useAppSelector } from '@/app/store/hooks';
import { message, Dropdown, Modal, Segmented } from 'antd';

const SocialMatchmakingFeed: React.FC = () => {
  const currentUser = useAppSelector((state) => state.user.currentUser);
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activePostId, setActivePostId] = useState<string | null>(null);
  const [isCommentOpen, setIsCommentOpen] = useState(false);
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [postToEdit, setPostToEdit] = useState<PostItem | null>(null);
  const [feedTab, setFeedTab] = useState<'all' | 'mine'>('all');

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

  const handleToggleLikePost = async (postId: string) => {
    const isCurrentlyLiked = !!likedPosts[postId];

    // Optimistic UI update
    setLikedPosts(prev => ({ ...prev, [postId]: !isCurrentlyLiked }));
    setPosts(prev =>
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
      // Revert state if backend request fails
      setLikedPosts(prev => ({ ...prev, [postId]: isCurrentlyLiked }));
      setPosts(prev =>
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

  const handleOpenCreate = () => {
    setPostToEdit(null);
    setIsCreateOpen(true);
  };

  const handleOpenEdit = (post: PostItem) => {
    setPostToEdit(post);
    setIsCreateOpen(true);
  };

  const handleToggleStatus = async (post: PostItem) => {
    const newStatus = post.status === 'open' ? 'closed' : 'open';
    try {
      await postService.updatePost(post.postId, post.description, newStatus);
      setPosts(prev =>
        prev.map(p => (p.postId === post.postId ? { ...p, status: newStatus } : p))
      );
      message.success(`Match status updated to ${newStatus}`);
    } catch (error) {
      console.error('Failed to toggle status:', error);
      message.error('Failed to update status');
    }
  };

  const handleDeletePost = (postId: string) => {
    Modal.confirm({
      title: 'Delete Matchmaking Post',
      content: 'Are you sure you want to delete this matchmaking post? This action cannot be undone.',
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      centered: true,
      onOk: async () => {
        try {
          await postService.deletePost(postId);
          setPosts(prev => prev.filter(p => p.postId !== postId));
          message.success('Matchmaking post deleted successfully');
        } catch (error) {
          console.error('Failed to delete post:', error);
        }
      },
    });
  };

  const handleSuccess = (savedPost: PostItem, isEdit: boolean) => {
    if (isEdit) {
      setPosts(prev =>
        prev.map(p =>
          p.postId === savedPost.postId
            ? { ...p, ...savedPost, users: p.users }
            : p
        )
      );
    } else {
      const postWithUser: PostItem = {
        ...savedPost,
        users: {
          userId: currentUser?.userId || '',
          fullName: currentUser?.fullName || 'Me',
          avt: currentUser?.avt || null,
        },
        _count: {
          comments: 0,
          postlike: 0,
        },
      };
      setPosts(prev => [postWithUser, ...prev]);
    }
  };

  // Compute Personal Stats
  const myPosts = posts.filter(p => p.hostId === currentUser?.userId);
  const totalMyPosts = myPosts.length;
  const activeMyPosts = myPosts.filter(p => p.status === 'open').length;
  const totalLikesOnMyPosts = myPosts.reduce((acc, p) => acc + (p._count?.postlike || 0), 0);
  const totalCommentsOnMyPosts = myPosts.reduce((acc, p) => acc + (p._count?.comments || 0), 0);

  return (
    <div className="p-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h2 className="font-h1 text-h1 text-emerald-900">Team Matchmaking</h2>
          <p className="font-body-md text-gray-500 mt-1">Find opponent teams for your next competitive or casual fixture.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleOpenCreate}
            className="bg-emerald-900 text-white px-4 py-2 rounded-lg font-button flex items-center gap-2 hover:bg-emerald-800 transition-colors"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            Host a Match
          </button>
        </div>
      </div>

      {/* Segmented Switcher for Workspace Tabs */}
      <div className="mb-8">
        <Segmented
          options={[
            {
              label: (
                <div className="flex items-center gap-2 px-4 py-1.5 font-bold">
                  <span className="material-symbols-outlined text-[16px]">explore</span>
                  All Opportunities
                </div>
              ),
              value: 'all',
            },
            {
              label: (
                <div className="flex items-center gap-2 px-4 py-1.5 font-bold">
                  <span className="material-symbols-outlined text-[16px]">dashboard</span>
                  My Hosted Matches ({totalMyPosts})
                </div>
              ),
              value: 'mine',
            },
          ]}
          value={feedTab}
          onChange={(val) => setFeedTab(val as 'all' | 'mine')}
          className="bg-emerald-50 text-emerald-950 p-1 rounded-xl"
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <span className="material-symbols-outlined animate-spin text-4xl text-emerald-600">autorenew</span>
        </div>
      ) : feedTab === 'all' ? (
        /* Global Feed View */
        (!Array.isArray(posts) || posts.length === 0) ? (
          <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
            <p className="text-gray-500 font-body-md">No posts found. Be the first to host a match!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <div key={post?.postId || Math.random()} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow group relative flex flex-col justify-between">
                <div className="p-6 flex-grow">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2">
                      <img 
                        src={post?.users?.avt || `https://ui-avatars.com/api/?name=${post?.users?.fullName || 'U'}&background=10b981&color=fff`} 
                        className="w-8 h-8 rounded-full border border-gray-100"
                        alt="avatar"
                      />
                      <span className="text-sm font-bold text-gray-700">{post?.users?.fullName || 'Anonymous'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider ${
                        post?.status === 'open' ? 'bg-emerald-900 text-white' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {post?.status || 'unknown'}
                      </span>
                      {post?.hostId === currentUser?.userId && (
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
                                onClick: () => handleOpenEdit(post),
                              },
                              {
                                key: 'delete',
                                label: (
                                  <span className="flex items-center gap-2 text-sm font-medium text-red-600">
                                    <span className="material-symbols-outlined text-[16px]">delete</span>
                                    Delete Post
                                  </span>
                                ),
                                onClick: () => handleDeletePost(post.postId),
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
                      <span>{post?.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'N/A'}</span>
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
                        onClick={() => post?.postId && handleToggleLikePost(post.postId)}
                        className={`flex items-center gap-1 transition-colors ${post?.postId && likedPosts[post.postId] ? 'text-emerald-600' : 'text-gray-500 hover:text-emerald-900'}`}
                      >
                        <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: likedPosts[post?.postId] ? "'FILL' 1" : "'FILL' 0" }}>thumb_up</span>
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
        )
      ) : (
        /* My Hosted Matches Dashboard Widget */
        <div>
          {/* Summary Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-emerald-50/40 border border-emerald-100/80 rounded-xl p-5 flex flex-col justify-between">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Total Hosted</span>
              <span className="text-3xl font-extrabold text-emerald-950 mt-2">{totalMyPosts}</span>
            </div>
            <div className="bg-emerald-50/40 border border-emerald-100/80 rounded-xl p-5 flex flex-col justify-between">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Active Spots</span>
              <span className="text-3xl font-extrabold text-emerald-950 mt-2">{activeMyPosts}</span>
            </div>
            <div className="bg-emerald-50/40 border border-emerald-100/80 rounded-xl p-5 flex flex-col justify-between">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Likes Received</span>
              <span className="text-3xl font-extrabold text-emerald-950 mt-2">{totalLikesOnMyPosts}</span>
            </div>
            <div className="bg-emerald-50/40 border border-emerald-100/80 rounded-xl p-5 flex flex-col justify-between">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Comments Count</span>
              <span className="text-3xl font-extrabold text-emerald-950 mt-2">{totalCommentsOnMyPosts}</span>
            </div>
          </div>

          {myPosts.length === 0 ? (
            <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
              <p className="text-gray-500 font-body-md mb-4">You haven't hosted any matchmaking opportunities yet.</p>
              <button 
                onClick={handleOpenCreate}
                className="bg-emerald-900 text-white px-6 py-2.5 rounded-lg font-button hover:bg-emerald-800 transition-all inline-flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-sm">add</span>
                Host Your First Match
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myPosts.map((post) => (
                <div key={post.postId} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow relative flex flex-col justify-between p-6">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center text-gray-500 text-sm gap-2">
                        <span className="material-symbols-outlined text-sm">calendar_today</span>
                        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider ${
                        post.status === 'open' ? 'bg-emerald-900 text-white' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {post.status}
                      </span>
                    </div>
                    <h3 className="font-h3 text-h3 text-emerald-900 mb-4 line-clamp-3 min-h-[4.5rem]">
                      {post.description}
                    </h3>
                    <div className="flex items-center text-xs text-gray-400 font-bold gap-3 mb-6">
                      <span className="flex items-center gap-1 cursor-pointer hover:text-emerald-900" onClick={() => handleOpenComment(post.postId)}>
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
                      onClick={() => handleToggleStatus(post)}
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
                      onClick={() => handleOpenEdit(post)}
                      className="flex-1 py-2 px-3 rounded-lg text-xs font-bold font-button border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 transition-all flex items-center justify-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-[16px]">edit</span>
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeletePost(post.postId)}
                      className="py-2 px-3 rounded-lg text-xs font-bold font-button border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 transition-all flex items-center justify-center"
                      title="Delete Match Opportunity"
                    >
                      <span className="material-symbols-outlined text-[16px]">delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Pagination controls only visible on global feed when posts exist */}
      {feedTab === 'all' && !loading && Array.isArray(posts) && posts.length > 0 && (
        <div className="mt-12 flex justify-center">
          <button className="border border-gray-200 bg-white text-emerald-900 px-8 py-3 rounded-lg font-button hover:bg-gray-50 transition-all flex items-center gap-2">
            Load More Opportunities
            <span className="material-symbols-outlined text-sm">expand_more</span>
          </button>
        </div>
      )}

      <div className="fixed bottom-8 right-8">
        <button 
          onClick={handleOpenCreate}
          className="bg-emerald-900 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all group"
        >
          <span className="material-symbols-outlined">add</span>
          <span className="absolute right-full mr-4 bg-emerald-900 text-white px-4 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none font-button">Host a Match</span>
        </button>
      </div>

      <CreatePostModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSuccess={handleSuccess}
        postToEdit={postToEdit}
      />

      <CommentModal 
        isOpen={isCommentOpen}
        onClose={() => setIsCommentOpen(false)}
        postId={activePostId}
      />
    </div>
  );
};

export default SocialMatchmakingFeed;
