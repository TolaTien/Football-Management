import React, { useState } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { Table, Button, Space, Typography, Popconfirm, Tag, InputNumber } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { useModel } from '@umijs/max';

const { Title, Text } = Typography;

const AdminServices: React.FC = () => {
  const { services, deleteService, updateStock } = useModel('adminServices');

  const columns = [
    {
      title: 'Tên Dịch vụ / Mặt hàng',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: any) => (
        <div>
          <Text strong>{text}</Text>
          <div style={{ fontSize: 12, color: 'gray' }}>{record.type === 'drink' ? 'Đồ uống' : 'Trang phục/Bóng'}</div>
        </div>
      )
    },
    {
      title: 'Đơn giá',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => `${price.toLocaleString()} VNĐ`
    },
    {
      title: 'Tồn kho',
      dataIndex: 'stock',
      key: 'stock',
      render: (stock: number, record: any) => (
        <Space>
          <InputNumber 
            min={0} 
            value={stock} 
            onChange={(val) => {
              if (val !== null) {
                // Tính khoảng chênh lệch để cập nhật
                updateStock(record.id, val - stock);
              }
            }}
          />
        </Space>
      )
    },
    {
      title: 'Trạng thái',
      key: 'status',
      render: (_: any, record: any) => {
        if (record.status === 'in_stock') return <Tag color="success">CÒN HÀNG</Tag>;
        if (record.status === 'low_stock') return <Tag color="warning">SẮP HẾT</Tag>;
        return <Tag color="error">HẾT HÀNG</Tag>;
      }
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: any) => (
        <Popconfirm title="Bạn có chắc muốn xóa dịch vụ này?" onConfirm={() => deleteService(record.id)}>
          <Button danger icon={<DeleteOutlined />} type="text" />
        </Popconfirm>
      )
    }
  ];

  return (
    <PageContainer
      header={{
        title: <Title level={2} style={{ margin: 0, fontWeight: 700 }}>Quản lý Kho & Dịch vụ</Title>,
        subTitle: <Text style={{ color: '#6b7280' }}>Quản lý nước uống, bóng, áo pitch bán/cho thuê tại sân.</Text>,
        extra: [
          <Button key="add" type="primary" icon={<PlusOutlined />} style={{ backgroundColor: '#059669' }}>
            Thêm sản phẩm mới
          </Button>
        ]
      }}
    >
      <div style={{ backgroundColor: 'white', padding: 24, borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <Table 
          columns={columns} 
          dataSource={services} 
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </div>
    </PageContainer>
  );
};

export default AdminServices;
