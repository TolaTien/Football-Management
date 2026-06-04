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
      closeIcon={<span className="text-lg text-slate-450 hover:text-slate-600">✕</span>}
    >
      <div className="flex rounded-xl overflow-hidden min-h-[400px]">
        {/* Panel trái xanh */}
        <div className="w-[185px] min-w-[185px] bg-gradient-to-b from-emerald-600 to-emerald-700 p-9 flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center mb-5">
              <ClockCircleOutlined className="text-2xl text-white" />
            </div>
            <div className="text-white text-[17px] font-extrabold leading-tight mb-3">Thêm Khung Giờ</div>
            <div className="text-white/75 text-[13px] leading-relaxed">
              Thiết lập khung giờ và mức giá phù hợp để tối ưu doanh thu sân bóng.
            </div>
          </div>
        </div>

        {/* Panel phải */}
        <div className="flex-1 bg-white p-8">
          <Form form={form} layout="vertical" onFinish={onFinish}>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="startTime"
                  label={
                    <span className="font-semibold text-slate-700 text-[13px] flex items-center gap-1.5">
                      <ClockCircleOutlined className="text-emerald-650" /> Giờ bắt đầu
                    </span>
                  }
                  rules={[{ required: true, message: 'Chọn giờ' }]}
                >
                  <TimePicker format="HH:mm" size="large" className="w-full rounded-xl border-slate-300 focus:border-emerald-500" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="endTime"
                  label={
                    <span className="font-semibold text-slate-700 text-[13px] flex items-center gap-1.5">
                      <ClockCircleOutlined className="text-emerald-650" /> Giờ kết thúc
                    </span>
                  }
                  rules={[{ required: true, message: 'Chọn giờ' }]}
                >
                  <TimePicker format="HH:mm" size="large" className="w-full rounded-xl border-slate-300 focus:border-emerald-500" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="type"
              label={
                <span className="font-semibold text-slate-700 text-[13px] flex items-center gap-1.5">
                  <TagsOutlined className="text-emerald-650" /> Tên khung giờ
                </span>
              }
              rules={[{ required: true }]}
              initialValue="Giờ thường"
            >
              <Input placeholder="Ví dụ: Giờ vàng buổi tối" size="large" className="rounded-xl border-slate-300 focus:border-emerald-500" />
            </Form.Item>

            <Form.Item
              name="price"
              label={
                <span className="font-semibold text-slate-700 text-[13px] flex items-center gap-1.5">
                  <DollarOutlined className="text-emerald-650" /> Đơn giá (VNĐ/h)
                </span>
              }
              rules={[{ required: true, message: 'Nhập đơn giá' }]}
            >
              <InputNumber
                className="w-full rounded-xl"
                size="large"
                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={(value) => value!.replace(/\$\s?|(,*)/g, '') as unknown as 0}
                min={0}
                step={10000}
                placeholder="350,000"
              />
            </Form.Item>

            <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
              <Button size="large" onClick={onCancel}
                className="rounded-xl h-11 px-6 font-semibold text-slate-700 border-slate-300 hover:text-emerald-650 hover:border-emerald-650"
              >
                Hủy
              </Button>
              <Button type="primary" htmlType="submit" size="large"
                icon={<PlusOutlined />}
                className="bg-emerald-650 border-emerald-650 hover:bg-emerald-750 hover:border-emerald-750 rounded-xl h-11 px-7 font-bold text-white shadow-lg shadow-emerald-650/30"
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
