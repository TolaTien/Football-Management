import React, { useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { Row, Col, Typography, Select, Button, message } from 'antd';
import { DownloadOutlined, WalletOutlined, CalendarOutlined, UsergroupAddOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { fetchAllBookings } from '@/entities/booking/model/bookingSlice';
import { fetchPitches } from '@/entities/pitch/model/pitchSlice';
import { StatCard, fetchSystemOverview, fetchMonthlyRevenue, statisticService } from '@/entities/statistic';
import { RevenueChart } from '@/widgets/admin-revenue-chart';
import { HourlyDistribution } from '@/widgets/admin-hourly-distribution';
import { RecentBookingsTable } from '@/widgets/admin-recent-bookings';

const { Title, Text } = Typography;

import dayjs from 'dayjs';

// Constants
const VIETNAMESE_DONG_TO_MILLION = 1000000;

const AdminDashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const [address, setAddress] = useState<string>('');

  const { bookings } = useAppSelector((state) => state.booking);
  const { pitches } = useAppSelector((state) => state.pitch);
  const { overview, revenue } = useAppSelector((state) => state.statistic);

  useEffect(() => {
    dispatch(fetchAllBookings());
    dispatch(fetchPitches());
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

  const {
    revenueData,
  } = React.useMemo(() => {
    const today = dayjs();
    const days = [
      { name: 'T2', dayOffset: 0 },
      { name: 'T3', dayOffset: 1 },
      { name: 'T4', dayOffset: 2 },
      { name: 'T5', dayOffset: 3 },
      { name: 'T6', dayOffset: 4 },
      { name: 'T7', dayOffset: 5 },
      { name: 'CN', dayOffset: 6 },
    ];
    const mondayOfWeek = today.startOf('week');
    const revData = days.map(({ name, dayOffset }) => {
      const targetDateStr = mondayOfWeek.add(dayOffset, 'day').format('YYYY-MM-DD');
      const dayBookings = bookings.filter(
        (b) => b.date === targetDateStr && b.status === 'approved'
      );
      const amount = dayBookings.reduce((sum, b) => sum + (b.price || 0), 0);
      return { name, amount };
    });

    return {
      revenueData: revData,
    };
  }, [bookings]);

  const currentTimeString = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });

  return (
    <PageContainer
      header={{
        title: (
          <div>
            <Title level={2} className="m-0 font-extrabold text-2xl text-slate-800">Tổng quan hệ thống</Title>
            <Text className="text-slate-400 text-xs font-normal mt-1 block">
              Dữ liệu đồng bộ trực tiếp · Cập nhật lúc {currentTimeString}
            </Text>
          </div>
        ),
        extra: [
          <Button
            key="export"
            type="primary"
            icon={<DownloadOutlined />}
            onClick={handleExportExcel}
            className="h-10 px-5 font-bold rounded-xl bg-emerald-650 border-emerald-650 hover:bg-emerald-755 hover:border-emerald-755 shadow-md shadow-emerald-600/10 flex items-center"
          >
            Xuất Excel
          </Button>
        ]
      }}
    >
      <Row gutter={[20, 20]}>
        {/* Stat Cards Row */}
        <Col xs={24} md={8}>
          <StatCard
            icon={<WalletOutlined />}
            label="Doanh thu thực tế"
            value={`${(totalRevenue / VIETNAMESE_DONG_TO_MILLION).toFixed(1)}M đ`}
            trendLabel="So với tuần trước"
            color="#059669"
            bg="#dcfce7"
            gradient="linear-gradient(135deg, #059669 0%, #047857 100%)"
          />
        </Col>
        <Col xs={24} md={8}>
          <StatCard
            icon={<CalendarOutlined />}
            label="Tổng lượt đặt sân"
            value={`${totalBookings} lượt`}
            trendLabel="Tuần này"
            color="#2563eb"
            bg="#dbeafe"
          />
        </Col>
        <Col xs={24} md={8}>
          <StatCard
            icon={<UsergroupAddOutlined />}
            label="Tổng thành viên"
            value={`${totalUsers}`}
            trendLabel="Tháng này"
            color="#7c3aed"
            bg="#ede9fe"
          />
        </Col>

        {/* Revenue Bar Chart */}
        <Col xs={24} lg={16}>
          <RevenueChart data={revenueData} />
        </Col>

        {/* Pie Chart */}
        <Col xs={24} lg={8}>
          <HourlyDistribution bookings={bookings} pitches={pitches} />
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
