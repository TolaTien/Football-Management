import React, { useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { Row, Col, Button, Typography, Select, message } from 'antd';
import {
  DownloadOutlined, WalletOutlined,
  TransactionOutlined, ReloadOutlined, CheckCircleOutlined,
} from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '@/shared/model/hooks';
import { fetchAllBookings } from '@/entities/booking/model/bookingSlice';
import { fetchMonthlyRevenue, fetchSystemOverview } from '@/entities/statistic/model/statisticSlice';
import { statisticService } from '@/entities/statistic/api/statisticService';
import { FinanceStatCard, RevenueStructure, RevenueTrend, TransactionHistoryTable } from '@/widgets/admin-finance-reports';

const { Text } = Typography;

// Constants
const VIETNAMESE_DONG_TO_MILLION = 1_000_000;
const VIETNAMESE_DONG_TO_THOUSAND = 1_000;

// Mock revenue breakdown ratios (backend không có endpoint phân loại doanh thu theo danh mục)
const REVENUE_BREAKDOWN_LABELS = ['Tiền thuê sân', 'Nước giải khát', 'Thuê áo, bóng', 'Tổ chức giải đấu'];
const REVENUE_BREAKDOWN_RATIOS = [0.655, 0.124, 0.046, 0.175];

// Mock weekly ratios (backend không có breakdown doanh thu theo ngày trong tuần)
const DAY_LABELS = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
const DAY_RATIOS = [0.1, 0.15, 0.2, 0.1, 0.25, 0.15, 0.05];

const AdminFinance: React.FC = () => {
  const dispatch = useAppDispatch();
  const [address, setAddress] = useState<string>('');

  const { bookings } = useAppSelector((state) => state.booking);
  const { revenue, overview } = useAppSelector((state) => state.statistic);

  useEffect(() => {
    dispatch(fetchAllBookings());
    dispatch(fetchMonthlyRevenue({ address: address || undefined }));
    dispatch(fetchSystemOverview(address || undefined));
  }, [dispatch, address]);

  // ── Derived stats from real API data ──────────────────────────────────────
  const totalRevenue = revenue?.totalRevenue ?? 0;
  const totalBookings = revenue?.totalBookings ?? 0;

  const successTxn = bookings.filter((b) => b.paymentStatus === 'paid').length;
  const refundedTxn = bookings.filter((b) => b.status === 'cancelled').length;
  const refundedAmount = refundedTxn * (totalRevenue > 0 && totalBookings > 0 ? totalRevenue / totalBookings : 0);
  const successPercentage = totalBookings > 0 ? Math.round((successTxn / totalBookings) * 100) : 0;

  // Revenue breakdown – dùng tỷ lệ mock nhưng số tổng lấy từ API
  const revenueBreakdown = REVENUE_BREAKDOWN_LABELS.map((name, i) => ({
    name,
    value: Math.round(totalRevenue * REVENUE_BREAKDOWN_RATIOS[i]),
  }));

  // Weekly trend – dùng tỷ lệ mock nhưng số tổng lấy từ API
  const trendData = DAY_LABELS.map((day, i) => ({
    day,
    revenue: Math.round(totalRevenue * DAY_RATIOS[i]),
  }));

  // Transaction table – lấy từ bookings thực
  const transactionData = bookings.slice(0, 20).map((b) => ({
    id: b.id.substring(0, 8).toUpperCase(),
    date: `${b.date} ${b.startTime}`,
    user: b.userName,
    type: 'Đặt sân',
    amount: b.price,
    method: b.paymentStatus === 'paid' ? 'Chuyển khoản' : 'Tiền mặt',
    status: (b.paymentStatus === 'paid'
      ? 'success'
      : b.status === 'cancelled'
        ? 'refunded'
        : 'pending') as 'success' | 'refunded' | 'pending',
  }));

  // ── Stat cards ─
  const summaryItems = [
    {
      icon: <WalletOutlined />,
      label: 'Tổng doanh thu',
      value: `${(totalRevenue / VIETNAMESE_DONG_TO_MILLION).toFixed(1)}M đ`,
      trend: `${revenue?.rate ?? 0}%`,
      color: '#059669',
      bg: '#dcfce7',
      gradient: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
    },
    {
      icon: <TransactionOutlined />,
      label: 'Tổng lượt đặt sân',
      value: `${totalBookings} lượt`,
      trend: `+${overview?.totalPendingRequests ?? 0} chờ`,
      color: '#2563eb',
      bg: '#dbeafe',
    },
    {
      icon: <CheckCircleOutlined />,
      label: 'Đã thanh toán',
      value: `${successTxn} lượt`,
      trend: `${successPercentage}%`,
      color: '#7c3aed',
      bg: '#ede9fe',
    },
    {
      icon: <ReloadOutlined />,
      label: 'Hoàn tiền',
      value: `${(refundedAmount / VIETNAMESE_DONG_TO_THOUSAND).toFixed(0)}K đ`,
      trend: `${refundedTxn} lượt`,
      color: '#dc2626',
      bg: '#fee2e2',
    },
  ];

  // ── Export Excel ──
  const handleExportExcel = async () => {
    try {
      message.loading('Đang khởi tạo tệp báo cáo...', 1.5);
      const res = await statisticService.exportRevenueExcel({ address: address || undefined });
      const blob = new Blob([res.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Bao_Cao_Doanh_Thu_${address || 'He_Thong'}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      message.success('Xuất báo cáo doanh thu Excel thành công!');
    } catch {
      message.error('Gặp lỗi khi tải tệp báo cáo.');
    }
  };

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
          <Select
            key="address"
            placeholder="Lọc địa điểm"
            style={{ width: 160 }}
            allowClear
            onChange={(value) => setAddress(value || '')}
            options={[
              { value: 'Hà Nội', label: 'Hà Nội' },
              { value: 'Hồ Chí Minh', label: 'Hồ Chí Minh' },
            ]}
          />,
          <Button
            key="export"
            icon={<DownloadOutlined />}
            onClick={handleExportExcel}
            style={{ height: 40, fontWeight: 600, borderRadius: 10 }}
          >
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
          <RevenueTrend data={trendData} />
          <TransactionHistoryTable data={transactionData} />
        </Col>
      </Row>
    </PageContainer>
  );
};

export default AdminFinance;