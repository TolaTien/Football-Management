import React, { useEffect, useState } from 'react';
import { Button, Card, List, Space, Tag, Typography, message } from 'antd';
import { forumApi } from '@/shared/api/modules';
import type { ForumPost } from '@/shared/types/domain';

const AdminForum: React.FC = () => {
  const [posts, setPosts] = useState<ForumPost[]>([]);

  const load = async () => {
    const res = await forumApi.posts({ status: 'open' });
    setPosts(res.data.data);
  };

  useEffect(() => { void load(); }, []);

  return (
    <Card>
      <Typography.Title level={2}>Quản lý diễn đàn</Typography.Title>
      <List
        dataSource={posts}
        renderItem={(post) => (
          <List.Item
            actions={[
              <Button key="close" onClick={async () => { await forumApi.updatePost({ postId: post.postId, status: 'closed' }); message.success('Đã đóng bài'); await load(); }}>Đóng</Button>,
              <Button key="cancel" danger onClick={async () => { await forumApi.updatePost({ postId: post.postId, status: 'canceled' }); message.success('Đã hủy bài'); await load(); }}>Hủy</Button>,
            ]}
          >
            <List.Item.Meta title={post.users?.fullName || 'Người dùng'} description={post.description} />
            <Space>
              <Tag>{post.status}</Tag>
              <span>{post._count?.comments || 0} bình luận</span>
            </Space>
          </List.Item>
        )}
      />
    </Card>
  );
};

export default AdminForum;
