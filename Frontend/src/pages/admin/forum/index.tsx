import React, { useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { Row, Col, Typography, Form, message } from 'antd';
import { useAppDispatch, useAppSelector } from '@/shared/model/hooks';
import { fetchForumPosts, addPost, deletePost } from '@/entities/forum/model/forumSlice';
import type { CreateForumPostDto } from '@/entities/forum/model/types';

// FSD Imports
import { ForumListCard } from '@/widgets/AdminForumList';
import { QuickDraftCard } from '@/features/manage-forum';

const { Title, Text } = Typography;

const AdminForum: React.FC = () => {
  const dispatch = useAppDispatch();
  const { posts } = useAppSelector((state) => state.forum);
  const [form] = Form.useForm();

  useEffect(() => {
    dispatch(fetchForumPosts());
  }, [dispatch]);

  const handlePost = (values: Omit<CreateForumPostDto, 'status'>) => {
    dispatch(addPost({
      title: values.title,
      category: values.category,
      author: 'Admin',
      content: values.content
    }));
    message.success('Đã đăng bài viết mới!');
    form.resetFields();
  };

  const handleDelete = (id: string) => {
    dispatch(deletePost(id));
    message.success('Đã xóa!');
  };

  return (
    <PageContainer
      header={{
        title: <Title level={2} className="m-0 font-extrabold text-slate-800 tracking-tight">Diễn đàn Cộng đồng</Title>,
        subTitle: <Text className="text-slate-400 text-xs mt-1 block">Quản lý thảo luận thành viên, báo cáo sân bãi và thông báo cộng đồng.</Text>,
      }}
    >
      <Row gutter={[24, 24]}>
        {/* Cột trái: Danh sách thảo luận */}
        <Col xs={24} lg={16}>
          <ForumListCard posts={posts} onDelete={handleDelete} />
        </Col>

        {/* Cột phải: Bản thảo nhanh & Thống kê */}
        <Col xs={24} lg={8}>
          <div className="space-y-6">
            <QuickDraftCard form={form} onFinish={handlePost} />

            <div className="p-5 bg-emerald-50/70 border border-emerald-100 rounded-2xl shadow-sm">
              <div className="font-extrabold text-emerald-800 mb-2 text-sm flex items-center gap-1.5">
                📜 Nội quy Cộng đồng
              </div>
              <div className="text-emerald-700/90 text-xs leading-relaxed mb-4">
                Vui lòng tuân thủ quy tắc ứng xử chuẩn mực. Không đăng tải nội dung rác, quảng cáo sai quy định hoặc bài viết xúc phạm người khác. Các bài viết vi phạm sẽ bị kiểm duyệt và gỡ bỏ.
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </PageContainer>
  );
};

export default AdminForum;