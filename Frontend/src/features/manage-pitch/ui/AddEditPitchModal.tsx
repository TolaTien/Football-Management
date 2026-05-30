import React from 'react';
import { Modal, Form, Row, Col, Input, Select, Button } from 'antd';
import { EnvironmentOutlined, AppstoreOutlined, FileTextOutlined, PlusOutlined } from '@ant-design/icons';
import type { Pitch } from '@/entities/pitch/model/types';

interface AddEditPitchModalProps {
  isOpen: boolean;
  onCancel: () => void;
  onFinish: (values: { name: string; type: string; desc?: string; price?: number; status: 'active' | 'maintenance' }) => void;
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
      className="top-20"
      bodyStyle={{ padding: 0 }}
      closeIcon={<span className="text-lg text-slate-400 hover:text-slate-600 transition-colors">✕</span>}
    >
      <div className="flex rounded-2xl overflow-hidden min-h-[420px]">
        {/* Left Panel */}
        <div className="w-[190px] min-w-[190px] bg-gradient-to-b from-emerald-600 to-emerald-800 p-9 flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center mb-5">
              <EnvironmentOutlined className="text-2xl text-white" />
            </div>
            <div className="text-white text-lg font-extrabold leading-snug mb-3">
              {editingPitch ? 'Cập nhật Sân bóng' : 'Thêm Sân mới'}
            </div>
            <div className="text-white/80 text-xs leading-relaxed">
              Đảm bảo thông tin sân chính xác giúp tối ưu hóa quy trình đặt lịch và tăng trải nghiệm khách hàng.
            </div>
          </div>
          <div className="p-3 bg-white/10 rounded-xl border border-white/20">
            <div className="text-white/70 text-[10px] mb-1 font-bold">ℹ️ Lưu ý</div>
            <div className="text-white text-xs leading-normal">Giá thay đổi theo giờ cao điểm.</div>
          </div>
        </div>

        {/* Right Panel - Form */}
        <div className="flex-1 bg-white p-8">
          <Form form={form} layout="vertical" onFinish={onFinish}>
            <Form.Item
              name="name"
              label={
                <span className="font-semibold text-slate-700 text-xs flex items-center gap-1.5">
                  <EnvironmentOutlined className="text-emerald-600" /> Tên sân bóng
                </span>
              }
              rules={[{ required: true, message: 'Vui lòng nhập tên sân' }]}
            >
              <Input placeholder="Sân Emerald A1" size="large" className="rounded-xl border-slate-300 focus:border-emerald-500" />
            </Form.Item>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="type"
                  label={
                    <span className="font-semibold text-slate-700 text-xs flex items-center gap-1.5">
                      <AppstoreOutlined className="text-emerald-600" /> Loại sân
                    </span>
                  }
                  rules={[{ required: true, message: 'Chọn loại sân' }]}
                >
                  <Select size="large" className="rounded-xl w-full"
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
                  name="status"
                  label={
                    <span className="font-semibold text-slate-700 text-xs flex items-center gap-1.5">
                      ⚙️ Trạng thái hoạt động
                    </span>
                  }
                  rules={[{ required: true, message: 'Chọn trạng thái sân' }]}
                >
                  <Select size="large" className="rounded-xl w-full"
                    options={[
                      { value: 'active', label: 'Sẵn sàng' },
                      { value: 'maintenance', label: 'Bảo trì' },
                    ]}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="price"
              label={
                <span className="font-semibold text-slate-700 text-xs flex items-center gap-1.5">
                  💰 Đơn giá mỗi giờ (VNĐ)
                </span>
              }
            >
              <Input placeholder="500000" size="large" className="rounded-xl border-slate-300 focus:border-emerald-500" />
            </Form.Item>

            <Form.Item
              name="desc"
              label={
                <span className="font-semibold text-slate-700 text-xs flex items-center gap-1.5">
                  <FileTextOutlined className="text-emerald-600" /> Mô tả ngắn
                </span>
              }
            >
              <Input.TextArea rows={2} placeholder="Sân cỏ nhân tạo cao cấp, đầy đủ tiện nghi..." className="rounded-xl border-slate-300 focus:border-emerald-500" />
            </Form.Item>

            <div className="mt-2 pt-5 border-t border-slate-100 flex justify-end gap-3">
              <Button size="large" onClick={onCancel}
                className="rounded-xl h-11 px-6 font-semibold text-slate-600 border-slate-300 hover:text-emerald-600 hover:border-emerald-500"
              >
                Hủy
              </Button>
              <Button type="primary" htmlType="submit" size="large"
                icon={<PlusOutlined />}
                className="bg-emerald-600 border-emerald-600 hover:bg-emerald-700 hover:border-emerald-700 rounded-xl h-11 px-7 font-bold shadow-md shadow-emerald-600/20"
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
