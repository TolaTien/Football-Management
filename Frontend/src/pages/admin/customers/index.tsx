import React, { useEffect, useState } from 'react';
import { Button, Card, Form, Input, Modal, Select, Space, Table, Tag, Typography, message } from 'antd';
import { adminApi } from '@/shared/api/modules';
import type { User } from '@/shared/types/domain';

const AdminCustomers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();

  const load = async () => {
    const res = await adminApi.users();
    setUsers(res.data.data.users);
  };

  useEffect(() => { void load(); }, []);

  const create = async (values: any) => {
    await adminApi.createUser(values);
    message.success('Đã tạo người dùng');
    setOpen(false);
    form.resetFields();
    await load();
  };

  return (
    <Card extra={<Button type="primary" onClick={() => setOpen(true)}>Thêm người dùng</Button>}>
      <Typography.Title level={2}>Người dùng</Typography.Title>
      <Table
        rowKey="userId"
        dataSource={users}
        columns={[
          { title: 'Tên', dataIndex: 'fullName' },
          { title: 'Email', dataIndex: 'email' },
          { title: 'SĐT', dataIndex: 'phone' },
          { title: 'Vai trò', render: (_, r) => <Tag>{r.role}</Tag> },
          { title: 'Trạng thái', render: (_, r) => <Tag>{r.status || 'active'}</Tag> },
          {
            title: 'Thao tác',
            render: (_, r) => (
              <Space>
                {r.role === 'user' && (
                  <Button onClick={async () => { await adminApi.banUser(r.userId, r.status === 'banned' ? 'active' : 'banned'); await load(); }}>
                    {r.status === 'banned' ? 'Mở khóa' : 'Khóa'}
                  </Button>
                )}
                <Button danger onClick={async () => { await adminApi.removeUser(r.userId); await load(); }}>Xóa</Button>
              </Space>
            ),
          },
        ]}
      />
      <Modal open={open} onCancel={() => setOpen(false)} onOk={() => form.submit()} title="Thêm người dùng">
        <Form form={form} layout="vertical" onFinish={create}>
          <Form.Item name="fullName" label="Họ tên" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true }, { type: 'email' }]}><Input /></Form.Item>
          <Form.Item name="phone" label="SĐT"><Input /></Form.Item>
          <Form.Item name="password" label="Mật khẩu" rules={[{ required: true }]}><Input.Password /></Form.Item>
          <Form.Item name="role" label="Vai trò" initialValue="user"><Select options={[{ value: 'user' }, { value: 'admin' }]} /></Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default AdminCustomers;
