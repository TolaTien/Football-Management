import React, { useEffect, useState } from 'react';
import { Button, Card, Form, Input, List, Modal, Space, Tag, Typography, message } from 'antd';
import { forumApi } from '@/shared/api/modules';
import type { ForumPost } from '@/shared/types/domain';

const ForumPage: React.FC = () => {
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();

  const load = async () => {
    const res = await forumApi.posts();
    setPosts(res.data.data);
  };

  useEffect(() => { void load(); }, []);

  const create = async (values: { description: string }) => {
    await forumApi.createPost(values);
    message.success('Đã tạo bài viết');
    setOpen(false);
    form.resetFields();
    await load();
  };

  return (
    <Card extra={<Button type="primary" onClick={() => setOpen(true)}>Tạo bài viết</Button>}>
      <Typography.Title level={2}>Diễn đàn</Typography.Title>
      <List
        dataSource={posts}
        renderItem={(post) => (
          <List.Item>
            <List.Item.Meta
              title={post.users?.fullName || 'Người dùng'}
              description={post.description}
            />
            <Space>
              <Tag>{post.status}</Tag>
              <span>{post._count?.comments || 0} bình luận</span>
              <span>{post._count?.postlike || 0} lượt thích</span>
            </Space>
          </List.Item>
        )}
      />
      <Modal open={open} onCancel={() => setOpen(false)} onOk={() => form.submit()} title="Tạo bài viết">
        <Form form={form} layout="vertical" onFinish={create}>
          <Form.Item name="description" label="Nội dung" rules={[{ required: true }]}>
            <Input.TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default ForumPage;
