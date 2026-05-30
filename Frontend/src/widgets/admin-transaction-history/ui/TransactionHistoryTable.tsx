import React from 'react';
import { Card, Table, Tag, Space, DatePicker, Select, Typography, Button } from 'antd';
import { CheckCircleOutlined, ReloadOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Text } = Typography;

interface Transaction {
  id: string;
  date: string;
  user: string;
  type: string;
  amount: number;
  method: string;
  status: 'success' | 'refunded' | 'pending' | 'deposited';
}

interface TransactionHistoryTableProps {
  data: Transaction[];
  selectedDate: dayjs.Dayjs | null;
  setSelectedDate: (date: dayjs.Dayjs | null) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
}

const METHOD_STYLES: Record<string, { bg: string; color: string; icon: string }> = {
  'Chuyển khoản': { bg: 'bg-blue-50 text-blue-700', color: 'text-blue-700', icon: '🏦' },
  'Tiền mặt': { bg: 'bg-emerald-50 text-emerald-700', color: 'text-emerald-700', icon: '💵' },
  'Ví điện tử': { bg: 'bg-purple-50 text-purple-700', color: 'text-purple-700', icon: '📱' },
};

export const TransactionHistoryTable: React.FC<TransactionHistoryTableProps> = ({
  data,
  selectedDate,
  setSelectedDate,
  statusFilter,
  setStatusFilter,
}) => {
  const columns = [
    {
      title: 'Mã GD',
      dataIndex: 'id',
      key: 'id',
      render: (text: string) => (
        <span className="font-mono text-xs font-bold bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg">
          {text}
        </span>
      ),
    },
    {
      title: 'Khách hàng',
      dataIndex: 'user',
      key: 'user',
      render: (text: string) => (
        <div className="flex items-center gap-2.5">
          <div className="w-[30px] h-[30px] rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 text-white flex items-center justify-center font-extrabold text-[11px] flex-shrink-0">
            {text.substring(0, 2).toUpperCase()}
          </div>
          <span className="font-bold text-slate-800 text-xs">{text}</span>
        </div>
      ),
    },
    { title: 'Loại', dataIndex: 'type', key: 'type', render: (text: string) => <Text className="text-slate-600 text-xs">{text}</Text> },
    {
      title: 'Phương thức',
      dataIndex: 'method',
      key: 'method',
      render: (method: string) => {
        const cfg = METHOD_STYLES[method] || { bg: 'bg-slate-100 text-slate-600', color: 'text-slate-600', icon: '💳' };
        return (
          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-bold text-xs ${cfg.bg}`}>
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
          <div className={`font-extrabold text-sm ${record.status === 'refunded' ? 'text-red-600' : 'text-emerald-600'}`}>
            {record.status === 'refunded' ? '-' : '+'}{val.toLocaleString()}đ
          </div>
          <div className="text-[10px] text-slate-350">{record.date}</div>
        </div>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        if (status === 'success') return (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-[10px]">
            <CheckCircleOutlined /> Thành công
          </div>
        );
        if (status === 'deposited') return (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 font-extrabold text-[10px]">
            🏦 Đã cọc 50%
          </div>
        );
        if (status === 'refunded') return (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-red-800 font-extrabold text-[10px]">
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
      className="rounded-2xl border border-slate-200 overflow-hidden shadow-sm mt-5"
      bodyStyle={{ padding: 0 }}
    >
      <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center flex-wrap gap-3">
        <div>
          <div className="font-bold text-base text-slate-800">Lịch sử giao dịch</div>
          <Text className="text-slate-400 text-xs">{data.length} giao dịch được tìm thấy</Text>
        </div>
        <Space wrap>
          <DatePicker
            value={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            format="DD/MM/YYYY"
            placeholder="Chọn ngày lọc"
            className="rounded-xl h-9 w-40"
            allowClear
          />
          <Button
            onClick={() => setSelectedDate(null)}
            className="rounded-xl h-9 font-bold bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700 transition-colors"
          >
            Tất cả
          </Button>
          <Select 
            value={statusFilter}
            onChange={(val) => setStatusFilter(val)}
            className="w-32 h-9 rounded-xl"
            options={[
              { value: 'all', label: 'Tất cả TT' },
              { value: 'success', label: 'Thành công' },
              { value: 'refunded', label: 'Hoàn tiền' },
            ]} 
          />
        </Space>
      </div>
      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        pagination={{ pageSize: 5, size: 'small', className: 'px-6 py-3' }}
        className="admin-table border-none"
      />
    </Card>
  );
};
