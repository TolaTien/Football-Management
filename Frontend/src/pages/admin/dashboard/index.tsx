import React from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { Row, Col, Card, Table, Typography } from 'antd';
import {
  PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip
} from 'recharts';
import {
  WalletOutlined,
  CalendarOutlined,
  PieChartOutlined,
  UsergroupAddOutlined,
} from '@ant-design/icons';

const { Title, Text } = Typography;

const revenueData = [
  { name: 'T2', amount: 0 },
  { name: 'T3', amount: 0 },
  { name: 'T4', amount: 0 },
  { name: 'T5', amount: 0 },
  { name: 'T6', amount: 0 },
  { name: 'T7', amount: 0 },
  { name: 'CN', amount: 0 },
];

const pieData = [
  { name: 'Giờ cao điểm', value: 60, color: '#00a67d' },
  { name: 'Giờ sáng', value: 20, color: '#f87171' },
  { name: 'Giờ đêm', value: 20, color: '#bfdbfe' },
];

const recentBookings = [
  { key: '1', user: 'Nguyễn Văn Hùng', avatar: 'NH', pitch: 'Sân 7 - Khu A', time: '17:30 - 19:00', status: 'ĐÃ THANH TOÁN', statusColor: 'success' },
  { key: '2', user: 'Minh Tú FC', avatar: 'MT', pitch: 'Sân 5 - Khu B', time: '18:00 - 19:30', status: 'CHỜ XÁC NHẬN', statusColor: 'warning' },
  { key: '3', user: 'Lê Anh Dũng', avatar: 'LA', pitch: 'Sân 7 - Khu A', time: '19:30 - 21:00', status: 'ĐÃ THANH TOÁN', statusColor: 'success' },
];

const columns = [
  { 
    title: 'KHÁCH HÀNG', 
    dataIndex: 'user', 
    key: 'user',
    render: (text: string, record: any) => (
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ 
          width: 32, height: 32, borderRadius: '50%', backgroundColor: '#e0e7ff', 
          color: '#3730a3', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: 12
        }}>
          {record.avatar}
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
    render: (status: string, record: any) => (
      <span className={`status-tag status-${record.statusColor}`}>
        {status}
      </span>
    ),
  },
];

