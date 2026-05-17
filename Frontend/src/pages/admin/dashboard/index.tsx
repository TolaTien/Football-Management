import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Statistic, Typography } from 'antd';
import { bookingApi, statisticApi } from '@/shared/api/modules';

const AdminDashboard: React.FC = () => {
  const [overview, setOverview] = useState<any>({});
  const [revenue, setRevenue] = useState<any>({});
  const [pending, setPending] = useState(0);

  useEffect(() => {
    void statisticApi.overview().then((res) => setOverview(res.data.data));
    void statisticApi.revenue().then((res) => setRevenue(res.data.data));
    void bookingApi.pendingRequests().then((res) => setPending(res.data.data.pagination.totalRequest || 0));
  }, []);

  return (
    <>
      <Typography.Title level={2}>Tổng quan hệ thống</Typography.Title>
      <Row gutter={16}>
        <Col span={6}><Card><Statistic title="Người dùng" value={overview.totalUsers || 0} /></Card></Col>
        <Col span={6}><Card><Statistic title="Sân hoạt động" value={overview.totalPitches || 0} /></Card></Col>
        <Col span={6}><Card><Statistic title="Yêu cầu chờ duyệt" value={pending} /></Card></Col>
        <Col span={6}><Card><Statistic title="Doanh thu" value={revenue.totalRevenue || 0} suffix="đ" /></Card></Col>
      </Row>
    </>
  );
};

export default AdminDashboard;
