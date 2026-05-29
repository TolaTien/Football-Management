import React, { useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { Row, Col, Typography, Form, message } from 'antd';
import { useAppDispatch, useAppSelector } from '@/shared/model/hooks';
import { fetchForumPosts, addPost, deletePost } from '@/entities/forum/model/forumSlice';
import type { CreateForumPostDto } from '@/entities/forum/model/types';

// FSD Imports
import { ForumListCard } from '@/widgets/AdminForumList';
import { ForumStatsCard } from '@/widgets/AdminForumStats';
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

            <ForumStatsCard />

            <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl shadow-inner">
              <div className="font-bold text-slate-800 mb-1 text-sm">Hướng dẫn Cộng đồng</div>
              <div className="text-slate-500 text-xs leading-relaxed mb-3">
                Mọi bài đăng đều hiển thị công khai. Hãy đảm bảo nội dung tuân thủ các chính sách an toàn của TurfMaster.
              </div>
              <a href="#" className="text-emerald-600 font-bold text-xs hover:text-emerald-700 transition-colors">Xem Sổ tay ↗</a>
            </div>
          </div>
        </Col>
      </Row>
    </PageContainer>
  );
};

export default AdminForum;