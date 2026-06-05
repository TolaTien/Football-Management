import React, { useState, useMemo, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { Typography, Button, Badge, Tooltip } from 'antd';
import {
  CalendarOutlined, PlusOutlined,
  AreaChartOutlined, MoneyCollectOutlined, FieldTimeOutlined,
} from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { fetchAllBookings, addManualBooking, updatePaymentStatus, updateBookingStatus, deleteBookingThunk, refundBookingThunk } from '@/entities/booking/model/bookingSlice';
import { fetchPitches } from '@/entities/pitch/model/pitchSlice';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/vi';
import type { Booking } from '@/entities/booking/model/types';

// FSD Imports
import { AddBookingModal, BookingDetailModal } from '@/features/manage-booking';
import { ScheduleFilterCard, ScheduleStats } from '@/widgets/admin-schedule-grid';

dayjs.locale('vi');

const { Title, Text } = Typography;

const SLOT_MIN = 30;
const START_HOUR = 6;
const END_HOUR = 24;
const START_MIN_VAL = START_HOUR * 60;
const SLOT_COUNT = ((END_HOUR - START_HOUR) * 60) / SLOT_MIN;
const GRID_TPL = `160px repeat(${SLOT_COUNT}, minmax(28px, 1fr))`;

const HOUR_LABELS = Array.from({ length: END_HOUR - START_HOUR }, (_, i) =>
  `${String(START_HOUR + i).padStart(2, '0')}:00`
);

// Cấu hình màu nền sử dụng Tailwind CSS (bgClass) và mã màu hex cho Tooltip/API nếu cần (bg)
const PAY_CFG: Record<string, { bgClass: string; bg: string; label: string }> = {
  deposited: { bgClass: 'bg-emerald-500', bg: '#10b981', label: 'Đã cọc' },
  paid: { bgClass: 'bg-emerald-600', bg: '#059669', label: 'Đã thanh toán' },
  unpaid: { bgClass: 'bg-red-400', bg: '#f87171', label: 'Chưa TT' },
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

  // Lọc danh sách sân theo Địa điểm (Address)
  const displayPitches = useMemo(() =>
    filterPitch === 'all' ? pitches : pitches.filter((p) => p.address === filterPitch),
    [pitches, filterPitch]);

  // Lọc danh sách đặt sân dựa trên các sân hiển thị và trạng thái thanh toán
  const filtered = useMemo(() => {
    const displayedPitchIds = new Set(displayPitches.map(p => p.id));
    return bookings.filter((b) =>
      b.date === dateStr &&
      displayedPitchIds.has(b.pitchId) &&
      (filterPayment === 'all' || b.paymentStatus === filterPayment)
    );
  }, [bookings, dateStr, displayPitches, filterPayment]);

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
        title: <Title level={2} className="m-0 font-extrabold text-slate-800 tracking-tight">Lịch đặt sân chi tiết</Title>,
        subTitle: (
          <div className="flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full mt-2 w-fit">
            <CalendarOutlined className="text-slate-500" />
            <Text className="text-slate-600 font-semibold text-xs">{selectedDate.format('dddd, DD/MM/YYYY')}</Text>
          </div>
        ),
        extra: [
          <Button
            key="add"
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setShowAdd(true)}
            className="bg-emerald-600 border-emerald-600 hover:bg-emerald-700 hover:border-emerald-700 rounded-xl font-bold h-10 px-5 shadow-md shadow-emerald-600/10"
          >
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
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="flex items-center gap-5 px-5 py-3 border-b border-slate-200 bg-slate-50">
          {Object.values(PAY_CFG).map(({ bgClass, label }) => (
            <div key={label} className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
              <div className={`w-2.5 h-2.5 rounded-full ${bgClass}`} />{label}
            </div>
          ))}
          <div className="ml-auto flex items-center gap-1.5">
            <Badge count={filtered.length} showZero color="#059669" />
            <span className="text-xs text-slate-500 font-medium">lượt đặt</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-[960px]">
            {/* Thanh hiển thị Giờ (Timeline Header) */}
            <div className="grid bg-indigo-50 border-b border-indigo-150" style={{ gridTemplateColumns: GRID_TPL }}>
              <div className="px-3.5 py-2.5 border-r border-indigo-100 font-extrabold text-indigo-700 text-xs">
                SÂN / GIỜ
              </div>
              {HOUR_LABELS.map((lbl, i) => (
                <div
                  key={lbl}
                  className="text-center font-bold text-slate-700 text-xs border-r border-indigo-100 py-2.5 row-start-1"
                  style={{ gridColumn: `${i * 2 + 2} / ${i * 2 + 4}` }}
                >
                  {lbl}
                </div>
              ))}
            </div>

            {/* Danh sách lưới các Sân và Lịch đặt */}
            {displayPitches.map((pitch) => {
              const pitchBookings = filtered.filter((b) => b.pitchId === pitch.id);
              return (
                <div
                  key={pitch.id}
                  className="grid border-b border-slate-100 items-stretch grid-rows-[72px]"
                  style={{ gridTemplateColumns: GRID_TPL }}
                >
                  {/* Cột Tên Sân */}
                  <div
                    className="px-3.5 py-2 bg-slate-50/50 border-r border-slate-150 z-10 flex flex-col justify-center col-start-1 row-start-1"
                  >
                    <div className="font-extrabold text-slate-800 text-xs">{pitch.name}</div>
                    <div className={`text-[9px] font-extrabold uppercase mt-1 ${pitch.type?.includes('7') || pitch.type?.includes('11') ? 'text-blue-600' : 'text-emerald-600'}`}>
                      {pitch.type}
                    </div>
                  </div>

                  {/* Các đường kẻ dọc phân chia khung giờ */}
                  {Array.from({ length: SLOT_COUNT }, (_, i) => (
                    <div
                      key={i}
                      className={`border-r row-start-1 ${i % 2 === 1 ? 'border-slate-200' : 'border-slate-100'}`}
                      style={{ gridColumn: `${i + 2}` }}
                    />
                  ))}

                  {/* Danh sách các block Lịch đặt sân */}
                  {pitchBookings.map((b) => {
                    const cfg = PAY_CFG[b.paymentStatus] ?? PAY_CFG.unpaid;
                    const { gridColumnStart, gridColumnEnd } = bookingGridCol(b.startTime, b.endTime);
                    return (
                      <Tooltip key={b.id} title={`${b.userName} · ${b.startTime}–${b.endTime} · ${cfg.label}`}>
                        <div
                          onClick={() => setDetail(b)}
                          className={`mx-0.5 my-1.5 rounded-lg px-2 py-1 text-white cursor-pointer overflow-hidden z-20 shadow-md transition-all duration-150 hover:brightness-110 flex flex-col justify-center row-start-1 ${cfg.bgClass}`}
                          style={{ gridColumn: `${gridColumnStart} / ${gridColumnEnd}` }}
                        >
                          <div className="font-bold text-[10px] truncate leading-tight">{b.userName}</div>
                          <div className="text-[8px] opacity-90 font-medium mt-0.5">{b.startTime}–{b.endTime}</div>
                        </div>
                      </Tooltip>
                    );
                  })}
                </div>
              );
            })}

            {displayPitches.length === 0 && (
              <div className="p-12 text-center text-slate-400 text-sm font-semibold">Không có sân nào</div>
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
        onRefund={(id) => dispatch(refundBookingThunk(id))}
      />
    </PageContainer>
  );
};

export default AdminScheduleGrid;
