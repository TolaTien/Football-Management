import React, { useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { Row, Col, Typography, Select, Button, message } from 'antd';
import { DownloadOutlined, WalletOutlined, CalendarOutlined, PieChartOutlined, UsergroupAddOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '@/shared/model/hooks';
import { fetchAllBookings } from '@/entities/booking/model/bookingSlice';
import { fetchSystemOverview, fetchMonthlyRevenue } from '@/entities/statistic/model/statisticSlice';
import { statisticService } from '@/entities/statistic/api/statisticService';
import { StatCard, RevenueChart, HourlyDistribution } from '@/widgets/admin-dashboard-stats';
import { RecentBookingsTable } from '@/widgets/admin-recent-bookings';

const { Title, Text } = Typography;

// Constants
const VIETNAMESE_DONG_TO_MILLION = 1000000;
const REVENUE_TREND_PERCENTAGE = 12;
const BOOKINGS_TREND_PERCENTAGE = 8;
const CAPACITY_TREND_PERCENTAGE = -3;
const NEW_USERS_TREND_PERCENTAGE = 5;

// Mock revenue distribution ratios (sum = 1.0)
const RATIOS = {
  MON: 0.1,
  TUE: 0.15,
  WED: 0.2,
  THU: 0.1,
  FRI: 0.25,
  SAT: 0.15,
  SUN: 0.05,
};

const AdminDashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const [address, setAddress] = useState<string>('');
  
  const { bookings } = useAppSelector((state) => state.booking);
  const { overview, revenue } = useAppSelector((state) => state.statistic);

  useEffect(() => {
    dispatch(fetchAllBookings());
    dispatch(fetchSystemOverview(address || undefined));
    dispatch(fetchMonthlyRevenue({ address: address || undefined }));
  }, [dispatch, address]);

  const handleExportExcel = async () => {
    try {
      message.loading('Đang khởi tạo tệp báo cáo...', 1.5);
      const res = await statisticService.exportRevenueExcel({ address: address || undefined });
      const blob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
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

  const totalRevenue = revenue?.totalRevenue ?? 0;
  const totalBookings = revenue?.totalBookings ?? 0;
  const totalUsers = overview?.totalUsers ?? 0;
  const pendingCount = overview?.totalPendingRequests ?? 0;
  const fillRate = revenue?.rate ?? 0;

  const revenueData = [
    { name: 'T2', amount: totalRevenue * RATIOS.MON },
    { name: 'T3', amount: totalRevenue * RATIOS.TUE },
    { name: 'T4', amount: totalRevenue * RATIOS.WED },
    { name: 'T5', amount: totalRevenue * RATIOS.THU },
    { name: 'T6', amount: totalRevenue * RATIOS.FRI },
    { name: 'T7', amount: totalRevenue * RATIOS.SAT },
    { name: 'CN', amount: totalRevenue * RATIOS.SUN },
  ];

  const getAIInsight = () => {
    if (pendingCount > 0) {
      return `Hệ thống phân tích có ${pendingCount} đơn đặt sân đang chờ. Bạn nên duyệt ngay để tối ưu lịch trống.`;
    }
    if (totalBookings < 5) {
      return `Doanh thu tuần này đang chậm lại. Gợi ý: Phát hành mã giảm giá 10% cho khung giờ ban ngày.`;
    }
    return `Tình hình kinh doanh tốt! Khung giờ 17h–19h đang kín lịch. Gợi ý tăng giá 5% vào tuần sau để tối ưu doanh thu.`;
  };

  const currentTimeString = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });

  return (
    <PageContainer
      header={{
        title: (
          <div>
            <Title level={2} style={{ margin: 0, fontWeight: 800, color: '#0f172a' }}>Tổng quan hệ thống</Title>
            <Text style={{ color: '#94a3b8', fontSize: 13, fontWeight: 400 }}>
              Dữ liệu đồng bộ trực tiếp · Cập nhật lúc {currentTimeString}
            </Text>
          </div>
        ),
        extra: [
          <Select
            key="address"
            placeholder="Lọc địa điểm"
            style={{ width: 180 }}
            allowClear
            onChange={(value) => setAddress(value || '')}
            options={[
              { value: 'Hà Nội', label: 'Hà Nội' },
              { value: 'Hồ Chí Minh', label: 'Hồ Chí Minh' },
            ]}
          />,
          <Button
            key="export"
            type="primary"
            icon={<DownloadOutlined />}
            onClick={handleExportExcel}
            style={{ backgroundColor: '#059669', borderColor: '#059669' }}
          >
            Xuất Excel
          </Button>
        ]
      }}
    >
      <Row gutter={[20, 20]}>
        {/* Stat Cards */}
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            icon={<WalletOutlined />}
            label="Doanh thu thực tế"
            value={`${(totalRevenue / VIETNAMESE_DONG_TO_MILLION).toFixed(1)}M đ`}
            trend={REVENUE_TREND_PERCENTAGE}
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
            trend={BOOKINGS_TREND_PERCENTAGE}
            trendLabel="Tuần này"
            color="#2563eb"
            bg="#dbeafe"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            icon={<PieChartOutlined />}
            label="Tỷ lệ lấp đầy"
            value={`${fillRate}%`}
            trend={CAPACITY_TREND_PERCENTAGE}
            trendLabel="So với hôm qua"
            color="#d97706"
            bg="#fef3c7"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            icon={<UsergroupAddOutlined />}
            label="Tổng thành viên"
            value={`${totalUsers}`}
            trend={NEW_USERS_TREND_PERCENTAGE}
            trendLabel="Tháng này"
            color="#7c3aed"
            bg="#ede9fe"
          />
        </Col>

        {/* Revenue Bar Chart */}
        <Col xs={24} lg={16}>
          <RevenueChart data={revenueData} />
        </Col>

        {/* AI Insights + Pie Chart */}
        <Col xs={24} lg={8}>
          <HourlyDistribution insight={getAIInsight()} />
        </Col>

        {/* Booking Table */}
        <Col xs={24}>
          <RecentBookingsTable bookings={bookings} pendingCount={pendingCount} />
        </Col>
      </Row>
    </PageContainer>
  );
};

export default AdminDashboard;
