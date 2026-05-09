import React from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { Row, Col, Card, Statistic, Table, Tag } from 'antd';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import { ArrowUpOutlined, ArrowDownOutlined, DollarOutlined, CalendarOutlined, UserOutlined } from '@ant-design/icons';

const revenueData = [
  { name: 'T2', amount: 4000000 },
  { name: 'T3', amount: 3000000 },
  { name: 'T4', amount: 5000000 },
  { name: 'T5', amount: 2780000 },
  { name: 'T6', amount: 6890000 },
  { name: 'T7', amount: 9390000 },
  { name: 'CN', amount: 10490000 },
];

const occupancyData = [
  { time: '06:00', rate: 20 },
  { time: '09:00', rate: 10 },
  { time: '12:00', rate: 30 },
  { time: '15:00', rate: 50 },
  { time: '18:00', rate: 100 },
  { time: '21:00', rate: 90 },
  { time: '23:00', rate: 40 },
];

const recentBookings = [
  { key: '1', user: 'Nguyễn Văn A', pitch: 'Sân 5A', time: '18:00 - 19:30', status: 'completed', amount: '450,000đ' },
  { key: '2', user: 'Trần B', pitch: 'Sân 7B', time: '19:30 - 21:00', status: 'pending', amount: '800,000đ' },
  { key: '3', user: 'FC Hàng Cuối', pitch: 'Sân 5C', time: '20:00 - 21:30', status: 'completed', amount: '450,000đ' },
  { key: '4', user: 'Lê D', pitch: 'Sân 11A', time: '17:00 - 19:00', status: 'cancelled', amount: '1,200,000đ' },
];

const columns = [
  { title: 'Khách hàng', dataIndex: 'user', key: 'user' },
  { title: 'Sân', dataIndex: 'pitch', key: 'pitch' },
  { title: 'Thời gian', dataIndex: 'time', key: 'time' },
  { title: 'Tổng tiền', dataIndex: 'amount', key: 'amount' },
  {
    title: 'Trạng thái',
    dataIndex: 'status',
    key: 'status',
    render: (status: string) => {
      let color = status === 'completed' ? 'success' : status === 'pending' ? 'warning' : 'error';
      let text = status === 'completed' ? 'Thành công' : status === 'pending' ? 'Chờ thanh toán' : 'Đã hủy';
      return <Tag color={color}>{text}</Tag>;
    },
  },
];

const AdminDashboard: React.FC = () => {
  return (
    <PageContainer title="Bảng Điều Khiển Admin" ghost>
      <Row gutter={[24, 24]}>
        <Col xs={24} sm={8}>
          <Card className="card-minimal" bordered={false}>
            <Statistic
              title="Doanh thu hôm nay"
              value={4250000}
              precision={0}
              valueStyle={{ color: '#004d40', fontWeight: 600 }}
              prefix={<DollarOutlined />}
              suffix="đ"
            />
            <div style={{ marginTop: 8, color: '#48bb78', fontSize: 12 }}>
              <ArrowUpOutlined /> 15% so với hôm qua
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card className="card-minimal" bordered={false}>
            <Statistic
              title="Lượt đặt sân"
              value={45}
              valueStyle={{ color: '#2d3748', fontWeight: 600 }}
              prefix={<CalendarOutlined />}
            />
            <div style={{ marginTop: 8, color: '#f56565', fontSize: 12 }}>
              <ArrowDownOutlined /> 5% so với tuần trước
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card className="card-minimal" bordered={false}>
            <Statistic
              title="Khách hàng mới"
              value={12}
              valueStyle={{ color: '#2d3748', fontWeight: 600 }}
              prefix={<UserOutlined />}
            />
            <div style={{ marginTop: 8, color: '#48bb78', fontSize: 12 }}>
              <ArrowUpOutlined /> 20% so với tháng trước
            </div>
          </Card>
        </Col>

        {/* Charts */}
        <Col xs={24} lg={12}>
          <Card className="card-minimal" title="Doanh thu tuần này" bordered={false}>
            <div style={{ height: 300, width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `${value / 1000000}M`} />
                  <Tooltip formatter={(value: number) => `${value.toLocaleString()}đ`} cursor={{ fill: 'rgba(0,77,64,0.05)' }} />
                  <Bar dataKey="amount" fill="#004d40" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card className="card-minimal" title="Tỷ lệ lấp đầy sân theo giờ (%)" bordered={false}>
            <div style={{ height: 300, width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={occupancyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="time" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Line type="monotone" dataKey="rate" stroke="#48bb78" strokeWidth={3} dot={{ r: 4, fill: '#48bb78' }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>

        {/* Recent Bookings */}
        <Col xs={24}>
          <Card className="card-minimal" title="Giao dịch gần đây" bordered={false} bodyStyle={{ padding: 0 }}>
            <Table columns={columns} dataSource={recentBookings} pagination={false} />
          </Card>
        </Col>
      </Row>
    </PageContainer>
  );
};

export default AdminDashboard;
