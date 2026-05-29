import React from 'react';
import { Card, Row, Col, DatePicker, Select, Button } from 'antd';
import { FilterOutlined } from '@ant-design/icons';
import type { Dayjs } from 'dayjs';
import type { Pitch } from '@/entities/pitch/model/types';

interface ScheduleFilterCardProps {
  selectedDate: Dayjs;
  setSelectedDate: (d: Dayjs) => void;
  filterPitch: string;
  setFilterPitch: (p: string) => void;
  filterPayment: string;
  setFilterPayment: (p: string) => void;
  pitches: Pitch[];
  onResetFilters: () => void;
}

export const ScheduleFilterCard: React.FC<ScheduleFilterCardProps> = ({
  selectedDate, setSelectedDate,
  filterPitch, setFilterPitch,
  filterPayment, setFilterPayment,
  pitches,
  onResetFilters,
}) => {
  return (
    <Card bordered={false} style={{ marginBottom: 24, borderRadius: 12, border: '1px solid #e5e7eb' }}
      bodyStyle={{ padding: '16px 24px' }}>
      <Row gutter={16} align="bottom">
        <Col span={6}>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#4b5563', marginBottom: 6 }}>Ngày xem lịch</div>
          <DatePicker value={selectedDate} onChange={(v) => v && setSelectedDate(v)}
            style={{ width: '100%', height: 40, borderRadius: 8 }} format="DD/MM/YYYY" />
        </Col>
        <Col span={6}>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#4b5563', marginBottom: 6 }}>Chọn khu vực sân</div>
          <Select value={filterPitch} onChange={setFilterPitch} style={{ width: '100%', height: 40 }}
            options={[{ value: 'all', label: 'Tất cả các sân' }, ...pitches.map((p) => ({ value: p.id, label: p.name }))]} />
        </Col>
        <Col span={6}>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#4b5563', marginBottom: 6 }}>Trạng thái thanh toán</div>
          <Select value={filterPayment} onChange={setFilterPayment} style={{ width: '100%', height: 40 }}
            options={[
              { value: 'all', label: 'Tất cả trạng thái' },
              { value: 'deposited', label: 'Đã cọc' },
              { value: 'paid', label: 'Đã thanh toán' },
              { value: 'unpaid', label: 'Chưa thanh toán' },
            ]} />
        </Col>
        <Col span={6}>
          <Button icon={<FilterOutlined />} onClick={onResetFilters}
            style={{ width: '100%', height: 40, borderRadius: 8, background: '#e0e7ff', color: '#4f46e5', border: 'none', fontWeight: 600 }}>
            Lọc kết quả
          </Button>
        </Col>
      </Row>
    </Card>
  );
};
