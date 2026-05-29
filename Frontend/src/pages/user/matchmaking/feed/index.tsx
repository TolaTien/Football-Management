import React, { useState, useEffect } from 'react';
import { CommentModal, CreatePostModal } from '@/features/user-matchmaking';
import { postService, PostItem } from '@/entities/matchmaking-post/api/postService';
import { useAppSelector } from '@/app/store/hooks';
import { message, Modal, Segmented } from 'antd';
import { PersonalStats } from './components/PersonalStats';
import { GlobalFeed } from './components/GlobalFeed';
import { MyMatches } from './components/MyMatches';

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
        <GlobalFeed
          posts={posts}
          likedPosts={likedPosts}
          currentUser={currentUser}
          onToggleLike={handleToggleLikePost}
          onOpenComment={handleOpenComment}
          onOpenEdit={handleOpenEdit}
          onDelete={handleDeletePost}
        />
      ) : (
        /* My Hosted Matches Dashboard Widget */
        <div>
          {/* Summary Stats Cards */}
          <PersonalStats
            totalMyPosts={totalMyPosts}
            activeMyPosts={activeMyPosts}
            totalLikesOnMyPosts={totalLikesOnMyPosts}
            totalCommentsOnMyPosts={totalCommentsOnMyPosts}
          />

          <MyMatches
            myPosts={myPosts}
            onToggleStatus={handleToggleStatus}
            onOpenEdit={handleOpenEdit}
            onDelete={handleDeletePost}
            onOpenComment={handleOpenComment}
            onOpenCreate={handleOpenCreate}
          />
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

