import React, { useEffect, useState } from 'react';
import { Modal, Spin, Typography, Avatar, Divider, Empty, Tag } from 'antd';
import { CalendarOutlined, MessageOutlined } from '@ant-design/icons';
import { postService } from '@/entities/matchmaking-post/api/postService';
import type { PostItem } from '@/entities/matchmaking-post/api/postService';

const { Text, Paragraph } = Typography;

interface PostDetailModalProps {
    open: boolean;
    postId: string | null;
    category?: string;
    onCancel: () => void;
}

export const PostDetailModal: React.FC<PostDetailModalProps> = ({ open, postId, category = 'Giao hữu', onCancel }) => {
    const [loading, setLoading] = useState(false);
    const [post, setPost] = useState<PostItem | null>(null);

    useEffect(() => {
        if (open && postId) {
            setLoading(true);
            postService.getPostById(postId)
                .then((data) => {
                    setPost(data);
                })
                .catch(() => {
                    // Xử lý lỗi nếu cần
                })
                .finally(() => {
                    setLoading(false);
                });
        } else {
            setPost(null);
        }
    }, [open, postId]);

    const getAvatar = (url?: string | null, name?: string) => {
        if (url) return url;
        return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name || 'default')}`;
    };

    return (
        <Modal
            open={open}
            onCancel={onCancel}
            footer={null}
            width={700}
            title={
                <div className="flex items-center gap-2 text-slate-800 font-bold border-b border-slate-100 pb-3 text-lg">
                    <MessageOutlined className="text-emerald-600" /> Chi tiết thảo luận
                </div>
            }
            className="rounded-2xl overflow-hidden"
        >
            {loading ? (
                <div className="py-12 flex justify-center items-center">
                    <Spin size="large" />
                </div>
            ) : post ? (
                <div className="py-4 space-y-5">
                    {/* Thông tin tác giả */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Avatar
                                src={getAvatar(post.users?.avt, post.users?.fullName)}
                                alt={post.users?.fullName}
                                size={42}
                                className="shadow-sm border border-slate-100 bg-slate-50"
                            />
                            <div className="flex flex-col">
                                <Text className="font-bold text-slate-800 text-sm">{post.users?.fullName || 'Thành viên'}</Text>
                                <div className="flex items-center gap-1 text-slate-400 text-[11px] font-medium">
                                    <CalendarOutlined />
                                    <span>
                                        {new Date(post.createdAt).toLocaleDateString('vi-VN')} {new Date(post.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Tag color="blue" className="rounded-full px-3 py-0.5 border-none font-semibold text-xs m-0">
                                {category}
                            </Tag>
                            <Tag color={post.status === 'open' ? 'green' : 'default'} className="rounded-full px-3 py-0.5 border-none font-semibold text-xs m-0">
                                {post.status === 'open' ? 'Hoạt động' : 'Đã đóng'}
                            </Tag>
                        </div>
                    </div>

                    {/* Nội dung bài viết */}
                    <div className="bg-gradient-to-r from-emerald-50/30 to-slate-50/50 border border-slate-100 border-l-4 border-l-emerald-500 p-6 rounded-2xl shadow-sm">
                        <Paragraph className="text-slate-800 text-[15px] leading-relaxed whitespace-pre-wrap m-0 font-medium italic">
                            "{post.description}"
                        </Paragraph>
                    </div>

                    <Divider className="my-4 border-slate-100" />

                    {/* Danh sách bình luận */}
                    <div>
                        <div className="font-extrabold text-slate-800 mb-4 text-sm flex items-center gap-1.5">
                            💬 Bình luận ({(post as any).comments?.length || 0})
                        </div>

                        <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
                            {(post as any).comments && (post as any).comments.length > 0 ? (
                                (post as any).comments.map((comment: any) => (
                                    <div key={comment.commentId} className="flex gap-3 bg-white p-3 border border-slate-100 rounded-xl hover:bg-slate-50/20 transition-colors">
                                        <Avatar
                                            src={getAvatar(comment.users?.avt, comment.users?.fullName)}
                                            alt={comment.users?.fullName}
                                            size={32}
                                            className="shadow-sm border border-slate-100 bg-slate-50 flex-shrink-0"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-1">
                                                <Text className="font-bold text-slate-800 text-xs">{comment.users?.fullName || 'Thành viên'}</Text>
                                                <Text className="text-[10px] text-slate-400 font-medium">
                                                    {new Date(comment.createdAt).toLocaleDateString('vi-VN')} {new Date(comment.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                                                </Text>
                                            </div>
                                            <Paragraph className="text-slate-650 text-xs leading-relaxed m-0 whitespace-pre-wrap">
                                                {comment.content}
                                            </Paragraph>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <Empty
                                    description={<span className="text-slate-400 text-xs font-semibold">Chưa có bình luận nào cho bài viết này</span>}
                                />
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                <Empty description={<span className="text-slate-400 text-xs font-semibold">Không tìm thấy thông tin bài đăng</span>} />
            )}
        </Modal>
    );
};
