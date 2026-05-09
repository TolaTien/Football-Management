import React from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { Card, Table, Tag, Input, Space, Button } from 'antd';
import { SearchOutlined, FilterOutlined } from '@ant-design/icons';

const mockCustomers = [
  { id: '1', name: 'Nguyễn Văn A', phone: '0901234567', totalBookings: 15, cancelledBookings: 0, totalSpent: 4500000, type: 'vip' },
  { id: '2', name: 'Trần B', phone: '0987654321', totalBookings: 3, cancelledBookings: 2, totalSpent: 900000, type: 'warning' },
  { id: '3', name: 'Lê C', phone: '0911222333', totalBookings: 5, cancelledBookings: 0, totalSpent: 1500000, type: 'normal' },
  { id: '4', name: 'Phạm D', phone: '0933444555', totalBookings: 1, cancelledBookings: 1, totalSpent: 0, type: 'warning' },
  { id: '5', name: 'FC Hàng Cuối', phone: '0909090909', totalBookings: 20, cancelledBookings: 1, totalSpent: 6500000, type: 'vip' },
];

const AdminCustomers: React.FC = () => {
  const columns = [
    { title: 'Tên / Đội bóng', dataIndex: 'name', key: 'name', fontWeight: 600 },
    { title: 'Số điện thoại', dataIndex: 'phone', key: 'phone' },
    { title: 'Tổng số trận', dataIndex: 'totalBookings', key: 'totalBookings', sorter: (a: any, b: any) => a.totalBookings - b.totalBookings },
    { 
      title: 'Số lần hủy (Bùng kèo)', 
      dataIndex: 'cancelledBookings', 
      key: 'cancelledBookings',
      render: (val: number) => {
        if (val === 0) return <span style={{ color: '#48bb78' }}>0</span>;
        return <span style={{ color: '#f56565', fontWeight: 600 }}>{val}</span>;
      },
      sorter: (a: any, b: any) => a.cancelledBookings - b.cancelledBookings 
    },
    { 
      title: 'Tổng chi tiêu', 
      dataIndex: 'totalSpent', 
      key: 'totalSpent',
      render: (val: number) => `${val.toLocaleString()}đ`,
      sorter: (a: any, b: any) => a.totalSpent - b.totalSpent 
    },
    {
      title: 'Phân loại',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => {
        if (type === 'vip') return <Tag color="gold">VIP</Tag>;
        if (type === 'warning') return <Tag color="error">Cảnh báo</Tag>;
        return <Tag color="default">Khách thường</Tag>;
      }
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: () => (
        <Space size="small">
          <Button type="link" size="small" style={{ color: '#004d40' }}>Xem chi tiết</Button>
          <Button type="link" size="small">Tặng Voucher</Button>
        </Space>
      ),
    },
  ];

  return (
    <PageContainer title="Khách Hàng (CRM)" ghost>
      <Card className="card-minimal" bordered={false}>
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
          <Input 
            placeholder="Tìm kiếm theo tên hoặc SĐT..." 
            prefix={<SearchOutlined />} 
            style={{ width: 300 }}
          />
          <Button icon={<FilterOutlined />}>Lọc nâng cao</Button>
        </div>
        <Table columns={columns} dataSource={mockCustomers} rowKey="id" pagination={{ pageSize: 10 }} />
      </Card>
    </PageContainer>
  );
};

export default AdminCustomers;
