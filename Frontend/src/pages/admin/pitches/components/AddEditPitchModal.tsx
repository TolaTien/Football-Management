import React from 'react';
import { Modal, Form, Row, Col, Input, Select, Upload, Button } from 'antd';
import { EnvironmentOutlined, AppstoreOutlined, FileTextOutlined, CameraOutlined, PlusOutlined } from '@ant-design/icons';
import type { Pitch } from '@/entities/pitch/model/types';

interface AddEditPitchModalProps {
  isOpen: boolean;
  onCancel: () => void;
  onFinish: (values: { name: string; type: string; desc?: string; price?: number }) => void;
  form: any;
  editingPitch: Pitch | null;
}

export const AddEditPitchModal: React.FC<AddEditPitchModalProps> = ({
  isOpen, onCancel, onFinish, form, editingPitch,
}) => {
  return (
    <Modal
      open={isOpen}
      onCancel={onCancel}
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
          <Form form={form} layout="vertical" onFinish={onFinish}>
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
              <Button size="large" onClick={onCancel}
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
  );
};
