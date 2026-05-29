import React from 'react';
import { Card, Table, Tag, Typography } from 'antd';
import type { Booking } from '@/entities/booking/model/types';

const { Text } = Typography;

interface RecentBookingsTableProps {
  bookings: Booking[];
  pendingCount: number;
}

export const RecentBookingsTable: React.FC<RecentBookingsTableProps> = ({ bookings, pendingCount }) => {
  const columns = [
    {
      title: 'Khách hàng',
      dataIndex: 'userName',
      key: 'userName',
      render: (text: string) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 34, height: 34, borderRadius: '50%',
            background: 'linear-gradient(135deg, #059669, #00a67d)',
            color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 700, fontSize: 13, flexShrink: 0,
          }}>
            {text.substring(0, 2).toUpperCase()}
          </div>
          <span style={{ fontWeight: 600, color: '#0f172a' }}>{text}</span>
        </div>
      ),
    },
    {
      title: 'Sân bóng',
      dataIndex: 'pitchName',
      key: 'pitchName',
      render: (text: string) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 14 }}>⚽</span>
          <span style={{ color: '#475569', fontWeight: 500 }}>{text}</span>
        </div>
      ),
    },
    {
      title: 'Thời gian',
      key: 'time',
      render: (_: unknown, record: Booking) => (
        <span style={{ color: '#64748b' }}>
          {record.date} ({record.startTime} - {record.endTime})
        </span>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        if (status === 'approved') return <Tag style={{ background: '#dcfce7', color: '#15803d', border: 'none', borderRadius: 8, fontWeight: 700, padding: '3px 10px' }}>✓ Đã duyệt</Tag>;
        if (status === 'pending') return <Tag style={{ background: '#fef9c3', color: '#b45309', border: 'none', borderRadius: 8, fontWeight: 700, padding: '3px 10px' }}>⏳ Chờ duyệt</Tag>;
        return <Tag style={{ background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: 8, fontWeight: 700, padding: '3px 10px' }}>✕ Từ chối</Tag>;
      },
    },
  ];

  return (
    <Card
      bordered={false}
      style={{ borderRadius: 16, border: '1px solid #e2e8f0', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', overflow: 'hidden' }}
      bodyStyle={{ padding: 0 }}
    >
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '20px 24px', borderBottom: '1px solid #f1f5f9',
      }}>
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#0f172a' }}>Danh sách lịch đặt</div>
          <Text style={{ color: '#94a3b8', fontSize: 12 }}>Toàn bộ hệ thống · {bookings.length} lượt</Text>
        </div>
        {pendingCount > 0 && (
          <div style={{
            background: '#fef9c3', color: '#b45309', padding: '6px 14px',
            borderRadius: 20, fontWeight: 700, fontSize: 12,
            border: '1px solid #fde68a',
          }}>
            ⚠ {pendingCount} đơn chờ duyệt
          </div>
        )}
      </div>
      <Table
        columns={columns}
        dataSource={bookings}
        pagination={{ pageSize: 5, size: 'small' }}
        rowKey="id"
        style={{ borderRadius: 0 }}
      />
    </Card>
  );
};
