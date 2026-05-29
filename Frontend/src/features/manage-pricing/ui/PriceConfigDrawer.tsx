import React from 'react';
import { Drawer, Form, Button, TimePicker, InputNumber, Table, Popconfirm, message } from 'antd';
import { PlusOutlined, DeleteOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '@/shared/model/hooks';
import { syncPriceConfigThunk } from '@/entities/pitch/model/pitchSlice';
import type { Pitch, PriceRule } from '@/entities/pitch/model/types';
import type { Dayjs } from 'dayjs';

interface PriceConfigDrawerProps {
  pitch: Pitch | null;
  onClose: () => void;
}

export const PriceConfigDrawer: React.FC<PriceConfigDrawerProps> = ({ pitch, onClose }) => {
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();
  
  const { prices } = useAppSelector((state) => state.pitch);
  
  if (!pitch) return null;

  const currentPrices = prices.filter(p => p.pitchId === pitch.id);

  const handleAddRule = (values: { startTime: Dayjs; endTime: Dayjs; price: number }) => {
    const timeRange = `${values.startTime.format('HH:mm')} - ${values.endTime.format('HH:mm')}`;
    
    const newRule: PriceRule = {
      id: `pr_${Date.now()}`,
      pitchId: pitch.id,
      timeRange: timeRange,
      price: values.price,
      type: 'Giờ thường',
      status: 'active',
      icon: 'sun'
    };

    const updatedPrices = [...prices, newRule];
    dispatch(syncPriceConfigThunk({ pitchId: pitch.id, updatedPrices }));
    message.success('Đã thêm khung giờ giá mới!');
    form.resetFields();
  };

  const handleDeleteRule = (id: string) => {
    const updatedPrices = prices.filter((p) => p.id !== id);
    dispatch(syncPriceConfigThunk({ pitchId: pitch.id, updatedPrices }));
    message.success('Đã xóa khung giờ giá!');
  };

  const columns = [
    {
      title: 'Khung giờ',
      dataIndex: 'timeRange',
      key: 'timeRange',
      render: (text: string) => (
        <span className="font-semibold text-slate-700 flex items-center gap-1.5">
          <ClockCircleOutlined className="text-slate-400" /> {text}
        </span>
      ),
    },
    {
      title: 'Đơn giá / Giờ',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => (
        <span className="font-extrabold text-emerald-600">
          {price.toLocaleString()} VNĐ
        </span>
      ),
    },
    {
      title: 'Hành động',
      key: 'action',
      align: 'right' as const,
      render: (_: any, record: PriceRule) => (
        <Popconfirm title="Xóa khung giờ này?" onConfirm={() => handleDeleteRule(record.id)} okText="Xóa" cancelText="Hủy">
          <Button type="text" danger icon={<DeleteOutlined />} className="hover:bg-red-50 rounded-lg" />
        </Popconfirm>
      ),
    },
  ];

  return (
    <Drawer
      title={
        <div>
          <div className="font-extrabold text-lg text-slate-800">Cấu hình bảng giá</div>
          <div className="text-slate-400 text-xs mt-0.5">Sân: {pitch.name} ({pitch.type})</div>
        </div>
      }
      placement="right"
      width={480}
      onClose={onClose}
      open={!!pitch}
      className="rounded-l-2xl overflow-hidden"
    >
      <div className="space-y-6">
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="font-bold text-sm text-slate-800 mb-4">➕ Thêm khung giờ giá mới</div>
          <Form form={form} layout="vertical" onFinish={handleAddRule}>
            <div className="grid grid-cols-2 gap-3">
              <Form.Item name="startTime" label={<span className="text-xs font-semibold text-slate-600">Giờ bắt đầu</span>} rules={[{ required: true, message: 'Chọn giờ!' }]}>
                <TimePicker className="w-full h-10 rounded-xl" format="HH:mm" minuteStep={30} />
              </Form.Item>
              <Form.Item name="endTime" label={<span className="text-xs font-semibold text-slate-600">Giờ kết thúc</span>} rules={[{ required: true, message: 'Chọn giờ!' }]}>
                <TimePicker className="w-full h-10 rounded-xl" format="HH:mm" minuteStep={30} />
              </Form.Item>
            </div>
            
            <Form.Item name="price" label={<span className="text-xs font-semibold text-slate-600">Giá tiền (VNĐ / Giờ)</span>} rules={[{ required: true, message: 'Nhập giá tiền!' }]}>
              <InputNumber
                className="w-full rounded-xl"
                size="large"
                formatter={v => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={(v) => v!.replace(/,/g, '') as unknown as 0}
                placeholder="400,000"
                min={0}
                step={10000}
              />
            </Form.Item>
            
            <Button 
              type="primary" 
              htmlType="submit" 
              icon={<PlusOutlined />}
              className="w-full h-11 bg-emerald-600 border-emerald-600 hover:bg-emerald-700 hover:border-emerald-700 rounded-xl font-bold mt-2 shadow-md shadow-emerald-600/10"
            >
              Thêm quy tắc giá
            </Button>
          </Form>
        </div>

        <div>
          <div className="font-bold text-sm text-slate-800 mb-3">📋 Các khung giờ giá đang áp dụng</div>
          <Table 
            dataSource={currentPrices} 
            columns={columns} 
            rowKey="id" 
            pagination={false}
            className="admin-table border border-slate-100 rounded-xl overflow-hidden shadow-sm"
          />
        </div>
      </div>
    </Drawer>
  );
};
