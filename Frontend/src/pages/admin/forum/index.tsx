import React, { useState } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { Row, Col, Card, Typography, Button, Space, Input, Select, Form, message, Tag } from 'antd';
import { EditOutlined, DeleteOutlined, PushpinOutlined, MessageFilled, FileTextOutlined, TagsOutlined, SaveOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '@/shared/model/hooks';
import { addPost, deletePost } from '@/entities/forum/model/forumSlice';
import type { CreateForumPostDto } from '@/entities/forum/model/types';

const { Title, Text } = Typography;

const AdminForum: React.FC = () => {
  const dispatch = useAppDispatch();
  const { posts } = useAppSelector((state) => state.forum);
  const [form] = Form.useForm();

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

  return (
    <PageContainer
      header={{
        title: <Title level={2} style={{ margin: 0, fontWeight: 700 }}>Diễn đàn Cộng đồng</Title>,
        subTitle: <Text style={{ color: '#6b7280' }}>Quản lý thảo luận thành viên, báo cáo sân bãi và thông báo cộng đồng.</Text>,
      }}
    >
      <Row gutter={[24, 24]}>
        {/* Cột trái: Danh sách bài viết */}
        <Col xs={24} lg={16}>
          <Card bordered={false} bodyStyle={{ padding: 24, borderRadius: 12, boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
              <Select defaultValue="all" style={{ width: 180 }} options={[{ value: 'all', label: 'Tất cả danh mục' }]} />
              <Select defaultValue="newest" style={{ width: 150 }} options={[{ value: 'newest', label: 'Mới nhất' }]} />
              <div style={{ marginLeft: 'auto', alignSelf: 'center', color: '#6b7280', fontSize: 13 }}>
                Đang hiển thị {posts.length} thảo luận
              </div>
            </div>

            {/* Bảng danh sách */}
            <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr 1.5fr 1fr 1fr', padding: '0 16px 16px', borderBottom: '1px solid #f3f4f6', color: '#6b7280', fontWeight: 600, fontSize: 13 }}>
              <div>Tiêu đề bài viết</div>
              <div>Danh mục</div>
              <div>Tác giả</div>
              <div>Ngày đăng</div>
              <div style={{ textAlign: 'right' }}>Thao tác</div>
            </div>

            {posts.map(post => (
              <div key={post.id} style={{ display: 'grid', gridTemplateColumns: '3fr 1fr 1.5fr 1fr 1fr', padding: '20px 16px', borderBottom: '1px solid #f3f4f6', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 700, color: '#1f2937', fontSize: 15, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 8 }}>
                    {post.title} {post.status === 'pending' && <PushpinOutlined style={{ color: '#dc2626', fontSize: 12 }} />}
                  </div>
                  <div style={{ color: '#6b7280', fontSize: 13, display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {post.content || 'Nội dung hiển thị tóm tắt tại đây...'}
                  </div>
                </div>
                <div>
                  <Tag color="blue" style={{ borderRadius: 12, padding: '2px 10px', fontSize: 12 }}>{post.category}</Tag>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', backgroundColor: '#059669', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700 }}>
                    {post.author.substring(0, 1)}
                  </div>
                  <Text style={{ fontWeight: 600, color: '#4b5563', fontSize: 13 }}>{post.author}</Text>
                </div>
                <div style={{ color: '#6b7280', fontSize: 13 }}>
                  {post.date}
                </div>
                <div style={{ textAlign: 'right', display: 'flex', justifyContent: 'flex-end', gap: 16, color: '#9ca3af', fontSize: 16 }}>
                  <EditOutlined style={{ cursor: 'pointer' }} />
                  <DeleteOutlined style={{ cursor: 'pointer', color: '#dc2626' }} onClick={() => { dispatch(deletePost(post.id)); message.success('Đã xóa!'); }} />
                </div>
              </div>
            ))}
          </Card>
        </Col>

        {/* Cột phải: Bản thảo nhanh & Thống kê */}
        <Col xs={24} lg={8}>
          <Card bordered={false} bodyStyle={{ padding: 0, borderRadius: 12, boxShadow: '0 1px 2px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
            {/* Header xanh */}
            <div style={{
              background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
              padding: '20px 24px',
              display: 'flex', alignItems: 'center', gap: 12,
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                backgroundColor: 'rgba(255,255,255,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <EditOutlined style={{ color: '#fff', fontSize: 18 }} />
              </div>
              <div>
                <div style={{ color: '#fff', fontSize: 16, fontWeight: 700 }}>Bản thảo nhanh</div>
                <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: 12 }}>Tạo bài đăng mới cho cộng đồng</div>
              </div>
            </div>

            {/* Form */}
            <div style={{ padding: '24px' }}>
              <Form form={form} layout="vertical" onFinish={handlePost}>
                <Form.Item
                  name="title"
                  label={<span style={{ fontWeight: 600, color: '#374151', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}><FileTextOutlined style={{ color: '#059669' }} /> Tiêu đề</span>}
                  rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}
                >
                  <Input placeholder="Tiêu đề bài viết..." size="large" style={{ borderRadius: 10, borderColor: '#d1d5db' }} />
                </Form.Item>

                <Form.Item
                  name="category"
                  label={<span style={{ fontWeight: 600, color: '#374151', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}><TagsOutlined style={{ color: '#059669' }} /> Danh mục</span>}
                  rules={[{ required: true, message: 'Chọn danh mục' }]}
                >
                  <Select
                    size="large"
                    placeholder="Chọn danh mục"
                    options={[
                      { value: 'Thông báo', label: '📢 Thông báo' },
                      { value: 'Bảo trì', label: '🔧 Bảo trì' },
                      { value: 'Giải đấu', label: '🏆 Giải đấu' },
                    ]}
                    style={{ borderRadius: 10 }}
                  />
                </Form.Item>

                <Form.Item
                  name="content"
                  label={<span style={{ fontWeight: 600, color: '#374151', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}><EditOutlined style={{ color: '#059669' }} /> Nội dung</span>}
                  rules={[{ required: true, message: 'Vui lòng nhập nội dung' }]}
                >
                  <Input.TextArea
                    rows={4}
                    placeholder="Viết nội dung bài đăng tại đây..."
                    style={{ borderRadius: 10, borderColor: '#d1d5db', resize: 'none' }}
                  />
                </Form.Item>

                <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', paddingTop: 4, borderTop: '1px solid #f3f4f6' }}>
                  <Button size="large"
                    icon={<SaveOutlined />}
                    style={{ borderRadius: 10, height: 44, padding: '0 20px', fontWeight: 600, color: '#374151', borderColor: '#d1d5db' }}
                  >
                    Lưu nháp
                  </Button>
                  <Button type="primary" htmlType="submit" size="large"
                    icon={<EditOutlined />}
                    style={{ backgroundColor: '#059669', borderColor: '#059669', borderRadius: 10, height: 44, padding: '0 24px', fontWeight: 700, boxShadow: '0 4px 12px rgba(5,150,105,0.3)' }}
                  >
                    Đăng bài
                  </Button>
                </div>
              </Form>
            </div>
          </Card>

          <Card bordered={false} style={{ marginTop: 24, backgroundColor: '#059669', borderRadius: 12 }} bodyStyle={{ padding: 24 }}>
            <div style={{ color: 'white', fontSize: 18, fontWeight: 700, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 8 }}>
              <MessageFilled style={{ opacity: 0.8 }} /> Sức khỏe Diễn đàn
            </div>
            <Row gutter={16}>
              <Col span={12}>
                <div style={{ backgroundColor: 'rgba(255,255,255,0.1)', padding: 16, borderRadius: 8 }}>
                  <div style={{ color: '#a7f3d0', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>Chủ đề mới</div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                    <span style={{ color: 'white', fontSize: 28, fontWeight: 800 }}>+12</span>
                    <span style={{ color: '#a7f3d0', fontSize: 12 }}>Hôm nay</span>
                  </div>
                </div>
              </Col>
              <Col span={12}>
                <div style={{ backgroundColor: 'rgba(255,255,255,0.1)', padding: 16, borderRadius: 8 }}>
                  <div style={{ color: '#a7f3d0', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>Bình luận</div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                    <span style={{ color: 'white', fontSize: 28, fontWeight: 800 }}>84</span>
                    <span style={{ color: '#a7f3d0', fontSize: 12 }}>Chờ duyệt</span>
                  </div>
                </div>
              </Col>
            </Row>
          </Card>

          <div style={{ marginTop: 24, padding: 20, backgroundColor: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 12 }}>
            <div style={{ fontWeight: 700, color: '#1f2937', marginBottom: 8, fontSize: 14 }}>Hướng dẫn Cộng đồng</div>
            <div style={{ color: '#4b5563', fontSize: 13, lineHeight: 1.5, marginBottom: 12 }}>
              Mọi bài đăng đều hiển thị công khai. Hãy đảm bảo nội dung tuân thủ các chính sách an toàn của TurfMaster.
            </div>
            <a href="#" style={{ color: '#00a67d', fontWeight: 600, fontSize: 13 }}>Xem Sổ tay ↗</a>
          </div>
        </Col>
      </Row>
    </PageContainer>
  );
};

export default AdminForum;
