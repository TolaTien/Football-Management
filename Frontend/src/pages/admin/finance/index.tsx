import React, { useState } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { Card, Table, Tag, Row, Col, DatePicker, Select, Space, Button, Typography } from 'antd';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend, AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts';
import {
  DownloadOutlined, WalletOutlined, ArrowUpOutlined,
  TransactionOutlined, ReloadOutlined, CheckCircleOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import axios from 'axios'; // We can use axios for this

const { RangePicker } = DatePicker;
const { Text } = Typography;

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

const trendData = [
  { day: 'T2', revenue: 8400000 },
  { day: 'T3', revenue: 12000000 },
  { day: 'T4', revenue: 9500000 },
  { day: 'T5', revenue: 14000000 },
  { day: 'T6', revenue: 18000000 },
  { day: 'T7', revenue: 22000000 },
  { day: 'CN', revenue: 16000000 },
];

const COLORS = ['#059669', '#34d399', '#fbbf24', '#f87171'];

const METHOD_STYLES: Record<string, { bg: string; color: string; icon: string }> = {
  'Chuyển khoản': { bg: '#dbeafe', color: '#1d4ed8', icon: '🏦' },
  'Tiền mặt':     { bg: '#dcfce7', color: '#15803d', icon: '💵' },
  'Ví điện tử':   { bg: '#ede9fe', color: '#6d28d9', icon: '📱' },
};

const AdminFinance: React.FC = () => {
  const totalRevenue = 68700000;
  const totalTxn = transactionData.length;
  const successTxn = transactionData.filter(t => t.status === 'success').length;
  const refundedAmount = transactionData.filter(t => t.status === 'refunded').reduce((s, t) => s + t.amount, 0);

  const columns = [
    {
      title: 'Mã GD',
      dataIndex: 'id',
      key: 'id',
      render: (text: string) => (
        <span style={{
          fontFamily: 'monospace', fontSize: 12, fontWeight: 700,
          background: '#f1f5f9', padding: '3px 8px', borderRadius: 6, color: '#475569',
        }}>
          {text}
        </span>
      ),
    },
    {
      title: 'Khách hàng',
      dataIndex: 'user',
      key: 'user',
      render: (text: string) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 30, height: 30, borderRadius: '50%',
            background: 'linear-gradient(135deg, #059669, #34d399)',
            color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 700, fontSize: 11, flexShrink: 0,
          }}>
            {text.substring(0, 2).toUpperCase()}
          </div>
          <span style={{ fontWeight: 600, color: '#0f172a', fontSize: 13 }}>{text}</span>
        </div>
      ),
    },
    { title: 'Loại', dataIndex: 'type', key: 'type', render: (text: string) => <Text style={{ color: '#475569', fontSize: 13 }}>{text}</Text> },
    {
      title: 'Phương thức',
      dataIndex: 'method',
      key: 'method',
      render: (method: string) => {
        const cfg = METHOD_STYLES[method] || { bg: '#f1f5f9', color: '#475569', icon: '💳' };
        return (
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            padding: '3px 10px', borderRadius: 20,
            backgroundColor: cfg.bg, color: cfg.color,
            fontWeight: 600, fontSize: 12,
          }}>
            {cfg.icon} {method}
          </div>
        );
      },
    },
    {
      title: 'Số tiền',
      dataIndex: 'amount',
      key: 'amount',
      render: (val: number, record: any) => (
        <div>
          <div style={{ fontWeight: 800, fontSize: 14, color: record.status === 'refunded' ? '#dc2626' : '#059669' }}>
            {record.status === 'refunded' ? '-' : '+'}{val.toLocaleString()}đ
          </div>
          <div style={{ fontSize: 10, color: '#cbd5e1' }}>{record.date}</div>
        </div>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        if (status === 'success') return (
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 10px', borderRadius: 20, background: '#dcfce7', color: '#15803d', fontWeight: 700, fontSize: 11 }}>
            <CheckCircleOutlined /> Thành công
          </div>
        );
        if (status === 'refunded') return (
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 10px', borderRadius: 20, background: '#fee2e2', color: '#dc2626', fontWeight: 700, fontSize: 11 }}>
            <ReloadOutlined /> Hoàn tiền
          </div>
        );
        return <Tag>Chờ xử lý</Tag>;
      },
    },
  ];

  return (
    <PageContainer
      header={{
        title: (
          <div>
            <div style={{ fontWeight: 800, fontSize: 22, color: '#0f172a' }}>Báo cáo & Tài chính</div>
            <Text style={{ color: '#94a3b8', fontSize: 13 }}>Theo dõi dòng tiền và phân tích cơ cấu doanh thu</Text>
          </div>
        ),
        extra: [
          <Button key="export" icon={<DownloadOutlined />} style={{ height: 40, fontWeight: 600, borderRadius: 10 }}>
            Xuất Excel
          </Button>,
        ],
      }}
    >
      {/* Summary Stats */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {[
          { icon: <WalletOutlined />, label: 'Tổng doanh thu', value: `${(totalRevenue / 1e6).toFixed(1)}M đ`, trend: '+14%', color: '#059669', bg: '#dcfce7', gradient: 'linear-gradient(135deg, #059669 0%, #047857 100%)' },
          { icon: <TransactionOutlined />, label: 'Giao dịch tháng này', value: `${totalTxn} GD`, trend: '+8%', color: '#2563eb', bg: '#dbeafe', gradient: undefined },
          { icon: <CheckCircleOutlined />, label: 'Thành công', value: `${successTxn} GD`, trend: `${Math.round(successTxn/totalTxn*100)}%`, color: '#7c3aed', bg: '#ede9fe', gradient: undefined },
          { icon: <ReloadOutlined />, label: 'Hoàn tiền', value: `${(refundedAmount/1000).toFixed(0)}K đ`, trend: '-2%', color: '#dc2626', bg: '#fee2e2', gradient: undefined },
        ].map((item, i) => (
          <Col xs={24} sm={12} lg={6} key={i}>
            <div style={{
              background: item.gradient || 'white',
              borderRadius: 16, padding: '20px 22px',
              border: item.gradient ? 'none' : '1px solid #e2e8f0',
              boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
              position: 'relative', overflow: 'hidden',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }} className="admin-stat-card">
              <div style={{ position: 'absolute', right: -12, bottom: -12, width: 80, height: 80, borderRadius: '50%', backgroundColor: item.gradient ? 'rgba(255,255,255,0.08)' : `${item.color}12` }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: item.gradient ? 'rgba(255,255,255,0.2)' : item.bg,
                  color: item.gradient ? '#fff' : item.color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
                }}>
                  {item.icon}
                </div>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 3,
                  color: item.gradient ? '#a7f3d0' : (item.trend.startsWith('+') ? '#059669' : '#dc2626'),
                  background: item.gradient ? 'rgba(255,255,255,0.15)' : (item.trend.startsWith('+') ? '#dcfce7' : '#fee2e2'),
                  padding: '3px 8px', borderRadius: 8, fontWeight: 700, fontSize: 11,
                }}>
                  {item.trend.startsWith('+') ? <ArrowUpOutlined /> : null}
                  {item.trend}
                </div>
              </div>
              <div style={{ color: item.gradient ? 'rgba(255,255,255,0.75)' : '#64748b', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>{item.label}</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: item.gradient ? '#fff' : '#0f172a' }}>{item.value}</div>
            </div>
          </Col>
        ))}
      </Row>

      <Row gutter={[20, 20]}>
        {/* Pie Chart */}
        <Col xs={24} md={8}>
          <Card
            bordered={false}
            style={{ borderRadius: 16, border: '1px solid #e2e8f0', height: '100%', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
            bodyStyle={{ padding: 24 }}
          >
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontWeight: 700, fontSize: 15, color: '#0f172a' }}>Cơ cấu doanh thu</div>
              <Text style={{ color: '#94a3b8', fontSize: 12 }}>Phân tích theo nguồn thu tháng này</Text>
            </div>
            <div style={{ height: 220 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={revenueBreakdown}
                    cx="50%" cy="50%"
                    innerRadius={55} outerRadius={80}
                    paddingAngle={4} dataKey="value"
                    stroke="none"
                  >
                    {revenueBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${Number(value).toLocaleString()}đ`} contentStyle={{ borderRadius: 10, border: 'none', fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            {/* Center label */}
            <div style={{ textAlign: 'center', marginTop: -8, marginBottom: 16 }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: '#059669' }}>
                {(totalRevenue / 1e6).toFixed(1)}M đ
              </div>
              <div style={{ color: '#94a3b8', fontSize: 11, fontWeight: 600 }}>Tổng doanh thu</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {revenueBreakdown.map((item, i) => (
                <div key={item.name} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 3, backgroundColor: COLORS[i], flexShrink: 0 }} />
                  <span style={{ color: '#64748b', fontSize: 12, flex: 1 }}>{item.name}</span>
                  <span style={{ fontWeight: 700, color: '#0f172a', fontSize: 12 }}>{(item.value / 1e6).toFixed(1)}M</span>
                </div>
              ))}
            </div>
          </Card>
        </Col>

        {/* Area Chart + Table */}
        <Col xs={24} md={16}>
          {/* Trend chart */}
          <Card
            bordered={false}
            style={{ borderRadius: 16, border: '1px solid #e2e8f0', marginBottom: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
            bodyStyle={{ padding: 24 }}
          >
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontWeight: 700, fontSize: 15, color: '#0f172a' }}>Xu hướng doanh thu 7 ngày</div>
              <Text style={{ color: '#94a3b8', fontSize: 12 }}>Biến động doanh thu theo từng ngày trong tuần</Text>
            </div>
            <div style={{ height: 160 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
                  <defs>
                    <linearGradient id="areaGreen" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#059669" stopOpacity={0.2} />
                      <stop offset="100%" stopColor="#059669" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} tickFormatter={v => `${(v/1e6).toFixed(0)}M`} />
                  <Tooltip formatter={(val: any) => [`${Number(val).toLocaleString()}đ`, 'Doanh thu']} contentStyle={{ borderRadius: 10, border: 'none', fontSize: 12 }} />
                  <Area type="monotone" dataKey="revenue" stroke="#059669" strokeWidth={2.5} fill="url(#areaGreen)" dot={{ fill: '#059669', strokeWidth: 0, r: 4 }} activeDot={{ r: 6 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Transaction Table */}
          <Card
            bordered={false}
            style={{ borderRadius: 16, border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
            bodyStyle={{ padding: 0 }}
          >
            <div style={{ padding: '16px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
              <div>
                <div style={{ fontWeight: 700, color: '#0f172a', fontSize: 15 }}>Lịch sử giao dịch</div>
                <Text style={{ color: '#94a3b8', fontSize: 12 }}>{transactionData.length} giao dịch gần nhất</Text>
              </div>
              <Space wrap>
                <RangePicker
                  defaultValue={[dayjs().subtract(7, 'days'), dayjs()]}
                  format="DD/MM/YYYY"
                  style={{ borderRadius: 8 }}
                />
                <Select defaultValue="all" style={{ width: 130 }} size="middle" options={[
                  { value: 'all', label: 'Tất cả TT' },
                  { value: 'success', label: 'Thành công' },
                  { value: 'refunded', label: 'Hoàn tiền' },
                ]} />
              </Space>
            </div>
            <Table
              columns={columns}
              dataSource={transactionData}
              rowKey="id"
              pagination={{ pageSize: 5, size: 'small' }}
              style={{ borderRadius: 0 }}
            />
          </Card>
        </Col>
      </Row>
    </PageContainer>
  );
};

export default AdminFinance;
