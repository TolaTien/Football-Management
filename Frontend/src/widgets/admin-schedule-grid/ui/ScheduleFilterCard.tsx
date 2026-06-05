import React from 'react';
import { Card, DatePicker, Select, Button, Space } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import type { Dayjs } from 'dayjs';
import type { Pitch } from '@/entities/pitch';

interface ScheduleFilterCardProps {
  selectedDate: Dayjs;
  setSelectedDate: (date: Dayjs) => void;
  filterPitch: string;
  setFilterPitch: (id: string) => void;
  filterPayment: string;
  setFilterPayment: (status: string) => void;
  pitches: Pitch[];
  onResetFilters: () => void;
}

export const ScheduleFilterCard: React.FC<ScheduleFilterCardProps> = ({
  selectedDate, setSelectedDate, filterPitch, setFilterPitch, filterPayment, setFilterPayment, pitches, onResetFilters
}) => {
  return (
    <Card className="rounded-2xl border border-slate-200 shadow-sm mb-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Space size="middle" className="flex-wrap">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Chọn ngày</span>
            <DatePicker
              value={selectedDate}
              onChange={(val) => val && setSelectedDate(val)}
              allowClear={false}
              className="rounded-xl h-10 w-44"
            />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Lọc địa điểm</span>
            <Select
              value={filterPitch}
              onChange={setFilterPitch}
              className="w-44 h-10 rounded-xl"
              options={[
                { value: 'all', label: 'Tất cả địa điểm' },
                { value: 'Hà Nội', label: 'Hà Nội' },
                { value: 'Đà Nẵng', label: 'Đà Nẵng' },
                { value: 'Hồ Chí Minh', label: 'Hồ Chí Minh' }
              ]}
            />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Trạng thái thanh toán</span>
            <Select
              value={filterPayment}
              onChange={setFilterPayment}
              className="w-40 h-10 rounded-xl"
              options={[
                { value: 'all', label: 'Tất cả trạng thái' },
                { value: 'unpaid', label: 'Chưa thanh toán' },
                { value: 'deposited', label: 'Đã cọc' },
                { value: 'paid', label: 'Đã thanh toán đủ' }
              ]}
            />
          </div>
        </Space>

        <Button
          icon={<ReloadOutlined />}
          onClick={onResetFilters}
          className="h-10 px-4 rounded-xl border-slate-250 hover:border-emerald-500 hover:text-emerald-600 font-semibold self-end"
        >
          Đặt lại bộ lọc
        </Button>
      </div>
    </Card>
  );
};
