import React, { useEffect, useState } from 'react';
import { useAppSelector } from '@/app/store/hooks';
import { commentsService, type CommentItem } from '@/entities/comment';
import { postService, type PostItem } from '@/entities/matchmaking-post';


interface CommentModalProps {
  isOpen: boolean;
  onClose: () => void;
  postId: string | null;
}

export const CommentModal: React.FC<CommentModalProps> = ({ isOpen, onClose, postId }) => {
  const currentUser = useAppSelector((state) => state.user.currentUser);

  const [comments, setComments] = useState<CommentItem[]>([]);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [postDetail, setPostDetail] = useState<PostItem | null>(null);
  const [replyingTo, setReplyingTo] = useState<{ commentId: string; userName: string } | null>(null);

  useEffect(() => {
    if (isOpen && postId) {
      fetchComments();
      fetchPostDetail();
    } else {
      setPostDetail(null);
    }
  }, [isOpen, postId]);

  const fetchPostDetail = async () => {
    if (!postId) return;
    try {
      const data = await postService.getPostById(postId);
      setPostDetail(data);
    } catch (error) {
      console.error('Failed to fetch post details', error);
    }
  };

  const fetchComments = async () => {
    if (!postId) return;
    try {
      setLoading(true);
      const data = await commentsService.getCommentsByPost(postId);
      setComments(data);
    } catch (error) {
      console.error('Failed to fetch comments', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !postId) return;
    try {
      setSubmitting(true);
      const parentId = replyingTo?.commentId;
      const newComment = await commentsService.createComment(postId, content, parentId);

      if (parentId) {
        setComments(prev => prev.map(c => {
          if (c.commentId === parentId) {
            return {
              ...c,
              replies: [newComment, ...(c.replies || [])]
            };
          }
          return c;
        }));
      } else {
        setComments(prev => [newComment, ...prev]);
      }
      setContent('');
      setReplyingTo(null);
    } catch (error) {
      console.error('Failed to post comment', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleLike = async (commentId: string, currentLiked: boolean, likeCount: number) => {
    // Optimistic UI update
    setComments(prev => prev.map(c => {
      if (c.commentId === commentId) {
        return {
          ...c,
          isLiked: !currentLiked,
          _count: {
            ...c._count,
            commentlike: currentLiked ? Math.max(0, likeCount - 1) : likeCount + 1
          }
        };
      }
      if (c.replies && c.replies.length > 0) {
        return {
          ...c,
          replies: c.replies.map(r => {
            if (r.commentId === commentId) {
              return {
                ...r,
                isLiked: !currentLiked,
                _count: {
                  ...r._count,
                  commentlike: currentLiked ? Math.max(0, likeCount - 1) : likeCount + 1
                }
              };
            }
            return r;
          })
        };
      }
      return c;
    }));

    try {
      await commentsService.toggleLikeComment(commentId);
    } catch (error) {
      console.error('Failed to toggle like', error);
      // Revert if failed
      setComments(prev => prev.map(c => {
        if (c.commentId === commentId) {
          return {
            ...c,
            isLiked: currentLiked,
            _count: {
              ...c._count,
              commentlike: likeCount
            }
          };
        }
        if (c.replies && c.replies.length > 0) {
          return {
            ...c,
            replies: c.replies.map(r => {
              if (r.commentId === commentId) {
                return {
                  ...r,
                  isLiked: currentLiked,
                  _count: {
                    ...r._count,
                    commentlike: likeCount
                  }
                };
              }
              return r;
            })
          };
        }
        return c;
      }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative bg-white w-full max-w-lg rounded-2xl shadow-xl flex flex-col h-[600px] max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <div>
            <h3 className="font-h3 text-emerald-900">Bình luận</h3>
            <p className="text-xs text-gray-500 font-label">Chia sẻ thông tin trận đấu hoặc trao đổi trực tiếp</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 text-gray-500 transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Comment List */}
        <div className="flex-1 overflow-y-auto p-6 bg-white">
          {/* Bài đăng gốc */}
          {postDetail && (
            <div className="mb-6 p-6 bg-gradient-to-br from-emerald-50 to-emerald-100/40 rounded-2xl border border-emerald-100/40 shadow-sm flex flex-col gap-4 animate-in fade-in slide-in-from-top-4 duration-300">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <img
                    src={postDetail.users?.avt || `https://ui-avatars.com/api/?name=${postDetail.users?.fullName || 'U'}&background=10b981&color=fff`}
                    className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                    alt="host avt"
                  />
                  <div className="flex flex-col">
                    <span className="font-extrabold text-sm text-gray-900 leading-tight">{postDetail.users?.fullName}</span>
                    <span className="text-xs text-gray-500 font-semibold mt-0.5">
                      {new Date(postDetail.createdAt).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                </div>
                <span className="text-[10px] sm:text-xs font-black px-3 py-1.5 rounded-xl bg-emerald-600 text-white uppercase tracking-wider flex items-center gap-1.5 shadow-sm shadow-emerald-950/10">
                  <span className="material-symbols-outlined text-[14px]">
                    {postDetail.description.startsWith('[GHÉP ĐỘI]') ? 'groups' : 'sports_soccer'}
                  </span>
                  {postDetail.description.startsWith('[GHÉP ĐỘI]') ? 'Tìm đồng đội' : 'Tìm đối thủ'}
                </span>
              </div>

              <p className="text-[13px] sm:text-sm text-gray-800 font-semibold leading-relaxed whitespace-pre-wrap mt-2 px-1">
                {postDetail.description.replace(/^\[TÌM ĐỐI\]\s*/, '').replace(/^\[GHÉP ĐỘI\]\s*/, '')}
              </p>
            </div>
          )}

          {loading ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-4">
              <span className="material-symbols-outlined animate-spin text-3xl">autorenew</span>
              <p className="text-sm font-label">Đang tải bình luận...</p>
            </div>
          ) : comments.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mb-2">
                <span className="material-symbols-outlined text-emerald-500 text-3xl">chat_bubble</span>
              </div>
              <p className="font-bold text-gray-600">Chưa có bình luận nào</p>
              <p className="text-sm text-gray-400 text-center max-w-[200px]">Hãy là người đầu tiên trao đổi thông tin về bài đăng này!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {comments.map((comment) => (
                <div key={comment.commentId} className="flex gap-4 group">
                  <img
                    src={comment.users?.avt || `https://ui-avatars.com/api/?name=${comment.users?.fullName || 'U'}&background=10b981&color=fff`}
                    alt="avatar"
                    className="w-10 h-10 rounded-full object-cover border border-gray-100 flex-shrink-0"
                  />
                  <div className="flex-1">
                    <div className="bg-gray-50 rounded-2xl rounded-tl-sm px-4 py-3 border border-gray-100/50">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-sm text-gray-900">{comment.users?.fullName || 'Người dùng ẩn danh'}</span>
                        <span className="text-[11px] text-gray-400">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">{comment.content}</p>
                    </div>

                    <div className="flex items-center gap-4 mt-2 ml-2">
                      <button
                        onClick={() => handleToggleLike(comment.commentId, !!comment.isLiked, comment._count?.commentlike || 0)}
                        className={`flex items-center gap-1 text-[12px] font-bold transition-colors ${comment.isLiked ? 'text-emerald-600' : 'text-gray-400 hover:text-emerald-600'}`}
                      >
                        <span
                          className="material-symbols-outlined text-[16px]"
                          style={{ fontVariationSettings: comment.isLiked ? "'FILL' 1" : "'FILL' 0" }}
                        >
                          thumb_up
                        </span>
                        {comment._count?.commentlike || 0} Thích
                      </button>

                      <button
                        onClick={() => setReplyingTo({ commentId: comment.commentId, userName: comment.users?.fullName || 'Người dùng' })}
                        className="text-[11px] font-bold text-gray-400 hover:text-emerald-600 transition-colors"
                      >
                        Trả lời
                      </button>
                    </div>

                    {/* Kết xuất các câu trả lời con */}
                    {comment.replies && comment.replies.length > 0 && (
                      <div className="ml-12 mt-3 space-y-4 border-l-2 border-emerald-100 pl-4 relative">
                        {comment.replies.map((reply) => (
                          <div key={reply.commentId} className="flex gap-3 group relative">
                            <img
                              src={reply.users?.avt || `https://ui-avatars.com/api/?name=${reply.users?.fullName || 'U'}&background=10b981&color=fff`}
                              alt="avatar"
                              className="w-8 h-8 rounded-full object-cover border border-gray-100 flex-shrink-0"
                            />
                            <div className="flex-1">
                              <div className="bg-gray-50 rounded-xl px-3 py-2 border border-gray-100/50">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="font-extrabold text-xs text-gray-900">{reply.users?.fullName || 'Người dùng ẩn danh'}</span>
                                  <span className="text-[10px] text-gray-400">
                                    {new Date(reply.createdAt).toLocaleDateString()}
                                  </span>
                                </div>
                                <p className="text-xs text-gray-700 whitespace-pre-wrap">{reply.content}</p>
                              </div>

                              <div className="flex items-center gap-4 mt-1.5 ml-2">
                                <button
                                  onClick={() => handleToggleLike(reply.commentId, !!reply.isLiked, reply._count?.commentlike || 0)}
                                  className={`flex items-center gap-1 text-[10px] font-bold transition-colors ${reply.isLiked ? 'text-emerald-600' : 'text-gray-400 hover:text-emerald-600'}`}
                                >
                                  <span
                                    className="material-symbols-outlined text-[13px]"
                                    style={{ fontVariationSettings: reply.isLiked ? "'FILL' 1" : "'FILL' 0" }}
                                  >
                                    thumb_up
                                  </span>
                                  {reply._count?.commentlike || 0} Thích
                                </button>

                                <button
                                  onClick={() => setReplyingTo({ commentId: comment.commentId, userName: reply.users?.fullName || 'Người dùng' })}
                                  className="text-[10px] font-bold text-gray-400 hover:text-emerald-600 transition-colors"
                                >
                                  Trả lời
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-gray-100 bg-white">
          {replyingTo && (
            <div className="flex items-center justify-between bg-emerald-50 px-4 py-2 rounded-xl mb-3 border border-emerald-100 animate-in slide-in-from-bottom duration-200">
              <span className="text-xs font-semibold text-emerald-900">
                Đang phản hồi <strong className="font-extrabold">@{replyingTo.userName}</strong>
              </span>
              <button
                onClick={() => setReplyingTo(null)}
                className="text-[10px] text-emerald-700 font-bold hover:text-emerald-950 bg-emerald-100 px-2 py-1 rounded-md"
              >
                Hủy
              </button>
            </div>
          )}
          <form onSubmit={handleSubmit} className="flex items-end gap-3">
            <img
              src={currentUser?.avt || `https://ui-avatars.com/api/?name=${currentUser?.fullName || 'Me'}&background=10b981&color=fff`}
              alt="avatar"
              className="w-9 h-9 rounded-full object-cover border border-gray-100 flex-shrink-0 mb-1"
            />
            <div className="flex-1 relative">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Nhập nội dung trao đổi..."
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all resize-none min-h-[44px] max-h-[120px]"
                rows={1}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
              />
            </div>
            <button
              type="submit"
              disabled={!content.trim() || submitting}
              className="w-11 h-11 bg-emerald-600 text-white rounded-full flex items-center justify-center flex-shrink-0 shadow-sm hover:bg-emerald-700 disabled:opacity-50 disabled:hover:bg-emerald-600 transition-all mb-[2px]"
            >
              {submitting ? (
                <span className="material-symbols-outlined animate-spin text-[20px]">autorenew</span>
              ) : (
                <span className="material-symbols-outlined text-[20px] ml-0.5">send</span>
              )}
            </button>
          </form>
          <div className="text-[10px] text-gray-400 text-center mt-2 font-label">
            Nhấn phím <span className="font-bold">Enter</span> để gửi
          </div>
        </div>

      </div>
    </div>
  );
};
