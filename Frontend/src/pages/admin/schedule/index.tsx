import React, { useState, useMemo, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { Typography, Button, Badge, Tooltip } from 'antd';
import {
  CalendarOutlined, PlusOutlined,
  AreaChartOutlined, MoneyCollectOutlined, FieldTimeOutlined,
} from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '@/shared/model/hooks';
import { fetchAllBookings, addManualBooking, updatePaymentStatus, updateBookingStatus, deleteBookingThunk } from '@/entities/booking/model/bookingSlice';
import { fetchPitches } from '@/entities/pitch/model/pitchSlice';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/vi';
import type { Booking } from '@/entities/booking/model/types';
import AddBookingModal from './components/AddBookingModal';
import BookingDetailModal from './components/BookingDetailModal';
import { ScheduleStats } from './components/ScheduleStats';
import { ScheduleFilterCard } from './components/ScheduleFilterCard';

dayjs.locale('vi');

const { Title, Text } = Typography;

const SLOT_MIN = 30;
const START_HOUR = 6;
const END_HOUR = 22;
const START_MIN_VAL = START_HOUR * 60;
const SLOT_COUNT = ((END_HOUR - START_HOUR) * 60) / SLOT_MIN;
const GRID_TPL = `160px repeat(${SLOT_COUNT}, minmax(28px, 1fr))`;

const HOUR_LABELS = Array.from({ length: END_HOUR - START_HOUR }, (_, i) =>
  `${String(START_HOUR + i).padStart(2, '0')}:00`
);

const PAY_CFG: Record<string, { bg: string; label: string }> = {
  deposited: { bg: '#10b981', label: 'Đã cọc' },
  paid: { bg: '#059669', label: 'Đã thanh toán' },
  unpaid: { bg: '#f87171', label: 'Chưa TT' },
};

const toMin = (t: string) => {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
};

const bookingGridCol = (start: string, end: string) => {
  const s = Math.round((toMin(start) - START_MIN_VAL) / SLOT_MIN);
  const e = Math.round((toMin(end) - START_MIN_VAL) / SLOT_MIN);
  return { gridColumnStart: s + 2, gridColumnEnd: e + 2 };
};

const AdminScheduleGrid: React.FC = () => {
  const dispatch = useAppDispatch();
  const { bookings } = useAppSelector((state) => state.booking);
  const { pitches } = useAppSelector((state) => state.pitch);

  useEffect(() => {
    dispatch(fetchAllBookings());
    dispatch(fetchPitches());
  }, [dispatch]);

  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
  const [filterPitch, setFilterPitch] = useState('all');
  const [filterPayment, setFilterPayment] = useState('all');
  const [showAdd, setShowAdd] = useState(false);
  const [detail, setDetail] = useState<Booking | null>(null);

  const dateStr = selectedDate.format('YYYY-MM-DD');

  const filtered = useMemo(() =>
    bookings.filter((b) =>
      b.date === dateStr &&
      (filterPitch === 'all' || b.pitchId === filterPitch) &&
      (filterPayment === 'all' || b.paymentStatus === filterPayment)
    ), [bookings, dateStr, filterPitch, filterPayment]);

  const displayPitches = useMemo(() =>
    filterPitch === 'all' ? pitches : pitches.filter((p) => p.id === filterPitch),
    [pitches, filterPitch]);

  const unpaidCount = filtered.filter((b) => b.paymentStatus === 'unpaid').length;
  const totalRev = filtered.reduce((s, b) => s + b.price, 0);
  const occupancy = pitches.length
    ? Math.min(100, Math.round((filtered.length / (pitches.length * 4)) * 100))
    : 0;

  const statCards = [
    { icon: <CalendarOutlined />, bg: '#059669', iconColor: '#fff', label: 'Tổng lượt đặt hôm nay', value: `${filtered.length} lượt`, valColor: '#1f2937' },
    { icon: <AreaChartOutlined />, bg: '#e0e7ff', iconColor: '#4f46e5', label: 'Tỷ lệ lấp đầy', value: `${occupancy}%`, valColor: '#1f2937' },
    { icon: <MoneyCollectOutlined />, bg: '#fee2e2', iconColor: '#dc2626', label: 'Doanh thu dự kiến', value: `${totalRev.toLocaleString()} VNĐ`, valColor: '#1f2937' },
    { icon: <FieldTimeOutlined />, bg: '#f3f4f6', iconColor: '#4b5563', label: 'Lượt chưa thanh toán', value: `${String(unpaidCount).padStart(2, '0')} lượt`, valColor: unpaidCount > 0 ? '#dc2626' : '#1f2937' },
  ];

  return (
    <PageContainer
      header={{
        title: <Title level={2} style={{ margin: 0, fontWeight: 700, color: '#00a67d' }}>Lịch đặt sân chi tiết</Title>,
        subTitle: (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 12px', background: '#f3f4f6', borderRadius: 16, marginTop: 8 }}>
            <CalendarOutlined style={{ color: '#4b5563' }} />
            <Text style={{ color: '#4b5563', fontWeight: 600 }}>{selectedDate.format('dddd, DD/MM/YYYY')}</Text>
          </div>
        ),
        extra: [
          <Button key="add" type="primary" icon={<PlusOutlined />} onClick={() => setShowAdd(true)}
            style={{ background: '#00a67d', borderRadius: 8, fontWeight: 600, height: 40 }}>
            Đặt sân mới
          </Button>,
        ],
      }}
    >
      <ScheduleFilterCard
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        filterPitch={filterPitch}
        setFilterPitch={setFilterPitch}
        filterPayment={filterPayment}
        setFilterPayment={setFilterPayment}
        pitches={pitches}
        onResetFilters={() => { setFilterPitch('all'); setFilterPayment('all'); }}
      />

      {/* Grid Timeline */}
      <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e5e7eb', overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, padding: '12px 20px', borderBottom: '1px solid #e5e7eb', background: '#f9fafb' }}>
          {Object.values(PAY_CFG).map(({ bg, label }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600, color: '#4b5563' }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: bg }} />{label}
            </div>
          ))}
          <div style={{ marginLeft: 'auto' }}>
            <Badge count={filtered.length} showZero color="#00a67d" />
            <span style={{ marginLeft: 6, fontSize: 13, color: '#4b5563' }}>lượt đặt</span>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <div style={{ minWidth: 960 }}>
            <div style={{ display: 'grid', gridTemplateColumns: GRID_TPL, background: '#e0e7ff', borderBottom: '2px solid #c7d2fe' }}>
              <div style={{ padding: '10px 14px', borderRight: '1px solid #c7d2fe', fontWeight: 800, color: '#3730a3', fontSize: 13, gridColumn: '1' }}>
                SÂN / GIỜ
              </div>
              {HOUR_LABELS.map((lbl, i) => (
                <div key={lbl} style={{ gridColumn: `${i * 2 + 2} / ${i * 2 + 4}`, gridRow: '1', padding: '10px 4px', textAlign: 'center', fontWeight: 700, color: '#1f2937', fontSize: 12, borderRight: '1px solid #c7d2fe' }}>
                  {lbl}
                </div>
              ))}
            </div>

            {displayPitches.map((pitch) => {
              const pitchBookings = filtered.filter((b) => b.pitchId === pitch.id);
              return (
                <div key={pitch.id} style={{ display: 'grid', gridTemplateColumns: GRID_TPL, gridTemplateRows: '72px', borderBottom: '1px solid #e5e7eb', alignItems: 'stretch' }}>
                  <div style={{ gridColumn: '1', gridRow: '1', padding: '10px 14px', background: '#f9fafb', borderRight: '1px solid #e5e7eb', zIndex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div style={{ fontWeight: 800, color: '#1f2937', fontSize: 14 }}>{pitch.name}</div>
                    <div style={{ fontSize: 10, fontWeight: 700, color: pitch.type?.includes('7') || pitch.type?.includes('11') ? '#1d4ed8' : '#059669', textTransform: 'uppercase', marginTop: 2 }}>
                      {pitch.type}
                    </div>
                  </div>

                  {Array.from({ length: SLOT_COUNT }, (_, i) => (
                    <div key={i} style={{ gridColumn: `${i + 2}`, gridRow: '1', borderRight: i % 2 === 1 ? '1px solid #e5e7eb' : '1px solid #f3f4f6' }} />
                  ))}

                  {pitchBookings.map((b) => {
                    const cfg = PAY_CFG[b.paymentStatus] ?? PAY_CFG.unpaid;
                    const { gridColumnStart, gridColumnEnd } = bookingGridCol(b.startTime, b.endTime);
                    return (
                      <Tooltip key={b.id} title={`${b.userName} · ${b.startTime}–${b.endTime} · ${cfg.label}`}>
                        <div onClick={() => setDetail(b)}
                          style={{ gridColumn: `${gridColumnStart} / ${gridColumnEnd}`, gridRow: '1', margin: '6px 3px', background: cfg.bg, borderRadius: 6, padding: '5px 8px', color: '#fff', cursor: 'pointer', overflow: 'hidden', zIndex: 2, boxShadow: '0 2px 6px rgba(0,0,0,0.15)', transition: 'filter 0.15s' }}
                          onMouseEnter={(e) => (e.currentTarget.style.filter = 'brightness(1.1)')}
                          onMouseLeave={(e) => (e.currentTarget.style.filter = 'brightness(1)')}>
                          <div style={{ fontWeight: 700, fontSize: 11, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{b.userName}</div>
                          <div style={{ fontSize: 10, opacity: 0.88 }}>{b.startTime}–{b.endTime}</div>
                        </div>
                      </Tooltip>
                    );
                  })}
                </div>
              );
            })}

            {displayPitches.length === 0 && (
              <div style={{ padding: 48, textAlign: 'center', color: '#9ca3af' }}>Không có sân nào</div>
            )}
          </div>
        </div>
      </div>

      <ScheduleStats items={statCards} />

      <AddBookingModal
        open={showAdd}
        pitches={pitches}
        selectedDate={selectedDate}
        onConfirm={(booking) => { dispatch(addManualBooking(booking)); setShowAdd(false); }}
        onClose={() => setShowAdd(false)}
      />
      <BookingDetailModal
        detail={detail}
        onClose={() => setDetail(null)}
        onUpdatePayment={(id, status) => dispatch(updatePaymentStatus({ id, paymentStatus: status }))}
        onUpdateStatus={(id, status) => dispatch(updateBookingStatus({ id, status }))}
        onDelete={(id) => dispatch(deleteBookingThunk(id))}
        onDetailChange={setDetail}
      />
    </PageContainer>
  );
};

export default AdminScheduleGrid;
