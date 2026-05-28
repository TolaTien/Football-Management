import React from 'react';
import { Card, Table, Tag, Space, DatePicker, Select, Typography } from 'antd';
import { CheckCircleOutlined, ReloadOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const { Text } = Typography;

interface Transaction {
  id: string;
  date: string;
  user: string;
  type: string;
  amount: number;
  method: string;
  status: 'success' | 'refunded' | 'pending';
}


interface TransactionHistoryTableProps {
  data: Transaction[];
}

const METHOD_STYLES: Record<string, { bg: string; color: string; icon: string }> = {
  'Chuyển khoản': { bg: '#dbeafe', color: '#1d4ed8', icon: '🏦' },
  'Tiền mặt': { bg: '#dcfce7', color: '#15803d', icon: '💵' },
  'Ví điện tử': { bg: '#ede9fe', color: '#6d28d9', icon: '📱' },
};

export const TransactionHistoryTable: React.FC<TransactionHistoryTableProps> = ({ data }) => {
  const columns = [
    {
      title: 'Mã GD',
      dataIndex: 'id',
      key: 'id',
      render: (text: string) => (
        <span style={{
          fontFamily: 'monospace', fontSize: 12, fontWeight: 700,
          background: '#f1f5f9', padding: '3px 8px', borderRadius: 6, color: '#475569',
        }}>
          {text}
        </span>
      ),
    },
    {
      title: 'Khách hàng',
      dataIndex: 'user',
      key: 'user',
      render: (text: string) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 30, height: 30, borderRadius: '50%',
            background: 'linear-gradient(135deg, #059669, #34d399)',
            color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 700, fontSize: 11, flexShrink: 0,
          }}>
            {text.substring(0, 2).toUpperCase()}
          </div>
          <span style={{ fontWeight: 600, color: '#0f172a', fontSize: 13 }}>{text}</span>
        </div>
      ),
    },
    { title: 'Loại', dataIndex: 'type', key: 'type', render: (text: string) => <Text style={{ color: '#475569', fontSize: 13 }}>{text}</Text> },
    {
      title: 'Phương thức',
      dataIndex: 'method',
      key: 'method',
      render: (method: string) => {
        const cfg = METHOD_STYLES[method] || { bg: '#f1f5f9', color: '#475569', icon: '💳' };
        return (
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            padding: '3px 10px', borderRadius: 20,
            backgroundColor: cfg.bg, color: cfg.color,
            fontWeight: 600, fontSize: 12,
          }}>
            {cfg.icon} {method}
          </div>
        );
      },
    },
    {
      title: 'Số tiền',
      dataIndex: 'amount',
      key: 'amount',
      render: (val: number, record: { status: string; date: string }) => (
        <div>
          <div style={{ fontWeight: 800, fontSize: 14, color: record.status === 'refunded' ? '#dc2626' : '#059669' }}>
            {record.status === 'refunded' ? '-' : '+'}{val.toLocaleString()}đ
          </div>
          <div style={{ fontSize: 10, color: '#cbd5e1' }}>{record.date}</div>
        </div>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        if (status === 'success') return (
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 10px', borderRadius: 20, background: '#dcfce7', color: '#15803d', fontWeight: 700, fontSize: 11 }}>
            <CheckCircleOutlined /> Thành công
          </div>
        );
        if (status === 'refunded') return (
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 10px', borderRadius: 20, background: '#fee2e2', color: '#dc2626', fontWeight: 700, fontSize: 11 }}>
            <ReloadOutlined /> Hoàn tiền
          </div>
        );
        return <Tag>Chờ xử lý</Tag>;
      },
    },
  ];

  return (
    <Card
      bordered={false}
      style={{ borderRadius: 16, border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
      bodyStyle={{ padding: 0 }}
    >
      <div style={{ padding: '16px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ fontWeight: 700, color: '#0f172a', fontSize: 15 }}>Lịch sử giao dịch</div>
          <Text style={{ color: '#94a3b8', fontSize: 12 }}>{data.length} giao dịch gần nhất</Text>
        </div>
        <Space wrap>
          <RangePicker
            defaultValue={[dayjs().subtract(7, 'days'), dayjs()]}
            format="DD/MM/YYYY"
            style={{ borderRadius: 8 }}
          />
          <Select defaultValue="all" style={{ width: 130 }} size="middle" options={[
            { value: 'all', label: 'Tất cả TT' },
            { value: 'success', label: 'Thành công' },
            { value: 'refunded', label: 'Hoàn tiền' },
          ]} />
        </Space>
      </div>
      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        pagination={{ pageSize: 5, size: 'small' }}
        style={{ borderRadius: 0 }}
      />
    </Card>
  );
};
