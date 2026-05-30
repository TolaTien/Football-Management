import React from 'react';
import { Modal, Form, Input, Select, InputNumber, Upload, Button } from 'antd';
import { ShopOutlined, TagsOutlined, AppstoreOutlined, DollarOutlined, InboxOutlined, CheckCircleOutlined } from '@ant-design/icons';
import type { ServiceType } from '@/entities/service-item/model/types';

const { Dragger } = Upload;

interface AddServiceModalProps {
  isOpen: boolean;
  onCancel: () => void;
  onFinish: (values: { name: string; type: ServiceType; price: number }) => void;
  form: any;
}

export const AddServiceModal: React.FC<AddServiceModalProps> = ({
  isOpen, onCancel, onFinish, form,
}) => {
  return (
    <Modal
      open={isOpen}
      onCancel={onCancel}
      footer={null}
      width={620}
      style={{ top: 80 }}
      styles={{ body: { padding: 0 } }}
      closeIcon={<span style={{ fontSize: 18, color: '#94a3b8' }}>✕</span>}
    >
      <div style={{ display: 'flex', borderRadius: 16, overflow: 'hidden', minHeight: 380 }}>
        {/* Panel trái */}
        <div style={{
          width: 180, minWidth: 180,
          background: 'linear-gradient(160deg, #059669 0%, #047857 100%)',
          padding: '36px 22px',
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        }}>
          <div>
            <div style={{
              width: 48, height: 48, borderRadius: 14,
              backgroundColor: 'rgba(255,255,255,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: 20,
            }}>
              <ShopOutlined style={{ fontSize: 24, color: '#fff' }} />
            </div>
            <div style={{ color: '#fff', fontSize: 17, fontWeight: 800, lineHeight: 1.3, marginBottom: 10 }}>
              Thêm sản phẩm mới
            </div>
            <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: 12.5, lineHeight: 1.6 }}>
              Bổ sung hàng hóa vào kho để phục vụ khách hàng tại sân.
            </div>
          </div>
          <div style={{
            padding: '12px 14px',
            backgroundColor: 'rgba(255,255,255,0.12)',
            borderRadius: 10, border: '1px solid rgba(255,255,255,0.15)',
          }}>
            <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11, marginBottom: 4 }}>💡 Mẹo</div>
            <div style={{ color: '#fff', fontSize: 11.5, lineHeight: 1.5 }}>
              Cập nhật tồn kho thường xuyên để tránh hết hàng đột ngột.
            </div>
          </div>
        </div>

        {/* Panel phải */}
        <div style={{ flex: 1, backgroundColor: '#fff', padding: '32px 28px' }}>
          <Form form={form} layout="vertical" onFinish={onFinish}>
            <Form.Item
              name="name"
              label={<span style={{ fontWeight: 600, color: '#374151', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}><TagsOutlined style={{ color: '#059669' }} /> Tên sản phẩm</span>}
              rules={[{ required: true, message: 'Nhập tên sản phẩm' }]}
            >
              <Input placeholder="Ví dụ: Nước suối Aquafina" size="large" style={{ borderRadius: 10 }} />
            </Form.Item>

            <Form.Item
              name="type"
              label={<span style={{ fontWeight: 600, color: '#374151', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}><AppstoreOutlined style={{ color: '#059669' }} /> Loại sản phẩm</span>}
              rules={[{ required: true, message: 'Chọn loại' }]}
              initialValue="drink"
            >
              <Select size="large" style={{ borderRadius: 10 }} options={[
                { value: 'drink', label: '🧃 Đồ uống' },
                { value: 'equipment', label: '⚽ Trang thiết bị' },
                { value: 'food', label: '🍔 Đồ ăn nhanh' },
                { value: 'other', label: '📦 Khác' },
              ]} />
            </Form.Item>

            <Form.Item
              name="price"
              label={<span style={{ fontWeight: 600, color: '#374151', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}><DollarOutlined style={{ color: '#059669' }} /> Đơn giá (VNĐ)</span>}
              rules={[{ required: true, message: 'Nhập đơn giá' }]}
            >
              <InputNumber
                style={{ width: '100%', borderRadius: 10 }}
                size="large"
                formatter={v => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={(v) => v!.replace(/,/g, '') as unknown as 0}
                min={0}
                step={1000}
                placeholder="15,000"
              />
            </Form.Item>

            {/* Upload ảnh */}
            <Form.Item
              name="image"
              label={<span style={{ fontWeight: 600, color: '#374151', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}><InboxOutlined style={{ color: '#059669' }} /> Hình ảnh (tuỳ chọn)</span>}
            >
              <Dragger
                name="file"
                multiple={false}
                beforeUpload={() => false}
                style={{ borderRadius: 10 }}
              >
                <p style={{ color: '#059669', fontSize: 24, marginBottom: 4 }}><InboxOutlined /></p>
                <p style={{ color: '#374151', fontWeight: 600, fontSize: 13 }}>Kéo & thả ảnh vào đây</p>
                <p style={{ color: '#94a3b8', fontSize: 11 }}>PNG, JPG tối đa 2MB</p>
              </Dragger>
            </Form.Item>

            <div style={{ paddingTop: 16, borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <Button
                size="large"
                onClick={onCancel}
                style={{ borderRadius: 10, height: 44, padding: '0 22px', fontWeight: 600 }}
              >
                Hủy
              </Button>
              <Button
                type="primary" htmlType="submit" size="large"
                icon={<CheckCircleOutlined />}
                style={{ borderRadius: 10, height: 44, padding: '0 26px', fontWeight: 700, boxShadow: '0 4px 12px rgba(5,150,105,0.3)' }}
              >
                Thêm sản phẩm
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </Modal>
  );
};
