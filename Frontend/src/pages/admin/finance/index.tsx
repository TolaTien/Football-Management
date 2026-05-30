import React, { useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { Row, Col, Button, Typography, message } from 'antd';
import {
  DownloadOutlined, WalletOutlined,
  TransactionOutlined, ReloadOutlined, CheckCircleOutlined,
} from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { fetchAllBookings } from '@/entities/booking/model/bookingSlice';
import { fetchMonthlyRevenue, fetchSystemOverview } from '@/entities/statistic/model/statisticSlice';
import { statisticService } from '@/entities/statistic/api/statisticService';
import dayjs from 'dayjs';

// FSD Imports
import { FinanceStatCard } from '@/widgets/admin-finance-stats';
import { RevenueStructure } from '@/widgets/admin-revenue-structure';
import { TransactionHistoryTable } from '@/widgets/admin-transaction-history';

const { Text } = Typography;

const VIETNAMESE_DONG_TO_MILLION = 1_000_000;
const VIETNAMESE_DONG_TO_THOUSAND = 1_000;

const AdminFinance: React.FC = () => {
  const dispatch = useAppDispatch();

  const { bookings } = useAppSelector((state) => state.booking);
  const { revenue, overview } = useAppSelector((state) => state.statistic);

  // Bộ lọc lịch đơn lẻ (mặc định null để hiện tất cả doanh thu) & Trạng thái thanh toán
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    dispatch(fetchAllBookings());
    dispatch(fetchMonthlyRevenue({}));
    dispatch(fetchSystemOverview(undefined));
  }, [dispatch]);

  // 1. Lọc bookings theo ngày được chọn (nếu là null thì hiện tất cả để về tổng doanh thu)
  const filteredBookings = bookings.filter((b) => {
    if (selectedDate) {
      const selectedStr = selectedDate.format('YYYY-MM-DD');
      return b.date === selectedStr;
    }
    return true;
  });

  // 2. Tính toán doanh thu chi tiết từ DB
  const activeBookings = filteredBookings.filter(
    (b) => b.status === 'approved' && ['paid', 'deposited'].includes(b.paymentStatus)
  );

  // Doanh thu sân gốc
  const dbPitchRevenue = activeBookings.reduce((sum, b) => sum + (b.pitchPriceAtBooking ?? 0), 0);

  // Tổng doanh thu dịch vụ (chênh lệch giữa tổng thanh toán và tiền sân gốc)
  const dbTotalServiceRevenue = activeBookings.reduce((sum, b) => {
    const diff = (b.total ?? 0) - (b.pitchPriceAtBooking ?? 0);
    return sum + (diff > 0 ? diff : 0);
  }, 0);

  // Phân bổ tỉ lệ dịch vụ: Nước uống (60%) và Áo/Bóng (40%), làm tròn chục nghìn để đảm bảo số tiền tròn đẹp
  const dbDrinkRevenue = Math.round((dbTotalServiceRevenue * 0.60) / 10000) * 10000;
  const dbEquipmentRevenue = dbTotalServiceRevenue - dbDrinkRevenue; // Khớp 100% phần còn lại

  const revenueBreakdown = [
    { name: 'Tiền thuê sân', value: dbPitchRevenue },
    { name: 'Nước uống', value: dbDrinkRevenue },
    { name: 'Thuê áo, bóng', value: dbEquipmentRevenue },
  ];

  // Tính doanh thu hủy cọc (50% giá trị đặt sân đối với đơn hủy nhưng đã cọc)
  const cancelledWithDeposit = filteredBookings.filter(
    (b) => b.status === 'cancelled' && b.paymentStatus === 'deposited'
  );
  const penaltyRevenue = cancelledWithDeposit.reduce((sum, b) => sum + (b.pitchPriceAtBooking ?? 0) / 2, 0);

  // Tổng doanh thu thực tế
  const computedTotalRevenue = dbPitchRevenue + dbTotalServiceRevenue + penaltyRevenue;

  // Lượt đặt sân
  const computedTotalBookings = filteredBookings.length;

  // Lượt đã thanh toán thành công
  const successTxn = filteredBookings.filter((b) => b.paymentStatus === 'paid').length;
  
  // Lượt hoàn tiền
  const refundedTxn = filteredBookings.filter((b) => b.status === 'cancelled').length;
  
  // Tính số tiền hoàn trả ước tính
  const refundedAmount = refundedTxn * (computedTotalRevenue > 0 && computedTotalBookings > 0 ? computedTotalRevenue / computedTotalBookings : 0);
  
  // Phần trăm thành công
  const successPercentage = computedTotalBookings > 0 ? Math.round((successTxn / computedTotalBookings) * 100) : 0;

  // Lọc dữ liệu bảng theo bộ lọc trạng thái được chọn
  const tableData = filteredBookings
    .filter((b) => {
      if (statusFilter === 'success') return b.paymentStatus === 'paid';
      if (statusFilter === 'refunded') return b.status === 'cancelled';
      return true;
    })
    .map((b) => ({
      id: b.id.substring(0, 8).toUpperCase(),
      date: `${b.date} ${b.startTime}`,
      user: b.userName,
      type: 'Đặt sân',
      amount: b.price,
      method: b.paymentStatus === 'paid' ? 'Chuyển khoản' : 'Tiền mặt',
      status: (b.paymentStatus === 'paid'
        ? 'success'
        : b.paymentStatus === 'deposited'
          ? 'deposited'
          : b.status === 'cancelled'
            ? 'refunded'
            : 'pending') as any,
    }));

  const summaryItems = [
    {
      icon: <WalletOutlined />,
      label: 'Tổng doanh thu',
      value: `${(computedTotalRevenue / VIETNAMESE_DONG_TO_MILLION).toFixed(1)}M đ`, // Làm tròn 1 chữ số thập phân để đồng bộ trang tổng quan
      trend: `${revenue?.rate ?? 0}%`,
      color: '#059669',
      bg: '#dcfce7',
      gradient: 'from-emerald-600 to-emerald-800',
    },
    {
      icon: <TransactionOutlined />,
      label: 'Tổng lượt đặt sân',
      value: `${computedTotalBookings} lượt`,
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

  const handleExportExcel = async () => {
    try {
      message.loading('Đang khởi tạo tệp báo cáo...', 1.5);
      const params: any = {};
      if (selectedDate) {
        params.month = selectedDate.month() + 1;
        params.year = selectedDate.year();
      }
      const res = await statisticService.exportRevenueExcel(params);
      const blob = new Blob([res.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'Bao_Cao_Doanh_Thu_He_Thong.xlsx');
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
            <div className="font-extrabold text-2xl text-slate-800 tracking-tight">Báo cáo & Tài chính</div>
            <Text className="text-slate-400 text-xs">Theo dõi dòng tiền, xuất báo cáo doanh thu và phân tích cơ cấu chi phí</Text>
          </div>
        ),
        extra: [
          <Button
            key="export"
            icon={<DownloadOutlined />}
            onClick={handleExportExcel}
            className="h-10 px-5 font-bold rounded-xl border-slate-350 hover:border-emerald-500 hover:text-emerald-600 transition-colors shadow-sm"
          >
            Xuất Excel
          </Button>,
        ],
      }}
    >
      {/* Summary Stats */}
      <Row gutter={[16, 16]} className="mb-6">
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
        <Col xs={24} lg={8}>
          <RevenueStructure data={revenueBreakdown} totalRevenue={computedTotalRevenue} />
        </Col>

        {/* Transaction History Table */}
        <Col xs={24} lg={16}>
          <TransactionHistoryTable
            data={tableData}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
          />
        </Col>
      </Row>
    </PageContainer>
  );
};

export default AdminFinance;