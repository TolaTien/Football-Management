import React, { useEffect, useState } from 'react';
import { Button, Card, Modal, Table, Tag, Typography, message } from 'antd';
import { bookingApi, userApi } from '@/shared/api/modules';
import type { Booking } from '@/shared/types/domain';

const UserBookingsPage: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);

  const load = async () => {
    const res = await userApi.history();
    setBookings(res.data.data.history);
  };

  useEffect(() => { void load(); }, []);

  const cancel = (bookId: string) => {
    Modal.confirm({
      title: 'Hủy booking',
      content: 'Bạn có chắc muốn hủy booking này?',
      onOk: async () => {
        await bookingApi.cancelForUser({ bookId, content: 'Người dùng chủ động hủy' });
        message.success('Đã hủy booking');
        await load();
      },
    });
  };

  return (
    <Card>
      <Typography.Title level={2}>Lịch sử đặt sân</Typography.Title>
      <Table
        rowKey="bookId"
        dataSource={bookings}
        columns={[
          { title: 'Sân', render: (_, r) => r.pitch?.namePitch || '-' },
          { title: 'Bắt đầu', dataIndex: 'startTime' },
          { title: 'Kết thúc', dataIndex: 'endTime' },
          { title: 'Trạng thái', render: (_, r) => <Tag>{r.status}</Tag> },
          { title: 'Thanh toán', render: (_, r) => <Tag>{r.paymentStatus}</Tag> },
          { title: 'Tổng', render: (_, r) => `${(r.total || 0).toLocaleString()}đ` },
          { title: 'Thao tác', render: (_, r) => <Button danger disabled={r.status === 'rejected'} onClick={() => cancel(r.bookId)}>Hủy</Button> },
        ]}
      />
    </Card>
  );
};

export default UserBookingsPage;
