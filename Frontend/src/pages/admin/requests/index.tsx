import React, { useEffect, useState } from 'react';
import { Button, Card, Space, Table, Tag, Typography, message } from 'antd';
import { adminApi, bookingApi } from '@/shared/api/modules';
import type { Booking } from '@/shared/types/domain';

const AdminRequestsPage: React.FC = () => {
  const [items, setItems] = useState<Booking[]>([]);

  const load = async () => {
    const res = await bookingApi.pendingRequests();
    setItems(res.data.data.booking);
  };

  useEffect(() => { void load(); }, []);

  return (
    <Card>
      <Typography.Title level={2}>Yêu cầu đặt sân</Typography.Title>
      <Table
        rowKey="bookId"
        dataSource={items}
        columns={[
          { title: 'Khách', render: (_, r) => r.users?.fullName || r.phone || '-' },
          { title: 'Sân', render: (_, r) => r.pitch?.namePitch || '-' },
          { title: 'Thời gian', render: (_, r) => `${r.startTime || ''} - ${r.endTime || ''}` },
          { title: 'Thanh toán', render: (_, r) => <Tag>{r.paymentStatus}</Tag> },
          {
            title: 'Thao tác',
            render: (_, r) => (
              <Space>
                <Button type="primary" onClick={async () => { await adminApi.approveBooking(r.bookId); message.success('Đã duyệt'); await load(); }}>Duyệt</Button>
                <Button danger onClick={async () => { await adminApi.cancelBooking(r.bookId); message.success('Đã hủy'); await load(); }}>Hủy</Button>
              </Space>
            ),
          },
        ]}
      />
    </Card>
  );
};

export default AdminRequestsPage;
