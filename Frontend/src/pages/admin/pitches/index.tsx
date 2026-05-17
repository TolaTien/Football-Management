import React, { useEffect, useState } from 'react';
import { Button, Card, Form, Input, InputNumber, Modal, Select, Table, Tag, Typography, message } from 'antd';
import { pitchApi } from '@/shared/api/modules';
import type { Pitch } from '@/shared/types/domain';

const AdminPitches: React.FC = () => {
  const [items, setItems] = useState<Pitch[]>([]);
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();

  const load = async () => {
    const res = await pitchApi.list();
    setItems(res.data.data);
  };

  useEffect(() => { void load(); }, []);

  const create = async (values: any) => {
    await pitchApi.create(values);
    message.success('Đã tạo sân');
    setOpen(false);
    form.resetFields();
    await load();
  };

  return (
    <Card extra={<Button type="primary" onClick={() => setOpen(true)}>Thêm sân</Button>}>
      <Typography.Title level={2}>Quản lý sân</Typography.Title>
      <Table
        rowKey="pitchId"
        dataSource={items}
        columns={[
          { title: 'Tên sân', dataIndex: 'namePitch' },
          { title: 'Địa chỉ', dataIndex: 'address' },
          { title: 'Loại sân', dataIndex: 'pitchCategory' },
          { title: 'Trạng thái', render: (_, r) => <Tag>{r.status}</Tag> },
          { title: 'Số cấu hình giá', render: (_, r) => r.pitchprice?.length || 0 },
        ]}
      />
      <Modal open={open} onCancel={() => setOpen(false)} onOk={() => form.submit()} title="Thêm sân">
        <Form form={form} layout="vertical" onFinish={create}>
          <Form.Item name="namePitch" label="Tên sân" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="address" label="Địa chỉ" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="pitchCategory" label="Loại sân" rules={[{ required: true }]}><InputNumber className="w-full" /></Form.Item>
          <Form.Item name="status" label="Trạng thái" initialValue="active"><Select options={[{ value: 'active' }, { value: 'maintenance' }]} /></Form.Item>
          <Form.Item name="startTime" label="Bắt đầu" rules={[{ required: true }]}><Input placeholder="2026-05-17T06:00:00.000Z" /></Form.Item>
          <Form.Item name="endTime" label="Kết thúc" rules={[{ required: true }]}><Input placeholder="2026-05-17T22:00:00.000Z" /></Form.Item>
          <Form.Item name="price" label="Giá" rules={[{ required: true }]}><InputNumber className="w-full" min={0} /></Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default AdminPitches;
