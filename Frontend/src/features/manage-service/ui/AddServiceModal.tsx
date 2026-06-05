import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, InputNumber, Upload, Button } from 'antd';
import { ShopOutlined, TagsOutlined, AppstoreOutlined, DollarOutlined, InboxOutlined, CheckCircleOutlined, EditOutlined, CoffeeOutlined, SkinOutlined, SmileOutlined, EllipsisOutlined } from '@ant-design/icons';
import type { ServiceItem, ServiceType } from '@/entities/service-item';

const { Dragger } = Upload;

interface AddServiceModalProps {
  isOpen: boolean;
  onCancel: () => void;
  onFinish: (values: { name: string; type: ServiceType; price: number }) => void;
  form: any;
  editItem?: ServiceItem | null;
}

export const AddServiceModal: React.FC<AddServiceModalProps> = ({
  isOpen, onCancel, onFinish, form, editItem,
}) => {
  useEffect(() => {
    if (isOpen) {
      if (editItem) {
        form.setFieldsValue({
          name: editItem.name,
          type: editItem.type,
          price: editItem.price,
        });
      } else {
        form.resetFields();
      }
    }
  }, [isOpen, editItem, form]);

  return (
    <Modal
      open={isOpen}
      onCancel={onCancel}
      footer={null}
      width={620}
      className="top-20"
      bodyStyle={{ padding: 0 }}
      closeIcon={<span className="text-lg text-slate-450 hover:text-slate-650">✕</span>}
    >
      <div className="flex rounded-2xl overflow-hidden min-h-[380px]">
        {/* Left Panel */}
        <div className="w-[180px] bg-gradient-to-b from-emerald-600 to-emerald-800 p-8 flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center mb-5">
              {editItem ? (
                <EditOutlined className="text-2xl text-white" />
              ) : (
                <ShopOutlined className="text-2xl text-white" />
              )}
            </div>
            <div className="text-white text-lg font-extrabold leading-snug mb-3">
              {editItem ? 'Sửa sản phẩm' : 'Thêm sản phẩm mới'}
            </div>
            <div className="text-white/80 text-xs leading-relaxed">
              {editItem ? 'Cập nhật đơn giá và thông tin chi tiết của hàng hóa.' : 'Bổ sung hàng hóa vào kho để phục vụ khách hàng tại sân.'}
            </div>
          </div>
          <div className="p-3 bg-white/10 rounded-xl border border-white/20">
            <div className="text-white/70 text-[10px] mb-1 font-bold">💡 Mẹo</div>
            <div className="text-white text-xs leading-normal">
              Cập nhật tồn kho thường xuyên để tránh hết hàng đột ngột.
            </div>
          </div>
        </div>

        {/* Right Panel - Form */}
        <div className="flex-1 bg-white p-7">
          <Form form={form} layout="vertical" onFinish={onFinish}>
            <Form.Item
              name="name"
              label={<span className="font-semibold text-slate-700 text-xs flex items-center gap-1.5"><TagsOutlined className="text-emerald-600" /> Tên sản phẩm</span>}
              rules={[{ required: true, message: 'Nhập tên sản phẩm' }]}
            >
              <Input placeholder="Ví dụ: Nước suối Aquafina" size="large" className="rounded-xl border-slate-300 focus:border-emerald-500" />
            </Form.Item>

            <Form.Item
              name="type"
              label={<span className="font-semibold text-slate-700 text-xs flex items-center gap-1.5"><AppstoreOutlined className="text-emerald-600" /> Loại sản phẩm</span>}
              rules={[{ required: true, message: 'Chọn loại' }]}
              initialValue="equipment"
            >
              <Select size="large" className="rounded-xl" options={[
                {
                  value: 'equipment',
                  label: <span className="flex items-center gap-2"><SkinOutlined className="text-emerald-600" /> Trang thiết bị</span>
                },
                {
                  value: 'other',
                  label: <span className="flex items-center gap-2"><EllipsisOutlined className="text-emerald-600" /> Khác</span>
                },
              ]} />

            </Form.Item>

            <Form.Item
              name="price"
              label={<span className="font-semibold text-slate-700 text-xs flex items-center gap-1.5"><DollarOutlined className="text-emerald-600" /> Đơn giá (VNĐ)</span>}
              rules={[{ required: true, message: 'Nhập đơn giá' }]}
            >
              <InputNumber
                className="w-full rounded-xl"
                size="large"
                formatter={v => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={(v) => v!.replace(/,/g, '') as unknown as 0}
                min={0}
                step={1000}
                placeholder="15,000"
              />
            </Form.Item>
            <div className="pt-4 border-t border-slate-100 flex justify-end gap-3 mt-2">
              <Button
                size="large"
                onClick={onCancel}
                className="rounded-xl h-11 px-5 font-semibold border-slate-350 text-slate-650 hover:text-emerald-650 hover:border-emerald-650"
              >
                Hủy
              </Button>
              <Button
                type="primary" htmlType="submit" size="large"
                icon={<CheckCircleOutlined />}
                className="rounded-xl h-11 px-6 font-bold bg-emerald-650 border-emerald-650 hover:bg-emerald-750 hover:border-emerald-750 shadow-md shadow-emerald-600/10"
              >
                {editItem ? 'Lưu thay đổi' : 'Thêm sản phẩm'}
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </Modal>
  );
};
