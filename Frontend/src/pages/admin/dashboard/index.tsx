import React from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { Row, Col, Card, Table, Typography, Tag } from 'antd';
import {
  PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';
import {
  WalletOutlined, CalendarOutlined, PieChartOutlined, UsergroupAddOutlined, RobotOutlined
} from '@ant-design/icons';
import { useModel } from '@umijs/max';

const { Title, Text } = Typography;

const pieData = [
  { name: 'Giờ cao điểm', value: 60, color: '#00a67d' },
  { name: 'Giờ sáng', value: 20, color: '#f87171' },
  { name: 'Giờ đêm', value: 20, color: '#bfdbfe' },
];

const AdminDashboard: React.FC = () => {
  const { bookings } = useModel('adminBookings');
  const { users } = useModel('adminUsers');
  const { pitches } = useModel('adminPitches');

  // Tính toán dữ liệu từ model
  const totalRevenue = bookings.filter(b => b.status === 'approved').reduce((sum, b) => sum + (b.price || 0), 0);
  const totalBookings = bookings.length;
  const newUsers = users.length;
  const pendingCount = bookings.filter(b => b.status === 'pending').length;

  const revenueData = [
    { name: 'T2', amount: totalRevenue * 0.1 },
    { name: 'T3', amount: totalRevenue * 0.15 },
    { name: 'T4', amount: totalRevenue * 0.2 },
    { name: 'T5', amount: totalRevenue * 0.1 },
    { name: 'T6', amount: totalRevenue * 0.25 },
    { name: 'T7', amount: totalRevenue * 0.15 },
    { name: 'CN', amount: totalRevenue * 0.05 },
  ];

  const columns = [
    { 
      title: 'KHÁCH HÀNG', 
      dataIndex: 'userName', 
      key: 'userName',
      render: (text: string) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ 
            width: 32, height: 32, borderRadius: '50%', backgroundColor: '#e0e7ff', 
            color: '#3730a3', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: 12
          }}>
            {text.substring(0, 2).toUpperCase()}
          </div>
          <span style={{ fontWeight: 500, color: '#1f2937' }}>{text}</span>
        </div>
      )
    },
    { title: 'SÂN BÓNG', dataIndex: 'pitch', key: 'pitch', render: (text: string) => <span style={{ color: '#4b5563' }}>{text}</span> },
    { title: 'THỜI GIAN', dataIndex: 'time', key: 'time', render: (text: string) => <span style={{ color: '#4b5563' }}>{text}</span> },
    {
      title: 'TRẠNG THÁI',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        if (status === 'approved') return <Tag color="success">ĐÃ DUYỆT</Tag>;
        if (status === 'pending') return <Tag color="warning">CHỜ DUYỆT</Tag>;
        return <Tag color="error">TỪ CHỐI</Tag>;
      },
    },
  ];

  // Logic AI Mock
  const getAIInsight = () => {
    if (pendingCount > 0) return `Hệ thống phân tích có ${pendingCount} đơn đặt sân đang chờ. Bạn nên duyệt ngay để tối ưu lịch trống.`;
    if (totalBookings < 5) return `Doanh thu tuần này đang chậm lại. Gợi ý: Phát hành mã giảm giá 10% cho khung giờ ban ngày.`;
    return `Tình hình kinh doanh tốt. Khung giờ 17h-19h đang kín, gợi ý tăng giá 5% vào tuần sau.`;
  };

  return (
    <PageContainer
      header={{
        title: <Title level={2} style={{ margin: 0, fontWeight: 700 }}>Tổng quan hệ thống</Title>,
        subTitle: <Text style={{ color: '#6b7280', fontSize: 14 }}>Dữ liệu được đồng bộ trực tiếp từ các module quản lý.</Text>,
      }}
    >
      <Row gutter={[24, 24]}>
        {/* Top 4 Stat Cards */}
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} bodyStyle={{ padding: 24, borderRadius: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <div style={{ padding: 8, borderRadius: 8, background: '#d1fae5', color: '#059669' }}>
                <WalletOutlined style={{ fontSize: 20 }} />
              </div>
            </div>
            <Text style={{ color: '#6b7280', fontSize: 13, fontWeight: 500 }}>Doanh thu dự kiến</Text>
            <Title level={3} style={{ margin: '4px 0 0', fontWeight: 700 }}>{totalRevenue.toLocaleString()}đ</Title>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} bodyStyle={{ padding: 24, borderRadius: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <div style={{ padding: 8, borderRadius: 8, background: '#dbeafe', color: '#2563eb' }}>
                <CalendarOutlined style={{ fontSize: 20 }} />
              </div>
            </div>
            <Text style={{ color: '#6b7280', fontSize: 13, fontWeight: 500 }}>Tổng lượt đặt sân</Text>
            <Title level={3} style={{ margin: '4px 0 0', fontWeight: 700 }}>{totalBookings} lượt</Title>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} bodyStyle={{ padding: 24, borderRadius: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <div style={{ padding: 8, borderRadius: 8, background: '#fee2e2', color: '#dc2626' }}>
                <PieChartOutlined style={{ fontSize: 20 }} />
              </div>
            </div>
            <Text style={{ color: '#6b7280', fontSize: 13, fontWeight: 500 }}>Tỷ lệ lấp đầy</Text>
            <Title level={3} style={{ margin: '4px 0 0', fontWeight: 700 }}>{Math.min(100, totalBookings * 10)}%</Title>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} bodyStyle={{ padding: 24, borderRadius: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <div style={{ padding: 8, borderRadius: 8, background: '#ccfbf1', color: '#0d9488' }}>
                <UsergroupAddOutlined style={{ fontSize: 20 }} />
              </div>
            </div>
            <Text style={{ color: '#6b7280', fontSize: 13, fontWeight: 500 }}>Số người dùng mới</Text>
            <Title level={3} style={{ margin: '4px 0 0', fontWeight: 700 }}>{newUsers}</Title>
          </Card>
        </Col>

        {/* AI Analytics and Charts */}
        <Col xs={24} lg={16}>
          <Card bordered={false} style={{ height: '100%', borderRadius: 12 }} bodyStyle={{ padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Phân tích doanh thu AI</div>
                <Text style={{ color: '#6b7280', fontSize: 13 }}>Tự động ước tính dựa trên dữ liệu đặt sân hiện tại</Text>
              </div>
            </div>
            <div style={{ height: 280, width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData} margin={{ top: 20, right: 0, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} 
                    tickFormatter={(val) => `${val / 1000}k`}
                  />
                  <Bar dataKey="amount" fill="#059669" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
        
        <Col xs={24} lg={8}>
          <Card bordered={false} style={{ height: '100%', borderRadius: 12 }} bodyStyle={{ padding: 24 }}>
            <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <RobotOutlined style={{ color: '#8b5cf6' }} /> AI Insights (Đề xuất)
            </div>
            
            <div style={{ padding: 16, backgroundColor: '#f5f3ff', border: '1px solid #ddd6fe', borderRadius: 12, marginBottom: 24 }}>
              <div style={{ fontWeight: 600, color: '#5b21b6', marginBottom: 8 }}>Phân tích hệ thống:</div>
              <div style={{ color: '#4c1d95', fontSize: 14, lineHeight: 1.6 }}>
                {getAIInsight()}
              </div>
            </div>

            <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Khung giờ phổ biến</div>
            <div style={{ height: 180, position: 'relative' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    dataKey="value"
                    stroke="none"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>

        {/* Lịch gần đây */}
        <Col xs={24}>
          <Card bordered={false} style={{ borderRadius: 12 }} bodyStyle={{ padding: '24px 0 0 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 24px 16px', alignItems: 'center' }}>
              <div style={{ fontSize: 16, fontWeight: 700 }}>Danh sách Lịch đặt (Toàn hệ thống)</div>
            </div>
            <Table 
              columns={columns} 
              dataSource={bookings} 
              pagination={{ pageSize: 5 }} 
              rowKey="id"
            />
          </Card>
        </Col>
      </Row>
    </PageContainer>
  );
};

export default AdminDashboard;
