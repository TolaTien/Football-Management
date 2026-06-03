import React from 'react';
import { Card, Select, Tag, Typography } from 'antd';
import { EditOutlined, DeleteOutlined, PushpinOutlined } from '@ant-design/icons';
import type { ForumPost } from '@/entities/forum/model/types';

const { Text } = Typography;

interface ForumListCardProps {
  posts: ForumPost[];
  onDelete: (id: string) => void;
  onViewDetails: (post: ForumPost) => void;
}

export const ForumListCard: React.FC<ForumListCardProps> = ({ posts, onDelete, onViewDetails }) => {
  return (
    <Card bordered={false} bodyStyle={{ padding: 24 }} className="rounded-2xl border border-slate-205 shadow-sm bg-white">
      <div className="flex gap-4 mb-6 items-center flex-wrap">
        <Select defaultValue="all" className="w-44 h-9" options={[{ value: 'all', label: 'Tất cả danh mục' }]} />
        <Select defaultValue="newest" className="w-36 h-9" options={[{ value: 'newest', label: 'Mới nhất' }]} />
        <div className="ml-auto text-slate-400 text-xs font-semibold">
          Đang hiển thị {posts.length} thảo luận
        </div>
      </div>

      {/* Table headers */}
      <div className="grid grid-cols-[3fr_1fr_1.5fr_1fr_1fr] px-4 pb-4 border-b border-slate-100 text-slate-400 font-bold text-xs">
        <div>Tiêu đề bài viết</div>
        <div>Danh mục</div>
        <div>Tác giả</div>
        <div>Ngày đăng</div>
        <div className="text-right">Thao tác</div>
      </div>

      {/* Table rows */}
      <div className="divide-y divide-slate-100">
        {posts.map(post => (
          <div key={post.id} className="grid grid-cols-[3fr_1fr_1.5fr_1fr_1fr] px-4 py-5 items-center hover:bg-slate-50/40 transition-colors">
            {/* Khối tiêu đề và nội dung bài viết */}
            <div className="pr-4 cursor-pointer" onClick={() => onViewDetails(post)}>
              <div className="font-bold text-slate-800 text-sm mb-1 flex items-center gap-1.5">
                {post.title}
                {post.status === 'pending' && <PushpinOutlined className="text-red-500 text-[10px]" />}
              </div>
              <div className="text-slate-400 text-xs line-clamp-1 hover:text-emerald-650 transition-colors">
                {post.content || 'Nội dung hiển thị tóm tắt tại đây...'}
              </div>
            </div>

            <div>
              <Tag color="blue" className="rounded-full px-3 py-0.5 border-none font-semibold text-xs">
                {post.category}
              </Tag>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-extrabold flex-shrink-0 select-none">
                {post.author.substring(0, 1).toUpperCase()}
              </div>
              <Text className="font-semibold text-slate-700 text-xs">{post.author}</Text>
            </div>
            <div className="text-slate-405 text-xs font-medium">
              {post.date}
            </div>
            <div className="text-right flex justify-end gap-4 text-slate-400 text-base">
              <EditOutlined className="cursor-pointer hover:text-emerald-600 transition-colors" onClick={() => onViewDetails(post)} />
              <DeleteOutlined className="cursor-pointer text-red-500 hover:text-red-700 transition-colors" onClick={() => onDelete(post.id)} />
            </div>
          </div>
        ))}
        {posts.length === 0 && (
          <div className="py-12 text-center text-slate-400 text-sm font-semibold">Chưa có thảo luận nào</div>
        )}
      </div>
    </Card>
  );
};
