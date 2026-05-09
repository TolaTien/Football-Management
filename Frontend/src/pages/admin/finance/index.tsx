import React from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { Card, Table, Tag, Row, Col, DatePicker, Select, Space, Button } from 'antd';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { DownloadOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

const transactionData = [
  { id: 'TXN001', date: '2026-05-09 18:30', user: 'Nguyễn Văn A', type: 'Đặt sân', amount: 450000, method: 'Chuyển khoản', status: 'success' },
  { id: 'TXN002', date: '2026-05-09 19:00', user: 'Nguyễn Văn A', type: 'Dịch vụ (Nước, Áo)', amount: 150000, method: 'Tiền mặt', status: 'success' },
  { id: 'TXN003', date: '2026-05-08 20:00', user: 'Trần B', type: 'Đặt sân', amount: 800000, method: 'Ví điện tử', status: 'refunded' },
  { id: 'TXN004', date: '2026-05-08 17:00', user: 'Lê C', type: 'Đặt sân', amount: 300000, method: 'Chuyển khoản', status: 'success' },
  { id: 'TXN005', date: '2026-05-07 19:30', user: 'FC Hàng Cuối', type: 'Đặt sân + Dịch vụ', amount: 650000, method: 'Tiền mặt', status: 'success' },
];

const revenueBreakdown = [
  { name: 'Tiền thuê sân', value: 45000000 },
  { name: 'Nước giải khát', value: 8500000 },
  { name: 'Thuê áo, bóng', value: 3200000 },
  { name: 'Tổ chức giải đấu', value: 12000000 },
];
const COLORS = ['#004d40', '#48bb78', '#ecc94b', '#f6ad55'];

const AdminFinance: React.FC = () => {
  const columns = [
    { title: 'Mã GD', dataIndex: 'id', key: 'id', render: (text: string) => <code>{text}</code> },
    { title: 'Thời gian', dataIndex: 'date', key: 'date' },
    { title: 'Khách hàng', dataIndex: 'user', key: 'user' },
    { title: 'Loại thanh toán', dataIndex: 'type', key: 'type' },
    { title: 'Phương thức', dataIndex: 'method', key: 'method' },
    { 
      title: 'Số tiền', 
      dataIndex: 'amount', 
      key: 'amount',
      render: (val: number, record: any) => (
        <span style={{ color: record.status === 'refunded' ? '#f56565' : '#2d3748', fontWeight: 600 }}>
          {record.status === 'refunded' ? '-' : '+'}{val.toLocaleString()}đ
        </span>
      )
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        if (status === 'success') return <Tag color="success">Thành công</Tag>;
        if (status === 'refunded') return <Tag color="error">Hoàn tiền</Tag>;
        return <Tag color="default">Chờ xử lý</Tag>;
      }
    },
  ];

  return (
    <PageContainer title="Báo Cáo & Tài Chính" ghost>
      <Row gutter={[24, 24]}>
        {/* Biểu đồ cơ cấu doanh thu */}
        <Col xs={24} md={8}>
          <Card className="card-minimal" title="Cơ cấu doanh thu (Tháng này)" bordered={false} style={{ height: '100%' }}>
            <div style={{ height: 250 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={revenueBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {revenueBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => `${value.toLocaleString()}đ`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div style={{ textAlign: 'center', marginTop: 16 }}>
              <h3 style={{ margin: 0, color: '#004d40', fontSize: 24 }}>68,700,000đ</h3>
              <p style={{ color: '#718096', fontSize: 12 }}>Tổng doanh thu</p>
            </div>
          </Card>
        </Col>

        {/* Lịch sử giao dịch */}
        <Col xs={24} md={16}>
          <Card className="card-minimal" title="Lịch sử giao dịch" bordered={false}>
            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
              <Space>
                <RangePicker defaultValue={[dayjs().subtract(7, 'days'), dayjs()]} format="DD/MM/YYYY" />
                <Select defaultValue="all" style={{ width: 120 }}>
                  <Select.Option value="all">Tất cả TT</Select.Option>
                  <Select.Option value="success">Thành công</Select.Option>
                  <Select.Option value="refunded">Hoàn tiền</Select.Option>
                </Select>
                <Select defaultValue="all" style={{ width: 150 }}>
                  <Select.Option value="all">Tất cả loại</Select.Option>
                  <Select.Option value="pitch">Tiền thuê sân</Select.Option>
                  <Select.Option value="service">Tiền dịch vụ</Select.Option>
                </Select>
              </Space>
              <Button icon={<DownloadOutlined />}>Xuất Excel</Button>
            </div>
            <Table columns={columns} dataSource={transactionData} rowKey="id" pagination={{ pageSize: 5 }} />
          </Card>
        </Col>
      </Row>
    </PageContainer>
  );
};

export default AdminFinance;
