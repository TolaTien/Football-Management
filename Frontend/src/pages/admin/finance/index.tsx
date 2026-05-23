import React from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { Row, Col, Button, Typography } from 'antd';
import {
  DownloadOutlined, WalletOutlined,
  TransactionOutlined, ReloadOutlined, CheckCircleOutlined,
} from '@ant-design/icons';
import { FinanceStatCard } from './components/FinanceStatCard';
import { RevenueStructure } from './components/RevenueStructure';
import { RevenueTrend } from './components/RevenueTrend';
import { TransactionHistoryTable } from './components/TransactionHistoryTable';

const { Text } = Typography;

// Constants
const VIETNAMESE_DONG_TO_MILLION = 1000000;
const VIETNAMESE_DONG_TO_THOUSAND = 1000;
const TOTAL_REVENUE_AMOUNT = 68700000;

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

const AdminFinance: React.FC = () => {
  const totalRevenue = TOTAL_REVENUE_AMOUNT;
  const totalTxn = transactionData.length;
  const successTxn = transactionData.filter(t => t.status === 'success').length;
  const refundedAmount = transactionData.filter(t => t.status === 'refunded').reduce((s, t) => s + t.amount, 0);

  const successPercentage = totalTxn > 0 ? Math.round((successTxn / totalTxn) * 100) : 0;

  const summaryItems = [
    {
      icon: <WalletOutlined />,
      label: 'Tổng doanh thu',
      value: `${(totalRevenue / VIETNAMESE_DONG_TO_MILLION).toFixed(1)}M đ`,
      trend: '+14%',
      color: '#059669',
      bg: '#dcfce7',
      gradient: 'linear-gradient(135deg, #059669 0%, #047857 100%)'
    },
    {
      icon: <TransactionOutlined />,
      label: 'Giao dịch tháng này',
      value: `${totalTxn} GD`,
      trend: '+8%',
      color: '#2563eb',
      bg: '#dbeafe'
    },
    {
      icon: <CheckCircleOutlined />,
      label: 'Thành công',
      value: `${successTxn} GD`,
      trend: `${successPercentage}%`,
      color: '#7c3aed',
      bg: '#ede9fe'
    },
    {
      icon: <ReloadOutlined />,
      label: 'Hoàn tiền',
      value: `${(refundedAmount / VIETNAMESE_DONG_TO_THOUSAND).toFixed(0)}K đ`,
      trend: '-2%',
      color: '#dc2626',
      bg: '#fee2e2'
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
        {summaryItems.map((item, i) => (
          <Col xs={24} sm={12} lg={6} key={i}>
            <FinanceStatCard
              icon={item.icon}
              label={item.label}
              value={item.value}
              trend={item.trend}
              color={item.color}
              bg={item.bg}
              gradient={item.gradient}
            />
          </Col>
        ))}
      </Row>

      <Row gutter={[20, 20]}>
        {/* Pie Chart */}
        <Col xs={24} md={8}>
          <RevenueStructure data={revenueBreakdown} totalRevenue={totalRevenue} />
        </Col>

        {/* Area Chart + Table */}
        <Col xs={24} md={16}>
          {/* Trend chart */}
          <RevenueTrend data={trendData} />

          {/* Transaction Table */}
          <TransactionHistoryTable data={transactionData} />
        </Col>
      </Row>
    </PageContainer>
  );
};

export default AdminFinance;