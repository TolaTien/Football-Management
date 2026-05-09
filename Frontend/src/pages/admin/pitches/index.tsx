import React, { useState } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { Card, Table, Button, Tag, Space, Modal, Form, Input, InputNumber, Select, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const initialPitches = [
  { id: '1', name: 'Sân 5A', type: '5', normalPrice: 300000, peakPrice: 450000, status: 'active' },
  { id: '2', name: 'Sân 5B', type: '5', normalPrice: 300000, peakPrice: 450000, status: 'active' },
  { id: '3', name: 'Sân 7A', type: '7', normalPrice: 500000, peakPrice: 800000, status: 'active' },
  { id: '4', name: 'Sân 11', type: '11', normalPrice: 1000000, peakPrice: 1500000, status: 'maintenance' },
];

const AdminPitches: React.FC = () => {
  const [pitches, setPitches] = useState(initialPitches);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const handleEdit = (record: any) => {
    form.setFieldsValue(record);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: 'Xác nhận xóa sân',
      content: 'Bạn có chắc chắn muốn xóa sân này?',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: () => {
        setPitches(pitches.filter(p => p.id !== id));
        message.success('Đã xóa sân');
      }
    });
  };

  const handleSave = () => {
    form.validateFields().then(values => {
      const existing = pitches.find(p => p.id === values.id);
      if (existing) {
        setPitches(pitches.map(p => p.id === values.id ? { ...p, ...values } : p));
        message.success('Cập nhật thành công');
      } else {
        setPitches([...pitches, { ...values, id: Math.random().toString() }]);
        message.success('Thêm sân thành công');
      }
      setIsModalOpen(false);
    });
  };

  const columns = [
    { title: 'Tên sân', dataIndex: 'name', key: 'name', fontWeight: 600 },
    { 
      title: 'Loại sân', 
      dataIndex: 'type', 
      key: 'type',
      render: (type: string) => <Tag color="blue">Sân {type}</Tag>
    },
    { 
      title: 'Giá giờ thường', 
      dataIndex: 'normalPrice', 
      key: 'normalPrice',
      render: (val: number) => `${val.toLocaleString()}đ`
    },
    { 
      title: 'Giá giờ vàng', 
      dataIndex: 'peakPrice', 
      key: 'peakPrice',
      render: (val: number) => `${val.toLocaleString()}đ`
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'active' ? 'success' : 'error'}>
          {status === 'active' ? 'Đang hoạt động' : 'Bảo trì'}
        </Tag>
      )
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: any) => (
        <Space size="middle">
          <Button type="text" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Button type="text" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)} />
        </Space>
      ),
    },
  ];

  return (
    <PageContainer title="Quản lý Sân Bóng" ghost>
      <Card className="card-minimal" bordered={false}>
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'flex-end' }}>
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            style={{ background: '#004d40' }}
            onClick={() => {
              form.resetFields();
              setIsModalOpen(true);
            }}
          >
            Thêm sân mới
          </Button>
        </div>
        <Table columns={columns} dataSource={pitches} rowKey="id" pagination={false} />
      </Card>

      <Modal
        title={form.getFieldValue('id') ? "Chỉnh sửa sân" : "Thêm sân mới"}
        open={isModalOpen}
        onOk={handleSave}
        onCancel={() => setIsModalOpen(false)}
        okText="Lưu"
        cancelText="Hủy"
        okButtonProps={{ style: { background: '#004d40' } }}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="id" hidden><Input /></Form.Item>
          <Form.Item name="name" label="Tên sân" rules={[{ required: true, message: 'Vui lòng nhập tên sân' }]}>
            <Input placeholder="VD: Sân 5A" />
          </Form.Item>
          <Form.Item name="type" label="Loại sân" rules={[{ required: true, message: 'Vui lòng chọn loại sân' }]}>
            <Select>
              <Select.Option value="5">Sân 5 người</Select.Option>
              <Select.Option value="7">Sân 7 người</Select.Option>
              <Select.Option value="11">Sân 11 người</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="normalPrice" label="Giá giờ thường (VNĐ)">
            <InputNumber style={{ width: '100%' }} step={10000} />
          </Form.Item>
          <Form.Item name="peakPrice" label="Giá giờ vàng (VNĐ)">
            <InputNumber style={{ width: '100%' }} step={10000} />
          </Form.Item>
          <Form.Item name="status" label="Trạng thái">
            <Select>
              <Select.Option value="active">Đang hoạt động</Select.Option>
              <Select.Option value="maintenance">Bảo trì</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
};

export default AdminPitches;