const AdminDashboard: React.FC = () => {
  return (
    <PageContainer
      header={{
        title: <Title level={2} style={{ margin: 0, fontWeight: 700 }}>Tổng quan hệ thống</Title>,
        subTitle: <Text style={{ color: '#6b7280', fontSize: 14 }}>Chào mừng trở lại! Dưới đây là hiệu suất vận hành của hôm nay.</Text>,
      }}
    >
      <Row gutter={[24, 24]}>
        {/* Top 4 Stat Cards */}
        <Col xs={24} sm={12} lg={6}>
          <Card className="card-arena" bordered={false} bodyStyle={{ padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <div className="stat-icon-wrapper" style={{ background: '#d1fae5', color: '#059669' }}>
                <WalletOutlined />
              </div>
              <Text style={{ color: '#059669', fontWeight: 600 }}>+12.5%</Text>
            </div>
            <Text style={{ color: '#6b7280', fontSize: 13, fontWeight: 500 }}>Tổng doanh thu hôm nay</Text>
            <Title level={3} style={{ margin: '4px 0 0', fontWeight: 700, fontSize: 24 }}>12.450.000đ</Title>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="card-arena" bordered={false} bodyStyle={{ padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <div className="stat-icon-wrapper" style={{ background: '#dbeafe', color: '#2563eb' }}>
                <CalendarOutlined />
              </div>
              <Text style={{ color: '#059669', fontWeight: 600 }}>+4</Text>
            </div>
            <Text style={{ color: '#6b7280', fontSize: 13, fontWeight: 500 }}>Số lượt đặt sân mới</Text>
            <Title level={3} style={{ margin: '4px 0 0', fontWeight: 700, fontSize: 24 }}>24 lượt</Title>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="card-arena" bordered={false} bodyStyle={{ padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <div className="stat-icon-wrapper" style={{ background: '#fee2e2', color: '#dc2626' }}>
                <PieChartOutlined />
              </div>
              <Text style={{ color: '#dc2626', fontWeight: 600 }}>-2%</Text>
            </div>
            <Text style={{ color: '#6b7280', fontSize: 13, fontWeight: 500 }}>Tỷ lệ lấp đầy sân</Text>
            <Title level={3} style={{ margin: '4px 0 0', fontWeight: 700, fontSize: 24 }}>78%</Title>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="card-arena" bordered={false} bodyStyle={{ padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <div className="stat-icon-wrapper" style={{ background: '#ccfbf1', color: '#0d9488' }}>
                <UsergroupAddOutlined />
              </div>
              <Text style={{ color: '#059669', fontWeight: 600 }}>+18%</Text>
            </div>
            <Text style={{ color: '#6b7280', fontSize: 13, fontWeight: 500 }}>Số người dùng mới</Text>
            <Title level={3} style={{ margin: '4px 0 0', fontWeight: 700, fontSize: 24 }}>156</Title>
          </Card>
        </Col>

        {/* Middle Row: Bar Chart & Donut Chart */}
        <Col xs={24} lg={16}>
          <Card className="card-arena" bordered={false} style={{ height: '100%' }} bodyStyle={{ padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
              <div>
                <div className="card-title" style={{ marginBottom: 4 }}>Xu hướng doanh thu tuần</div>
                <Text style={{ color: '#6b7280', fontSize: 13 }}>Thống kê từ Thứ 2 đến Chủ nhật</Text>
              </div>
              <div style={{ border: '1px solid #e5e7eb', borderRadius: 6, padding: '4px 12px', fontSize: 13, color: '#4b5563', cursor: 'pointer' }}>Chi tiết</div>
            </div>
            <div style={{ height: 280, width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                  <Bar dataKey="amount" fill="#00a67d" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card className="card-arena" bordered={false} style={{ height: '100%' }} bodyStyle={{ padding: 24 }}>
            <div className="card-title">Đặt sân theo khung giờ</div>
            <div style={{ height: 220, position: 'relative' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={90}
                    dataKey="value"
                    stroke="none"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                <div style={{ fontSize: 20, fontWeight: 700, color: '#1f2937' }}>Hot!</div>
                <div style={{ fontSize: 12, color: '#6b7280' }}>17:00 - 19:00</div>
              </div>
            </div>
            <div style={{ marginTop: 16 }}>
              {pieData.map(item => (
                <div key={item.name} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: item.color }} />
                    <Text style={{ color: '#4b5563', fontSize: 14 }}>{item.name}</Text>
                  </div>
                  <Text style={{ fontWeight: 600, color: '#1f2937' }}>{item.value}%</Text>
                </div>
              ))}
            </div>
          </Card>
        </Col>

        {/* Bottom Row: Table & Pitch Status */}
        <Col xs={24} lg={16}>
          <Card className="card-arena" bordered={false} bodyStyle={{ padding: '24px 0 0 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 24px 16px', alignItems: 'center' }}>
              <div className="card-title" style={{ margin: 0 }}>Lịch đặt sân gần đây</div>
              <a style={{ color: '#00a67d', fontWeight: 500 }}>Xem tất cả</a>
            </div>
            <Table 
              columns={columns} 
              dataSource={recentBookings} 
              pagination={false} 
              rowClassName={() => 'custom-table-row'}
            />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card className="card-arena" bordered={false} bodyStyle={{ padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div className="card-title" style={{ margin: 0 }}>Trạng thái sân</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#059669', background: '#d1fae5', padding: '4px 8px', borderRadius: 12 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#059669' }} /> Live
              </div>
            </div>
            <Row gutter={[16, 16]}>
              {[
                { name: 'Sân 1', desc: 'Cỏ nhân tạo 7', status: 'ĐANG ĐÁ', color: 'success' },
                { name: 'Sân 2', desc: 'Cỏ nhân tạo 5', status: 'TRỐNG', color: 'neutral' },
                { name: 'Sân 3', desc: 'Cỏ nhân tạo 7', status: 'ĐANG ĐÁ', color: 'success' },
                { name: 'Sân 4', desc: 'Cỏ nhân tạo 5', status: 'BẢO TRÌ', color: 'error' },
              ].map(pitch => (
                <Col span={12} key={pitch.name}>
                  <div style={{ 
                    border: '1px solid #e5e7eb', borderRadius: 8, padding: 16, 
                    backgroundColor: pitch.status === 'TRỐNG' ? '#f9fafb' : '#ffffff' 
                  }}>
                    <div style={{ fontWeight: 600, color: '#1f2937', marginBottom: 4 }}>{pitch.name}</div>
                    <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 12 }}>{pitch.desc}</div>
                    <span className={`status-tag status-${pitch.color}`} style={{ fontSize: 10 }}>
                      {pitch.status}
                    </span>
                  </div>
                </Col>
              ))}
            </Row>
            <div style={{ marginTop: 24, padding: 16, backgroundColor: '#ecfdf5', borderRadius: 8, display: 'flex', gap: 12 }}>
              <div style={{ color: '#00a67d', fontSize: 20 }}>💡</div>
              <Text style={{ color: '#047857', fontSize: 13, lineHeight: '1.5' }}>
                Gợi ý: Khung giờ 16h ngày mai đang có 3 sân trống, bạn nên chạy khuyến mãi.
              </Text>
            </div>
          </Card>
        </Col>
      </Row>
    </PageContainer>
  );
};

export default AdminDashboard;
