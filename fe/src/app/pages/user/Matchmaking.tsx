import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, MapPin, Clock, Users, Star, Heart, MessageCircle, Send, TrendingUp } from 'lucide-react';
import { postsApi } from '../../../api/posts.api';
import { message, Spin } from 'antd';
import { useAuthStore } from '../../../store/auth.store';

export default function MatchmakingFeed() {
  const { user } = useAuthStore();
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [description, setDescription] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);

  const [activeCommentsPostId, setActiveCommentsPostId] = useState<string | null>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<any | null>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await postsApi.getAll({});
      setPosts(res.data?.posts || []);
    } catch (err) {
      message.error("Lỗi khi tải danh sách tìm đối");
    } finally {
      setLoading(false);
    }
  };

  const loadComments = async (postId: string) => {
    if (activeCommentsPostId === postId) {
      setActiveCommentsPostId(null);
      setComments([]);
      return;
    }
    
    setActiveCommentsPostId(postId);
    setLoadingComments(true);
    try {
      const res = await postsApi.getComments(postId);
      setComments(res.data || []);
    } catch (err) {
      message.error("Lỗi khi tải bình luận");
    } finally {
      setLoadingComments(false);
    }
  };

  const handleCreateComment = async () => {
    if (!newComment.trim() || !activeCommentsPostId) return;
    try {
      await postsApi.createComment({ 
        postId: activeCommentsPostId, 
        content: newComment,
        parentId: replyingTo?.commentId 
      });
      setNewComment('');
      setReplyingTo(null);
      loadComments(activeCommentsPostId); // reload comments
      fetchPosts(); // reload posts to update comment count
    } catch (err) {
      message.error("Lỗi khi gửi bình luận");
    }
  };

  const toggleLike = async (postId: string) => {
    try {
      const res = await postsApi.toggleLikePost({ postId });
      // update specifically that post
      setPosts(prev => prev.map(p => {
        if (p.postId === postId) {
          return {
            ...p,
            _count: { ...p._count, postlike: res.data?.totalLikes },
            isLiked: res.data?.liked
          }
        }
        return p;
      }));
    } catch (err) {
      message.error("Lỗi khi tương tác");
    }
  };

  const handleCreatePost = async () => {
    if (!description.trim()) {
      message.error("Vui lòng nhập mô tả");
      return;
    }
    setSubmitLoading(true);
    try {
      await postsApi.create({ description });
      message.success("Đăng bài thành công");
      setShowCreatePost(false);
      setDescription('');
      fetchPosts();
    } catch (err: any) {
      message.error(err.response?.data?.message || "Đăng bài thất bại");
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-1">Tìm đối thủ</h2>
          <p className="text-sm text-black/50">Kết nối với các đội bóng khác</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowCreatePost(true)}
          className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-shadow flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Đăng bài
        </motion.button>
      </div>

      {/* Filter Pills */}
      <div className="flex gap-3 overflow-x-auto pb-2">
        {['Tất cả', 'Đang mở', 'Đã chốt'].map((filter) => (
          <motion.button
            key={filter}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-white/80 backdrop-blur-xl border border-black/10 rounded-xl text-sm font-medium hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-500 hover:text-white hover:border-transparent transition-all whitespace-nowrap"
          >
            {filter}
          </motion.button>
        ))}
      </div>

      {/* Posts Grid */}
      {loading ? <div className="p-10 flex justify-center"><Spin size="large" /></div> : 
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {posts.map((post, index) => {
          const author = post.users?.fullName || 'Người dùng';
          const avatar = post.users?.avt ? <img src={post.users.avt} className="w-full h-full object-cover" alt="" /> : author.substring(0,2).toUpperCase();
          const likes = post._count?.postlike || 0;
          const commentsCount = post._count?.comments || 0;
          const createdAt = new Date(post.createdAt);
          
          return (
          <motion.div
            key={post.postId}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5 }}
            className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-black/5"
          >
            {/* Author Info */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold overflow-hidden">
                  {avatar}
                </div>
                <div>
                  <h4 className="font-semibold">{author}</h4>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-1 rounded-lg ${
                      post.status === 'open'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {post.status === 'open' ? 'Đang mở' : 'Đã đóng'}
                    </span>
                    <span className="text-xs text-black/50">{createdAt.toLocaleDateString('vi-VN')}</span>
                  </div>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 hover:bg-black/5 rounded-lg transition-colors"
              >
                <Star className="w-5 h-5 text-yellow-400" />
              </motion.button>
            </div>

            {/* Post Content */}
            <p className="text-sm mb-4 text-black/70">{post.description}</p>

            {/* Match Details */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="p-3 bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-xl">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-medium text-blue-600">Thời gian</span>
                </div>
                <p className="text-sm font-semibold">Cập nhật theo TT</p>
              </div>

              <div className="p-3 bg-gradient-to-r from-purple-50 to-purple-100/50 rounded-xl">
                <div className="flex items-center gap-2 mb-1">
                  <MapPin className="w-4 h-4 text-purple-600" />
                  <span className="text-xs font-medium text-purple-600">Địa điểm</span>
                </div>
                <p className="text-sm font-semibold">Tự do</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => toggleLike(post.postId)}
                className={`flex-1 px-4 py-2 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
                  post.isLiked
                    ? 'bg-gradient-to-r from-pink-500 to-red-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Heart className={`w-4 h-4 ${post.isLiked ? 'fill-white' : ''}`} />
                {likes}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => loadComments(post.postId)}
                className={`flex-1 px-4 py-2 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
                  activeCommentsPostId === post.postId ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <MessageCircle className="w-4 h-4" />
                {commentsCount}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                Tham gia
              </motion.button>
            </div>

            {/* Comments Section */}
            {activeCommentsPostId === post.postId && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-4 pt-4 border-t border-black/5"
              >
                <div className="space-y-4 max-h-60 overflow-y-auto pr-2 mb-4">
                  {loadingComments ? (
                    <div className="flex justify-center p-4"><Spin /></div>
                  ) : comments.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-2">Chưa có bình luận nào.</p>
                  ) : (
                    comments.map(comment => (
                      <div key={comment.commentId} className="bg-gray-50 rounded-xl p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-xs font-bold overflow-hidden">
                            {comment.users?.avt ? <img src={comment.users.avt} className="w-full h-full object-cover" alt="" /> : comment.users?.fullName?.substring(0,2).toUpperCase()}
                          </div>
                          <span className="font-semibold text-sm">{comment.users?.fullName}</span>
                          <span className="text-xs text-gray-400">{new Date(comment.createdAt).toLocaleDateString('vi-VN')}</span>
                        </div>
                        <p className="text-sm text-gray-700 ml-8">{comment.content}</p>
                      </div>
                    ))
                  )}
                </div>
                
                {/* Add Comment Input */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Viết bình luận..."
                    onKeyDown={(e) => e.key === 'Enter' && handleCreateComment()}
                    className="flex-1 px-4 py-2 bg-gray-50 border border-black/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCreateComment}
                    disabled={!newComment.trim()}
                    className="px-4 py-2 bg-blue-500 text-white rounded-xl font-medium shadow-md hover:bg-blue-600 disabled:opacity-50"
                  >
                    Gửi
                  </motion.button>
                </div>
              </motion.div>
            )}
          </motion.div>
        )})}
      </div>}

      {/* Trending Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-black/5"
      >
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-orange-500" />
          <h3 className="text-lg font-semibold">Đội bóng nổi bật</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { name: 'FC Thunder', members: 24, rating: 4.8 },
            { name: 'Golden Boys', members: 18, rating: 4.6 },
            { name: 'Victory Team', members: 32, rating: 4.9 },
          ].map((team, index) => (
            <motion.div
              key={team.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="p-4 bg-gradient-to-br from-white to-blue-50 rounded-xl border border-black/5 cursor-pointer"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white font-bold">
                  {team.name.substring(0, 2)}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-sm">{team.name}</h4>
                  <p className="text-xs text-black/50">{team.members} thành viên</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span className="text-sm font-semibold">{team.rating}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Create Post Modal */}
      <AnimatePresence>
        {showCreatePost && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCreatePost(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white rounded-2xl shadow-2xl p-6 z-50 max-h-[90vh] overflow-y-auto"
            >
              <h3 className="text-xl font-bold mb-4">Tạo bài đăng tìm đối</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Mô tả</label>
                  <textarea
                    placeholder="Mô tả về đội bóng và yêu cầu..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-black/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
                    rows={4}
                  />
                </div>
                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowCreatePost(false)}
                    className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                  >
                    Hủy
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCreatePost}
                    disabled={submitLoading}
                    className={`flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-shadow ${submitLoading ? 'opacity-70' : ''}`}
                  >
                    {submitLoading ? 'Đang xử lý...' : 'Đăng bài'}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
