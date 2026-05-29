import React from 'react';
import { Modal, Form, Row, Col, TimePicker, Input, InputNumber, Button } from 'antd';
import { ClockCircleOutlined, TagsOutlined, DollarOutlined, PlusOutlined } from '@ant-design/icons';
import type { Dayjs } from 'dayjs';

interface AddPriceRuleModalProps {
  isOpen: boolean;
  onCancel: () => void;
  onFinish: (values: { startTime: Dayjs; endTime: Dayjs; price: number; type: string }) => void;
  form: any;
}

export const AddPriceRuleModal: React.FC<AddPriceRuleModalProps> = ({
  isOpen, onCancel, onFinish, form,
}) => {
  return (
    <Modal
      open={isOpen}
      onCancel={onCancel}
      footer={null}
      width={640}
      style={{ top: 80 }}
      styles={{ body: { padding: 0 } }}
      closeIcon={<span style={{ fontSize: 18, color: '#9ca3af' }}>✕</span>}
    >
      <div style={{ display: 'flex', borderRadius: 12, overflow: 'hidden', minHeight: 400 }}>
        {/* Panel trái xanh */}
        <div style={{
          width: 185, minWidth: 185,
          background: 'linear-gradient(160deg, #059669 0%, #047857 100%)',
          padding: '36px 20px',
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        }}>
          <div>
            <div style={{
              width: 48, height: 48, borderRadius: 12,
              backgroundColor: 'rgba(255,255,255,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20,
            }}>
              <ClockCircleOutlined style={{ fontSize: 24, color: '#fff' }} />
            </div>
            <div style={{ color: '#fff', fontSize: 17, fontWeight: 800, lineHeight: 1.3, marginBottom: 12 }}>Thêm Khung Giờ</div>
            <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: 13, lineHeight: 1.6 }}>
              Thiết lập khung giờ và mức giá phù hợp để tối ưu doanh thu sân bóng.
            </div>
          </div>
          <div style={{ padding: '12px 14px', backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: 10, border: '1px solid rgba(255,255,255,0.15)' }}>
            <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11, marginBottom: 4 }}>💡 Mẹo</div>
            <div style={{ color: '#fff', fontSize: 12, lineHeight: 1.5 }}>Giờ 18–20h có mật độ đặt cao nhất.</div>
          </div>
        </div>

        {/* Panel phải */}
        <div style={{ flex: 1, backgroundColor: '#fff', padding: '32px 28px' }}>
          <Form form={form} layout="vertical" onFinish={onFinish}>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="startTime"
                  label={<span style={{ fontWeight: 600, color: '#374151', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}><ClockCircleOutlined style={{ color: '#059669' }} /> Giờ bắt đầu</span>}
                  rules={[{ required: true, message: 'Chọn giờ' }]}
                >
                  <TimePicker format="HH:mm" size="large" style={{ width: '100%', borderRadius: 10, borderColor: '#d1d5db' }} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="endTime"
                  label={<span style={{ fontWeight: 600, color: '#374151', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}><ClockCircleOutlined style={{ color: '#059669' }} /> Giờ kết thúc</span>}
                  rules={[{ required: true, message: 'Chọn giờ' }]}
                >
                  <TimePicker format="HH:mm" size="large" style={{ width: '100%', borderRadius: 10, borderColor: '#d1d5db' }} />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="type"
              label={<span style={{ fontWeight: 600, color: '#374151', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}><TagsOutlined style={{ color: '#059669' }} /> Tên khung giờ</span>}
              rules={[{ required: true }]}
              initialValue="Giờ thường"
            >
              <Input placeholder="Ví dụ: Giờ vàng buổi tối" size="large" style={{ borderRadius: 10, borderColor: '#d1d5db' }} />
            </Form.Item>

            <Form.Item
              name="price"
              label={<span style={{ fontWeight: 600, color: '#374151', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}><DollarOutlined style={{ color: '#059669' }} /> Đơn giá (VNĐ/h)</span>}
              rules={[{ required: true, message: 'Nhập đơn giá' }]}
            >
              <InputNumber
                style={{ width: '100%', borderRadius: 10 }}
                size="large"
                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={(value) => value!.replace(/\$\s?|(,*)/g, '') as unknown as 0}
                min={0}
                step={10000}
                placeholder="350,000"
              />
            </Form.Item>

            <div style={{ paddingTop: 16, borderTop: '1px solid #f3f4f6', display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
              <Button size="large" onClick={onCancel}
                style={{ borderRadius: 10, height: 44, padding: '0 24px', fontWeight: 600, color: '#374151', borderColor: '#d1d5db' }}
              >
                Hủy
              </Button>
              <Button type="primary" htmlType="submit" size="large"
                icon={<PlusOutlined />}
                style={{ backgroundColor: '#059669', borderColor: '#059669', borderRadius: 10, height: 44, padding: '0 28px', fontWeight: 700, boxShadow: '0 4px 12px rgba(5,150,105,0.3)' }}
              >
                Thêm Khung Giờ
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </Modal>
  );
};
