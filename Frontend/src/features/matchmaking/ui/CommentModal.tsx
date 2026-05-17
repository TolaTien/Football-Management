import React, { useEffect, useState } from 'react';
import { useModel } from '@umijs/max';
import { commentsService, CommentItem } from '../../../shared/api/comments/comments.service';

interface CommentModalProps {
  isOpen: boolean;
  onClose: () => void;
  postId: string | null;
}

export const CommentModal: React.FC<CommentModalProps> = ({ isOpen, onClose, postId }) => {
  const { initialState } = useModel('@@initialState');
  const currentUser = initialState?.currentUser;

  const [comments, setComments] = useState<CommentItem[]>([]);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && postId) {
      fetchComments();
    }
  }, [isOpen, postId]);

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
      const newComment = await commentsService.createComment(postId, content);
      setComments(prev => [newComment, ...prev]);
      setContent('');
    } catch (error) {
      console.error('Failed to post comment', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId: string) => {
    try {
      await commentsService.deleteComment(commentId);
      setComments(prev => prev.filter(c => c.commentId !== commentId));
    } catch (error) {
      console.error('Failed to delete comment', error);
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
            <h3 className="font-h3 text-emerald-900">Comments</h3>
            <p className="text-xs text-gray-500 font-label">Share your thoughts or ask questions</p>
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
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-4">
              <span className="material-symbols-outlined animate-spin text-3xl">autorenew</span>
              <p className="text-sm font-label">Loading comments...</p>
            </div>
          ) : comments.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mb-2">
                <span className="material-symbols-outlined text-emerald-500 text-3xl">chat_bubble</span>
              </div>
              <p className="font-bold text-gray-600">No comments yet</p>
              <p className="text-sm text-gray-400 text-center max-w-[200px]">Be the first to start the conversation for this match!</p>
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
                        <span className="font-bold text-sm text-gray-900">{comment.users?.fullName || 'Unknown User'}</span>
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
                        {comment._count?.commentlike || 0} {comment._count?.commentlike === 1 ? 'Like' : 'Likes'}
                      </button>
                      
                      {currentUser?.userId === comment.userId && (
                        <button 
                          onClick={() => handleDelete(comment.commentId)}
                          className="flex items-center gap-1 text-[12px] font-bold text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-gray-100 bg-white">
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
                placeholder="Write a comment..."
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
            Press <span className="font-bold">Enter</span> to post
          </div>
        </div>

      </div>
    </div>
  );
};
