import React from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { Row, Col, Card, Table, Typography, Tag } from 'antd';
import {
  PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip
} from 'recharts';
import {
  WalletOutlined, CalendarOutlined, PieChartOutlined, UsergroupAddOutlined, RobotOutlined,
  ArrowUpOutlined, ArrowDownOutlined,
} from '@ant-design/icons';
import { useModel } from '@umijs/max';

const { Title, Text } = Typography;

const pieData = [
  { name: 'Giờ cao điểm', value: 60, color: '#00a67d' },
  { name: 'Giờ sáng', value: 20, color: '#f87171' },
  { name: 'Giờ đêm', value: 20, color: '#bfdbfe' },
];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={700}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const StatCard = ({
  icon, label, value, trend, trendLabel, color, bg, gradient,
}: {
  icon: React.ReactNode; label: string; value: string; trend?: number; trendLabel?: string;
  color: string; bg: string; gradient?: string;
}) => (
  <div
    style={{
      background: gradient || 'white',
      borderRadius: 16,
      padding: '22px 24px',
      boxShadow: '0 1px 4px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.04)',
      border: gradient ? 'none' : '1px solid #e2e8f0',
      transition: 'transform 0.2s, box-shadow 0.2s',
      cursor: 'default',
      position: 'relative',
      overflow: 'hidden',
    }}
    className="admin-stat-card"
  >
    {/* Decorative circle */}
    <div style={{
      position: 'absolute', right: -16, bottom: -16,
      width: 100, height: 100, borderRadius: '50%',
      backgroundColor: gradient ? 'rgba(255,255,255,0.08)' : `${color}18`,
    }} />
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
      <div style={{
        width: 44, height: 44, borderRadius: 12,
        background: gradient ? 'rgba(255,255,255,0.2)' : bg,
        color: gradient ? '#fff' : color,
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
      }}>
        {icon}
      </div>
      {trend !== undefined && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 3,
          color: trend >= 0 ? (gradient ? '#a7f3d0' : '#059669') : (gradient ? '#fca5a5' : '#dc2626'),
          fontWeight: 700, fontSize: 12,
          background: gradient ? 'rgba(255,255,255,0.15)' : (trend >= 0 ? '#ecfdf5' : '#fef2f2'),
          padding: '4px 8px', borderRadius: 8,
        }}>
          {trend >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
          {Math.abs(trend)}%
        </div>
      )}
    </div>
    <div style={{ color: gradient ? 'rgba(255,255,255,0.75)' : '#64748b', fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
      {label}
    </div>
    <div style={{ fontSize: 26, fontWeight: 800, color: gradient ? '#fff' : '#0f172a', lineHeight: 1.2 }}>
      {value}
    </div>
    {trendLabel && (
      <div style={{ fontSize: 11, color: gradient ? 'rgba(255,255,255,0.6)' : '#94a3b8', marginTop: 4 }}>
        {trendLabel}
      </div>
    )}
  </div>
);

const AdminDashboard: React.FC = () => {
  const { bookings } = useModel('adminBookings');
  const { users } = useModel('adminUsers');

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
      title: 'Khách hàng',
      dataIndex: 'userName',
      key: 'userName',
      render: (text: string) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 34, height: 34, borderRadius: '50%',
            background: 'linear-gradient(135deg, #059669, #00a67d)',
            color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 700, fontSize: 13, flexShrink: 0,
          }}>
            {text.substring(0, 2).toUpperCase()}
          </div>
          <span style={{ fontWeight: 600, color: '#0f172a' }}>{text}</span>
        </div>
      ),
    },
    {
      title: 'Sân bóng',
      dataIndex: 'pitch',
      key: 'pitch',
      render: (text: string) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 14 }}>⚽</span>
          <span style={{ color: '#475569', fontWeight: 500 }}>{text}</span>
        </div>
      ),
    },
    { title: 'Thời gian', dataIndex: 'time', key: 'time', render: (text: string) => <span style={{ color: '#64748b' }}>{text}</span> },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        if (status === 'approved') return <Tag style={{ background: '#dcfce7', color: '#15803d', border: 'none', borderRadius: 8, fontWeight: 700, padding: '3px 10px' }}>✓ Đã duyệt</Tag>;
        if (status === 'pending') return <Tag style={{ background: '#fef9c3', color: '#b45309', border: 'none', borderRadius: 8, fontWeight: 700, padding: '3px 10px' }}>⏳ Chờ duyệt</Tag>;
        return <Tag style={{ background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: 8, fontWeight: 700, padding: '3px 10px' }}>✕ Từ chối</Tag>;
      },
    },
  ];

  const getAIInsight = () => {
    if (pendingCount > 0) return `Hệ thống phân tích có ${pendingCount} đơn đặt sân đang chờ. Bạn nên duyệt ngay để tối ưu lịch trống.`;
    if (totalBookings < 5) return `Doanh thu tuần này đang chậm lại. Gợi ý: Phát hành mã giảm giá 10% cho khung giờ ban ngày.`;
    return `Tình hình kinh doanh tốt! Khung giờ 17h–19h đang kín lịch. Gợi ý tăng giá 5% vào tuần sau để tối ưu doanh thu.`;
  };

  return (
    <PageContainer
      header={{
        title: (
          <div>
            <Title level={2} style={{ margin: 0, fontWeight: 800, color: '#0f172a' }}>Tổng quan hệ thống</Title>
            <Text style={{ color: '#94a3b8', fontSize: 13, fontWeight: 400 }}>
              Dữ liệu đồng bộ trực tiếp · Cập nhật lúc {new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </div>
        ),
      }}
    >
      <Row gutter={[20, 20]}>
        {/* Stat Cards */}
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            icon={<WalletOutlined />}
            label="Doanh thu dự kiến"
            value={`${(totalRevenue / 1e6).toFixed(1)}M đ`}
            trend={12}
            trendLabel="So với tuần trước"
            color="#059669"
            bg="#dcfce7"
            gradient="linear-gradient(135deg, #059669 0%, #047857 100%)"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            icon={<CalendarOutlined />}
            label="Tổng lượt đặt sân"
            value={`${totalBookings} lượt`}
            trend={8}
            trendLabel="Tuần này"
            color="#2563eb"
            bg="#dbeafe"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            icon={<PieChartOutlined />}
            label="Tỷ lệ lấp đầy"
            value={`${Math.min(100, totalBookings * 10)}%`}
            trend={-3}
            trendLabel="So với hôm qua"
            color="#d97706"
            bg="#fef3c7"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            icon={<UsergroupAddOutlined />}
            label="Người dùng mới"
            value={`${newUsers}`}
            trend={5}
            trendLabel="Tháng này"
            color="#7c3aed"
            bg="#ede9fe"
          />
        </Col>

        {/* Revenue Bar Chart */}
        <Col xs={24} lg={16}>
          <Card
            bordered={false}
            style={{ borderRadius: 16, border: '1px solid #e2e8f0', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
            bodyStyle={{ padding: 28 }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>Phân tích doanh thu AI</div>
                <Text style={{ color: '#94a3b8', fontSize: 13 }}>Ước tính theo lịch đặt sân hiện tại · 7 ngày qua</Text>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#94a3b8', fontSize: 12 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 3, backgroundColor: '#059669' }} /> Doanh thu
                </div>
              </div>
            </div>
            <div style={{ height: 260 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }}
                    tickFormatter={(val) => `${(val / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    formatter={(val: any) => [`${Number(val).toLocaleString()}đ`, 'Doanh thu']}
                    contentStyle={{ borderRadius: 10, border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.12)', fontSize: 13 }}
                  />
                  <Bar dataKey="amount" fill="url(#greenGradient)" radius={[6, 6, 0, 0]} />
                  <defs>
                    <linearGradient id="greenGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#059669" />
                      <stop offset="100%" stopColor="#34d399" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>

        {/* AI Insights + Pie Chart */}
        <Col xs={24} lg={8}>
          <Card
            bordered={false}
            style={{ borderRadius: 16, border: '1px solid #e2e8f0', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', height: '100%' }}
            bodyStyle={{ padding: 24 }}
          >
            {/* AI Box */}
            <div style={{
              padding: 16, borderRadius: 12,
              background: 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)',
              border: '1px solid #ddd6fe', marginBottom: 24,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: 8, background: '#7c3aed',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <RobotOutlined style={{ color: '#fff', fontSize: 14 }} />
                </div>
                <span style={{ fontWeight: 700, color: '#5b21b6', fontSize: 13 }}>AI Insights</span>
              </div>
              <div style={{ color: '#4c1d95', fontSize: 13, lineHeight: 1.6 }}>{getAIInsight()}</div>
            </div>

            <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>Khung giờ phổ biến</div>
            <Text style={{ color: '#94a3b8', fontSize: 12 }}>Phân bổ loại giờ đặt sân</Text>

            <div style={{ height: 160, marginTop: 8 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%" cy="50%"
                    innerRadius={48} outerRadius={72}
                    dataKey="value"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    stroke="none"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(val: any) => [`${val}%`, '']} contentStyle={{ borderRadius: 10, border: 'none', fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Legend */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 4 }}>
              {pieData.map(d => (
                <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 3, backgroundColor: d.color, flexShrink: 0 }} />
                  <span style={{ color: '#64748b', flex: 1 }}>{d.name}</span>
                  <span style={{ fontWeight: 700, color: '#0f172a' }}>{d.value}%</span>
                </div>
              ))}
            </div>
          </Card>
        </Col>

        {/* Booking Table */}
        <Col xs={24}>
          <Card
            bordered={false}
            style={{ borderRadius: 16, border: '1px solid #e2e8f0', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', overflow: 'hidden' }}
            bodyStyle={{ padding: 0 }}
          >
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '20px 24px', borderBottom: '1px solid #f1f5f9',
            }}>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#0f172a' }}>Danh sách lịch đặt</div>
                <Text style={{ color: '#94a3b8', fontSize: 12 }}>Toàn bộ hệ thống · {bookings.length} lượt</Text>
              </div>
              {pendingCount > 0 && (
                <div style={{
                  background: '#fef9c3', color: '#b45309', padding: '6px 14px',
                  borderRadius: 20, fontWeight: 700, fontSize: 12,
                  border: '1px solid #fde68a',
                }}>
                  ⚠ {pendingCount} đơn chờ duyệt
                </div>
              )}
            </div>
            <Table
              columns={columns}
              dataSource={bookings}
              pagination={{ pageSize: 5, size: 'small' }}
              rowKey="id"
              style={{ borderRadius: 0 }}
            />
          </Card>
        </Col>
      </Row>
    </PageContainer>
  );
};

export default AdminDashboard;