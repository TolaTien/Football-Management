import React, { useEffect, useState } from 'react';
import { Button, Card, Form, Input, InputNumber, Modal, Space, Table, Typography, message } from 'antd';
import { serviceApi } from '@/shared/api/modules';
import type { ServiceItem } from '@/shared/types/domain';

const AdminServices: React.FC = () => {
  const [items, setItems] = useState<ServiceItem[]>([]);
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();

  const load = async () => {
    const res = await serviceApi.list();
    setItems(res.data);
  };

  useEffect(() => { void load(); }, []);

  const create = async (values: any) => {
    await serviceApi.create(values);
    message.success('Đã tạo dịch vụ');
    setOpen(false);
    form.resetFields();
    await load();
  };

  return (
    <Card extra={<Button type="primary" onClick={() => setOpen(true)}>Thêm dịch vụ</Button>}>
      <Typography.Title level={2}>Dịch vụ</Typography.Title>
      <Table
        rowKey="serviceId"
        dataSource={items}
        columns={[
          { title: 'Tên', dataIndex: 'nameProduct' },
          { title: 'Giá', render: (_, r) => `${(r.price || 0).toLocaleString()}đ` },
          { title: 'Tổng số lượng', dataIndex: 'totalQuantity' },
          { title: 'Đang mượn', dataIndex: 'borrowed' },
          { title: 'Đã trả', dataIndex: 'returned' },
          { title: 'Thao tác', render: (_, r) => <Space><Button danger onClick={async () => { await serviceApi.remove(r.serviceId); await load(); }}>Xóa</Button></Space> },
        ]}
      />
      <Modal open={open} onCancel={() => setOpen(false)} onOk={() => form.submit()} title="Thêm dịch vụ">
        <Form form={form} layout="vertical" onFinish={create}>
          <Form.Item name="nameProduct" label="Tên" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="price" label="Giá" rules={[{ required: true }]}><InputNumber className="w-full" min={0} /></Form.Item>
          <Form.Item name="totalQuantity" label="Số lượng" initialValue={0}><InputNumber className="w-full" min={0} /></Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default AdminServices;
