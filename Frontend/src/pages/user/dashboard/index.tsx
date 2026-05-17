import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Statistic, Typography } from 'antd';
import { notificationApi, statisticApi, userApi } from '@/shared/api/modules';
import type { Booking, Notification } from '@/shared/types/domain';

const UserDashboard: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [topSpenders, setTopSpenders] = useState<any[]>([]);

  useEffect(() => {
    void userApi.history().then((res) => setBookings(res.data.data.history));
    void notificationApi.list().then((res) => setNotifications(res.data.data.notification));
    void statisticApi.topSpenders().then((res) => setTopSpenders(res.data.data));
  }, []);

  return (
    <>
      <Typography.Title level={2}>Tổng quan người dùng</Typography.Title>
      <Row gutter={16}>
        <Col span={8}><Card><Statistic title="Tổng booking" value={bookings.length} /></Card></Col>
        <Col span={8}><Card><Statistic title="Thông báo chưa đọc" value={notifications.filter((x) => !x.isRead).length} /></Card></Col>
        <Col span={8}><Card><Statistic title="Top spender đang hiển thị" value={topSpenders.length} /></Card></Col>
      </Row>
    </>
  );
};

export default UserDashboard;
