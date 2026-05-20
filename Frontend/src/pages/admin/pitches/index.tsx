import React, { useState } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { Row, Col, Card, Typography, Button, Space, Tag, Modal, Form, Input, Select, message, Upload, Popconfirm } from 'antd';
import {
  CheckCircleOutlined, ToolOutlined, PlusOutlined, EditOutlined, DeleteOutlined,
  EnvironmentOutlined, AppstoreOutlined, FileTextOutlined, CameraOutlined,
} from '@ant-design/icons';
import { useModel } from '@umijs/max';
import type { Pitch } from '@/models/adminPitches';

const { Title, Text } = Typography;

const AdminPitchesList: React.FC = () => {
  const { pitches, addPitch, updatePitch, deletePitch } = useModel('adminPitches');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPitch, setEditingPitch] = useState<Pitch | null>(null);
  const [form] = Form.useForm();

  // Mở modal thêm mới
  const handleOpenAdd = () => {
    setEditingPitch(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  // Mở modal sửa
  const handleOpenEdit = (pitch: Pitch) => {
    setEditingPitch(pitch);
    form.setFieldsValue({
      name: pitch.name,
      type: pitch.type.includes('5') ? '5' : pitch.type.includes('7') ? '7' : '11',
      desc: pitch.desc,
      price: 500000, // Mock price for now since it's not directly on Pitch
    });
    setIsModalOpen(true);
  };

  // Xử lý submit form (cả thêm và sửa)
  const handleFormSubmit = (values: any) => {
    const pitchData = {
      name: values.name,
      type: `Sân ${values.type} người`,
      desc: values.desc || '',
      // Mặc định cho sân mới
      status: editingPitch ? editingPitch.status : 'active',
      grassHealth: editingPitch ? editingPitch.grassHealth : 100,
      grassStatus: editingPitch ? editingPitch.grassStatus : 'Tốt',
      nextMaintenance: editingPitch ? editingPitch.nextMaintenance : 'Chưa xếp lịch',
      imageUrl: editingPitch ? editingPitch.imageUrl : 'https://images.unsplash.com/photo-1518605368461-1ee7c5320c2d?q=80&w=600&auto=format&fit=crop',
    } as Omit<Pitch, 'id'>;

    if (editingPitch) {
      updatePitch(editingPitch.id, pitchData);
      message.success('Đã cập nhật thông tin sân!');
    } else {
      addPitch(pitchData);
      message.success('Đã thêm sân mới thành công!');
    }

    setIsModalOpen(false);
    form.resetFields();
    setEditingPitch(null);
  };

  const handleDelete = (id: string) => {
    deletePitch(id);
    message.success('Đã xóa sân!');
  };

  const activePitches = pitches.filter(p => p.status === 'active').length;
  const maintenancePitches = pitches.filter(p => p.status === 'maintenance').length;
  const totalHealth = pitches.reduce((sum, p) => sum + (p.grassHealth || 0), 0);
  const avgHealth = pitches.length ? Math.round(totalHealth / pitches.length) : 0;

  return (
    <PageContainer
      header={{
        title: (
          <div>
            <div style={{ fontWeight: 800, fontSize: 22, color: '#0f172a' }}>Quản lý hệ thống sân</div>
            <Text style={{ color: '#94a3b8', fontSize: 13 }}>Theo dõi tình trạng, lịch bảo trì và danh sách sân cỏ của bạn</Text>
          </div>
        ),
        extra: [
          <Button key="add" type="primary" icon={<PlusOutlined />} style={{ height: 40, padding: '0 20px', fontWeight: 700 }} onClick={handleOpenAdd}>
            Thêm sân mới
          </Button>
        ]
      }}
    >
      {/* Top Stats */}
      <Row gutter={[20, 20]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={8}>
          <div style={{ background: 'linear-gradient(135deg, #059669 0%, #047857 100%)', borderRadius: 16, padding: '22px 24px', color: 'white', boxShadow: '0 4px 20px rgba(5,150,105,0.25)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', right: -16, bottom: -16, width: 90, height: 90, borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.08)' }} />
            <div style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, marginBottom: 16 }}>
              <CheckCircleOutlined style={{ color: '#fff' }} />
            </div>
            <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Sẵn sàng hoạt động</div>
            <div style={{ fontSize: 32, fontWeight: 800, color: '#fff' }}>{activePitches} <span style={{ fontSize: 16, fontWeight: 500, opacity: 0.8 }}>sân</span></div>
          </div>
        </Col>
        <Col xs={24} lg={8}>
          <div style={{ background: 'white', borderRadius: 16, padding: '22px 24px', border: '1px solid #e2e8f0', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', right: -16, bottom: -16, width: 90, height: 90, borderRadius: '50%', backgroundColor: '#fee2e208' }} />
            <div style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: '#fee2e2', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, marginBottom: 16 }}>
              <ToolOutlined />
            </div>
            <div style={{ color: '#64748b', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Đang bảo trì</div>
            <div style={{ fontSize: 32, fontWeight: 800, color: '#dc2626' }}>{maintenancePitches} <span style={{ fontSize: 16, fontWeight: 500, color: '#94a3b8' }}>sân</span></div>
          </div>
        </Col>
        <Col xs={24} lg={8}>
          <div style={{ background: 'white', borderRadius: 16, padding: '22px 24px', border: '1px solid #e2e8f0', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', right: -16, bottom: -16, width: 90, height: 90, borderRadius: '50%', backgroundColor: '#e0e7ff18' }} />
            <div style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: '#e0e7ff', color: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, marginBottom: 16 }}>
              🌱
            </div>
            <div style={{ color: '#64748b', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Sức khỏe mặt cỏ</div>
            <div style={{ fontSize: 32, fontWeight: 800, color: '#059669' }}>{avgHealth > 80 ? 'Tốt' : avgHealth > 40 ? 'Trung bình' : 'Kém'} <span style={{ fontSize: 16, fontWeight: 700, color: '#059669' }}>({avgHealth}%)</span></div>
          </div>
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
              style={{ borderRadius: 16, overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column', height: '100%' }}
            >
              <div style={{ position: 'relative', height: 160 }}>
                <img src={p.imageUrl} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', top: 12, left: 12 }}>
                  <Tag color={p.status === 'active' ? '#10b981' : p.status === 'maintenance' ? '#6b7280' : '#f59e0b'} style={{ borderRadius: 12, padding: '2px 10px', fontWeight: 600, border: 'none' }}>
                    {p.status === 'active' ? 'Sẵn sàng' : p.status === 'maintenance' ? '🛠 Đang bảo trì' : '🚧 Đang thi công'}
                  </Tag>
                </div>
              </div>
              <div style={{ padding: 20, display: 'flex', flexDirection: 'column', flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                  <div style={{ fontSize: 18, fontWeight: 800, color: '#1f2937' }}>{p.name}</div>
                  <Space style={{ color: '#9ca3af' }}>
                    <EditOutlined style={{ cursor: 'pointer' }} onClick={() => handleOpenEdit(p)} />
                    <Popconfirm title="Bạn có chắc chắn muốn xóa sân này?" onConfirm={() => handleDelete(p.id)} okText="Xóa" cancelText="Hủy">
                      <DeleteOutlined style={{ cursor: 'pointer', color: '#dc2626' }} />
                    </Popconfirm>
                  </Space>
                </div>
                <div style={{ color: '#6b7280', fontSize: 13, marginBottom: 16, flex: 1 }}>{p.desc}</div>

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
            onClick={handleOpenAdd}
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

      {/* Bảng Chi tiết bảo trì (Giữ nguyên phần UI giao diện) */}
      <Card bordered={false} bodyStyle={{ padding: 0 }} style={{ marginTop: 24, borderRadius: 12, overflow: 'hidden', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
        <div style={{ padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f3f4f6' }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#1f2937' }}>Chi tiết bảo trì tiếp theo</div>
          <a style={{ color: '#00a67d', fontWeight: 600, fontSize: 14 }}>Xem tất cả lịch →</a>
        </div>

        <div style={{ padding: 24 }}>
          {/* Mock Data cho Lịch bảo trì */}
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
        </div>
      </Card>

      {/* ── Modal Thêm/Sửa Sân – 2 panel premium ── */}
      <Modal
        open={isModalOpen}
        onCancel={() => { setIsModalOpen(false); form.resetFields(); setEditingPitch(null); }}
        footer={null}
        width={660}
        style={{ top: 80 }}
        styles={{ body: { padding: 0 } }}
        closeIcon={<span style={{ fontSize: 18, color: '#9ca3af' }}>✕</span>}
      >
        <div style={{ display: 'flex', borderRadius: 12, overflow: 'hidden', minHeight: 420 }}>
          {/* Panel trái */}
          <div style={{
            width: 190, minWidth: 190,
            background: 'linear-gradient(160deg, #059669 0%, #047857 100%)',
            padding: '36px 22px',
            display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
          }}>
            <div>
              <div style={{
                width: 48, height: 48, borderRadius: 12,
                backgroundColor: 'rgba(255,255,255,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20,
              }}>
                <EnvironmentOutlined style={{ fontSize: 24, color: '#fff' }} />
              </div>
              <div style={{ color: '#fff', fontSize: 17, fontWeight: 800, lineHeight: 1.3, marginBottom: 12 }}>
                {editingPitch ? 'Cập nhật Sân bóng' : 'Thêm Sân mới'}
              </div>
              <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: 13, lineHeight: 1.6 }}>
                Đảm bảo thông tin sân chính xác giúp tối ưu hóa quy trình đặt lịch và tăng trải nghiệm khách hàng.
              </div>
            </div>
            <div style={{ padding: '12px 14px', backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: 10, border: '1px solid rgba(255,255,255,0.15)' }}>
              <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11, marginBottom: 4 }}>ℹ️ Lưu ý</div>
              <div style={{ color: '#fff', fontSize: 12, lineHeight: 1.5 }}>Giá thay đổi theo giờ cao điểm.</div>
            </div>
          </div>

          {/* Panel phải – form */}
          <div style={{ flex: 1, backgroundColor: '#fff', padding: '32px 28px' }}>
            <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
              <Form.Item
                name="name"
                label={
                  <span style={{ fontWeight: 600, color: '#374151', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <EnvironmentOutlined style={{ color: '#059669' }} /> Tên sân bóng
                  </span>
                }
                rules={[{ required: true, message: 'Vui lòng nhập tên sân' }]}
              >
                <Input placeholder="Sân Emerald A1" size="large" style={{ borderRadius: 10, borderColor: '#d1d5db' }} />
              </Form.Item>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="type"
                    label={
                      <span style={{ fontWeight: 600, color: '#374151', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <AppstoreOutlined style={{ color: '#059669' }} /> Loại sân
                      </span>
                    }
                    rules={[{ required: true, message: 'Chọn loại sân' }]}
                  >
                    <Select size="large" style={{ borderRadius: 10 }}
                      options={[
                        { value: '5', label: 'Sân 5 người' },
                        { value: '7', label: 'Sân 7 người' },
                        { value: '11', label: 'Sân 11 người' },
                      ]}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="price"
                    label={
                      <span style={{ fontWeight: 600, color: '#374151', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
                        💰 Đơn giá mỗi giờ (VNĐ)
                      </span>
                    }
                  >
                    <Input placeholder="500000" size="large" style={{ borderRadius: 10, borderColor: '#d1d5db' }} />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                name="desc"
                label={
                  <span style={{ fontWeight: 600, color: '#374151', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <FileTextOutlined style={{ color: '#059669' }} /> Mô tả ngắn
                  </span>
                }
              >
                <Input.TextArea rows={2} placeholder="Sân cỏ nhân tạo cao cấp, đầy đủ tiện nghi..." style={{ borderRadius: 10, borderColor: '#d1d5db' }} />
              </Form.Item>

              <Form.Item
                name="image"
                label={
                  <span style={{ fontWeight: 600, color: '#374151', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <CameraOutlined style={{ color: '#059669' }} /> Ảnh sân (tuỳ chọn)
                  </span>
                }
              >
                <Upload.Dragger
                  name="file" multiple={false} beforeUpload={() => false}
                  style={{ borderRadius: 10 }}
                >
                  <p style={{ color: '#059669', fontSize: 22, marginBottom: 4 }}><CameraOutlined /></p>
                  <p style={{ color: '#374151', fontWeight: 600, fontSize: 13 }}>Kéo & thả ảnh sân vào đây</p>
                  <p style={{ color: '#94a3b8', fontSize: 11 }}>PNG, JPG tối đa 5MB</p>
                </Upload.Dragger>
              </Form.Item>

              <div style={{ marginTop: 8, paddingTop: 20, borderTop: '1px solid #f3f4f6', display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
                <Button size="large" onClick={() => { setIsModalOpen(false); form.resetFields(); setEditingPitch(null); }}
                  style={{ borderRadius: 10, height: 44, padding: '0 24px', fontWeight: 600, color: '#374151', borderColor: '#d1d5db' }}
                >
                  Hủy
                </Button>
                <Button type="primary" htmlType="submit" size="large"
                  icon={<PlusOutlined />}
                  style={{ backgroundColor: '#059669', borderColor: '#059669', borderRadius: 10, height: 44, padding: '0 28px', fontWeight: 700, boxShadow: '0 4px 12px rgba(5,150,105,0.3)' }}
                >
                  {editingPitch ? 'Cập nhật' : 'Thêm sân'}
                </Button>
              </div>
            </Form>
          </div>
        </div>
      </Modal>

    </PageContainer>
  );
};

export default AdminPitchesList;
