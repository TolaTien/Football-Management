import React, { useState } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { Row, Col, Card, Typography, Button, Space, Tag, Modal, Form, Input, Select, message } from 'antd';
import {
  CheckCircleOutlined, ToolOutlined, PlusOutlined, EditOutlined, DeleteOutlined
} from '@ant-design/icons';
import { useModel } from '@umijs/max';

const { Title, Text } = Typography;

const AdminPitchesList: React.FC = () => {
  const { pitches } = useModel('adminPitches');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const handleAddPitch = (values: any) => {
    // add pitch logic should go to model, for demo just show message
    message.success('Đã thêm sân mới thành công!');
    setIsModalOpen(false);
    form.resetFields();
  };

  const activePitches = pitches.filter(p => p.status === 'active').length;
  const maintenancePitches = pitches.filter(p => p.status === 'maintenance').length;
  // Calculate average grass health
  const totalHealth = pitches.reduce((sum, p) => sum + (p.grassHealth || 0), 0);
  const avgHealth = Math.round(totalHealth / (pitches.length || 1));

  return (
    <PageContainer
      header={{
        title: <Title level={2} style={{ margin: 0, fontWeight: 700 }}>Quản lý hệ thống sân</Title>,
        subTitle: <Text style={{ color: '#6b7280' }}>Theo dõi tình trạng, lịch bảo trì và quản lý danh sách sân cỏ của bạn.</Text>,
        extra: [
          <Button key="add" type="primary" icon={<PlusOutlined />} style={{ backgroundColor: '#00a67d', borderRadius: 8, fontWeight: 600 }} onClick={() => setIsModalOpen(true)}>
            Thêm sân mới
          </Button>
        ]
      }}
    >
      {/* Top Stats */}
      <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={8}>
          <Card bordered={false} bodyStyle={{ padding: '20px 24px', borderRadius: 12, border: '1px solid #e5e7eb', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 56, height: 56, borderRadius: 12, backgroundColor: '#d1fae5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>
                <CheckCircleOutlined />
              </div>
              <div>
                <div style={{ color: '#6b7280', fontSize: 13, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>Sẵn sàng</div>
                <div style={{ fontSize: 28, fontWeight: 800, color: '#1f2937' }}>{activePitches} Sân</div>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card bordered={false} bodyStyle={{ padding: '20px 24px', borderRadius: 12, border: '1px solid #e5e7eb', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 56, height: 56, borderRadius: 12, backgroundColor: '#fee2e2', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>
                <ToolOutlined />
              </div>
              <div>
                <div style={{ color: '#6b7280', fontSize: 13, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>Đang bảo trì</div>
                <div style={{ fontSize: 28, fontWeight: 800, color: '#dc2626' }}>{maintenancePitches} Sân</div>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card bordered={false} bodyStyle={{ padding: '20px 24px', borderRadius: 12, border: '1px solid #e5e7eb', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 56, height: 56, borderRadius: 12, backgroundColor: '#e0e7ff', color: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>
                🌱
              </div>
              <div>
                <div style={{ color: '#6b7280', fontSize: 13, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>Sức khỏe mặt cỏ</div>
                <div style={{ fontSize: 28, fontWeight: 800, color: '#059669' }}>Tốt ({avgHealth}%)</div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Grid Danh sách sân */}
      <Row gutter={[24, 24]}>
        {pitches.map(p => (
          <Col xs={24} sm={12} lg={8} xl={6} key={p.id}>
            <Card 
              hoverable
              bordered={false} 
              bodyStyle={{ padding: 0 }}
              style={{ borderRadius: 16, overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)' }}
            >
              <div style={{ position: 'relative', height: 160 }}>
                <img src={p.imageUrl} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', top: 12, left: 12 }}>
                  <Tag color={p.status === 'active' ? '#10b981' : p.status === 'maintenance' ? '#6b7280' : '#f59e0b'} style={{ borderRadius: 12, padding: '2px 10px', fontWeight: 600, border: 'none' }}>
                    {p.status === 'active' ? 'Sẵn sàng' : p.status === 'maintenance' ? '🛠 Đang bảo trì' : '🚧 Đang thi công'}
                  </Tag>
                </div>
              </div>
              <div style={{ padding: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                  <div style={{ fontSize: 18, fontWeight: 800, color: '#1f2937' }}>{p.name}</div>
                  <Space style={{ color: '#9ca3af' }}>
                    <EditOutlined style={{ cursor: 'pointer' }} />
                    <DeleteOutlined style={{ cursor: 'pointer', color: '#dc2626' }} />
                  </Space>
                </div>
                <div style={{ color: '#6b7280', fontSize: 13, marginBottom: 16 }}>{p.desc}</div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 12, borderBottom: '1px dashed #e5e7eb', marginBottom: 12 }}>
                  <div style={{ color: '#6b7280', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
                    🌱 Tình trạng mặt cỏ:
                  </div>
                  <div style={{ fontWeight: 600, color: p.grassHealth > 80 ? '#059669' : p.grassHealth > 40 ? '#d97706' : '#9ca3af' }}>
                    {p.grassStatus}
                  </div>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div style={{ color: '#6b7280', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
                    📅 {p.status === 'constructing' ? 'Ngày hoàn tất:' : 'Lịch bảo trì:'}
                  </div>
                  <div style={{ fontWeight: 600, color: p.status === 'maintenance' ? '#dc2626' : '#1f2937' }}>
                    {p.nextMaintenance}
                  </div>
                </div>
              </div>
            </Card>
          </Col>
        ))}

        {/* Card Thêm sân mới */}
        <Col xs={24} sm={12} lg={8} xl={6}>
          <div 
            onClick={() => setIsModalOpen(true)}
            style={{ 
              height: '100%', minHeight: 320, borderRadius: 16, border: '2px dashed #cbd5e1', 
              backgroundColor: '#f8fafc', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', transition: 'all 0.2s', padding: 24
            }}
            onMouseOver={(e) => e.currentTarget.style.borderColor = '#00a67d'}
            onMouseOut={(e) => e.currentTarget.style.borderColor = '#cbd5e1'}
          >
            <div style={{ width: 48, height: 48, borderRadius: '50%', backgroundColor: '#e2e8f0', color: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, marginBottom: 16 }}>
              <PlusOutlined />
            </div>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#1f2937', marginBottom: 8 }}>Thêm sân mới</div>
            <div style={{ color: '#6b7280', fontSize: 13, textAlign: 'center' }}>Mở rộng hệ thống kinh doanh</div>
          </div>
        </Col>
      </Row>

      {/* Bảng Chi tiết bảo trì */}
      <Card bordered={false} bodyStyle={{ padding: 0 }} style={{ marginTop: 24, borderRadius: 12, overflow: 'hidden', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
        <div style={{ padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f3f4f6' }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#1f2937' }}>Chi tiết bảo trì tiếp theo</div>
          <a style={{ color: '#00a67d', fontWeight: 600, fontSize: 14 }}>Xem tất cả lịch →</a>
        </div>
        
        <div style={{ padding: 24 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1.5fr 1.5fr 1fr', paddingBottom: 16, borderBottom: '1px solid #f3f4f6', color: '#6b7280', fontWeight: 600, fontSize: 13 }}>
            <div>Tên sân</div>
            <div>Hoạt động</div>
            <div>Ngày thực hiện</div>
            <div>Nhân viên phụ trách</div>
            <div style={{ textAlign: 'right' }}>Trạng thái</div>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1.5fr 1.5fr 1fr', padding: '16px 0', borderBottom: '1px solid #f3f4f6', alignItems: 'center' }}>
            <div style={{ fontWeight: 600, color: '#1f2937' }}>Sân 5 - A1</div>
            <div style={{ color: '#4b5563', fontSize: 14 }}>Cắt tỉa & Bón phân định kỳ</div>
            <div style={{ color: '#4b5563', fontSize: 14 }}>15/10/2023 (Sáng)</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 24, height: 24, borderRadius: '50%', backgroundColor: '#34d399' }} />
              <span style={{ fontSize: 13, color: '#1f2937' }}>Nguyễn Văn An</span>
            </div>
            <div style={{ textAlign: 'right' }}><Tag color="blue" style={{ borderRadius: 12, border: 'none', backgroundColor: '#e0e7ff', color: '#4f46e5', fontWeight: 600 }}>ĐÃ LÊN LỊCH</Tag></div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1.5fr 1.5fr 1fr', padding: '16px 0', borderBottom: '1px solid #f3f4f6', alignItems: 'center' }}>
            <div style={{ fontWeight: 600, color: '#1f2937' }}>Sân 7 - B2</div>
            <div style={{ color: '#4b5563', fontSize: 14 }}>Kiểm tra hệ thống thoát nước</div>
            <div style={{ color: '#4b5563', fontSize: 14 }}>18/10/2023 (Chiều)</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 24, height: 24, borderRadius: '50%', backgroundColor: '#94a3b8' }} />
              <span style={{ fontSize: 13, color: '#1f2937' }}>Trần Thị Bình</span>
            </div>
            <div style={{ textAlign: 'right' }}><Tag color="blue" style={{ borderRadius: 12, border: 'none', backgroundColor: '#e0e7ff', color: '#4f46e5', fontWeight: 600 }}>ĐÃ LÊN LỊCH</Tag></div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1.5fr 1.5fr 1fr', padding: '16px 0', alignItems: 'center' }}>
            <div style={{ fontWeight: 600, color: '#1f2937' }}>Sân 5 - C1</div>
            <div style={{ color: '#4b5563', fontSize: 14 }}>Thay thế mảng cỏ hư hại</div>
            <div style={{ color: '#4b5563', fontSize: 14 }}>Đang thực hiện</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 24, height: 24, borderRadius: '50%', backgroundColor: '#fca5a5' }} />
              <span style={{ fontSize: 13, color: '#1f2937' }}>Lê Minh Cường</span>
            </div>
            <div style={{ textAlign: 'right' }}><Tag color="red" style={{ borderRadius: 12, border: 'none', backgroundColor: '#fee2e2', color: '#dc2626', fontWeight: 600 }}>ĐANG XỬ LÝ</Tag></div>
          </div>
        </div>
      </Card>

      {/* Modal Thêm Sân */}
      <Modal 
        title="Thêm Sân Mới" 
        open={isModalOpen} 
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleAddPitch}>
          <Form.Item name="name" label="Tên sân" rules={[{ required: true }]}>
            <Input placeholder="Ví dụ: Sân 5 - D1" />
          </Form.Item>
          <Form.Item name="type" label="Loại sân" rules={[{ required: true }]}>
            <Select options={[{ value: '5', label: 'Sân 5 người' }, { value: '7', label: 'Sân 7 người' }, { value: '11', label: 'Sân 11 người' }]} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ backgroundColor: '#00a67d', width: '100%' }}>Thêm Sân</Button>
          </Form.Item>
        </Form>
      </Modal>

    </PageContainer>
  );
};

export default AdminPitchesList;
