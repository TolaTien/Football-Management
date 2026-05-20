import React, { useState, useMemo } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import {
  Row, Col, Card, Typography, Button, Select, DatePicker,
  Modal, Form, Input, TimePicker, Tag, Tooltip, message, Popconfirm, Badge,
} from 'antd';
import {
  CalendarOutlined, FilterOutlined, PlusOutlined,
  AreaChartOutlined, MoneyCollectOutlined, FieldTimeOutlined,
  CheckCircleOutlined, CloseCircleOutlined, DeleteOutlined,
  PhoneOutlined, UserOutlined, ClockCircleOutlined, TeamOutlined,
} from '@ant-design/icons';
import { useModel } from '@umijs/max';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/vi';
import type { Booking } from '@/models/adminBookings';

dayjs.locale('vi');

const { Title, Text } = Typography;

// Grid: 30-min slots from 06:00 to 22:00 = 32 slots
const SLOT_MIN = 30;
const START_HOUR = 6;
const END_HOUR = 22;
const START_MIN_VAL = START_HOUR * 60;
const SLOT_COUNT = ((END_HOUR - START_HOUR) * 60) / SLOT_MIN; // 32

const HOUR_LABELS = Array.from({ length: END_HOUR - START_HOUR }, (_, i) =>
  `${String(START_HOUR + i).padStart(2, '0')}:00`
);

function toMin(t: string) {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
}

function bookingGridCol(start: string, end: string) {
  const s = Math.round((toMin(start) - START_MIN_VAL) / SLOT_MIN);
  const e = Math.round((toMin(end) - START_MIN_VAL) / SLOT_MIN);
  return { gridColumnStart: s + 2, gridColumnEnd: e + 2 };
}

const PAY_CFG: Record<string, { bg: string; label: string }> = {
  deposited: { bg: '#10b981', label: 'Đã cọc' },
  paid: { bg: '#059669', label: 'Đã thanh toán' },
  unpaid: { bg: '#f87171', label: 'Chưa TT' },
};

const SRC_LABEL: Record<string, string> = {
  app: '📱 App', phone: '📞 Điện thoại', admin: '🖥️ Admin',
};

const GRID_TPL = `160px repeat(${SLOT_COUNT}, minmax(28px, 1fr))`;

const AdminScheduleGrid: React.FC = () => {
  const { bookings, updateBookingStatus, updatePaymentStatus, addManualBooking, deleteBooking } = useModel('adminBookings');
  const { pitches } = useModel('adminPitches');

  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs('2023-10-24'));
  const [filterPitch, setFilterPitch] = useState('all');
  const [filterPayment, setFilterPayment] = useState('all');
  const [showAdd, setShowAdd] = useState(false);
  const [detail, setDetail] = useState<Booking | null>(null);
  const [addForm] = Form.useForm();

  const dateStr = selectedDate.format('YYYY-MM-DD');

  const filtered = useMemo(() =>
    bookings.filter(b =>
      b.date === dateStr &&
      (filterPitch === 'all' || b.pitchId === filterPitch) &&
      (filterPayment === 'all' || b.paymentStatus === filterPayment)
    ), [bookings, dateStr, filterPitch, filterPayment]);

  const displayPitches = useMemo(() =>
    filterPitch === 'all' ? pitches : pitches.filter(p => p.id === filterPitch),
    [pitches, filterPitch]);

  const unpaidCount = filtered.filter(b => b.paymentStatus === 'unpaid').length;
  const totalRev = filtered.reduce((s, b) => s + b.price, 0);
  const occupancy = pitches.length ? Math.min(100, Math.round((filtered.length / (pitches.length * 4)) * 100)) : 0;

  const handleAdd = () => {
    addForm.validateFields().then(v => {
      const pitch = pitches.find(p => p.id === v.pitchId);
      addManualBooking({
        userName: v.userName, phone: v.phone,
        pitchId: v.pitchId, pitchName: pitch?.name || '',
        date: v.date.format('YYYY-MM-DD'),
        startTime: v.startTime.format('HH:mm'),
        endTime: v.endTime.format('HH:mm'),
        status: 'approved', paymentStatus: 'unpaid',
        price: Number(v.price), source: 'admin', note: v.note,
      });
      message.success('Đã thêm đặt sân!');
      setShowAdd(false);
      addForm.resetFields();
    });
  };

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
          </Button>
        ],
      }}
    >
      {/* Filter */}
      <Card bordered={false} style={{ marginBottom: 24, borderRadius: 12, border: '1px solid #e5e7eb' }}
        bodyStyle={{ padding: '16px 24px' }}>
        <Row gutter={16} align="bottom">
          <Col span={6}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#4b5563', marginBottom: 6 }}>Ngày xem lịch</div>
            <DatePicker value={selectedDate} onChange={v => v && setSelectedDate(v)}
              style={{ width: '100%', height: 40, borderRadius: 8 }} format="DD/MM/YYYY" />
          </Col>
          <Col span={6}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#4b5563', marginBottom: 6 }}>Chọn khu vực sân</div>
            <Select value={filterPitch} onChange={setFilterPitch} style={{ width: '100%', height: 40 }}
              options={[{ value: 'all', label: 'Tất cả các sân' }, ...pitches.map(p => ({ value: p.id, label: p.name }))]} />
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
            <Button icon={<FilterOutlined />} onClick={() => { setFilterPitch('all'); setFilterPayment('all'); }}
              style={{ width: '100%', height: 40, borderRadius: 8, background: '#e0e7ff', color: '#4f46e5', border: 'none', fontWeight: 600 }}>
              Lọc kết quả
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Grid Timeline */}
      <Card bordered={false} bodyStyle={{ padding: 0 }}
        style={{ borderRadius: 12, border: '1px solid #e5e7eb', overflow: 'hidden' }}>
        {/* Legend */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, padding: '12px 20px', borderBottom: '1px solid #e5e7eb', background: '#f9fafb' }}>
          {[
            { bg: '#10b981', label: 'Đã cọc' },
            { bg: '#059669', label: 'Đã thanh toán' },
            { bg: '#f87171', label: 'Chưa thanh toán' },
          ].map(({ bg, label }) => (
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

            {/* Header row */}
            <div style={{ display: 'grid', gridTemplateColumns: GRID_TPL, background: '#e0e7ff', borderBottom: '2px solid #c7d2fe' }}>
              <div style={{ padding: '10px 14px', borderRight: '1px solid #c7d2fe', fontWeight: 800, color: '#3730a3', fontSize: 13, gridColumn: '1' }}>
                SÂN / GIỜ
              </div>
              {HOUR_LABELS.map((lbl, i) => (
                <div key={lbl} style={{
                  gridColumn: `${i * 2 + 2} / ${i * 2 + 4}`,
                  gridRow: '1',
                  padding: '10px 4px',
                  textAlign: 'center',
                  fontWeight: 700,
                  color: '#1f2937',
                  fontSize: 12,
                  borderRight: '1px solid #c7d2fe',
                }}>
                  {lbl}
                </div>
              ))}
            </div>

            {/* Pitch rows */}
            {displayPitches.map(pitch => {
              const pitchBookings = filtered.filter(b => b.pitchId === pitch.id);
              return (
                <div key={pitch.id} style={{
                  display: 'grid',
                  gridTemplateColumns: GRID_TPL,
                  gridTemplateRows: '72px',
                  borderBottom: '1px solid #e5e7eb',
                  alignItems: 'stretch',
                }}>
                  {/* Pitch label */}
                  <div style={{ gridColumn: '1', gridRow: '1', padding: '10px 14px', background: '#f9fafb', borderRight: '1px solid #e5e7eb', zIndex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div style={{ fontWeight: 800, color: '#1f2937', fontSize: 14 }}>{pitch.name}</div>
                    <div style={{ fontSize: 10, fontWeight: 700, color: pitch.type?.includes('7') || pitch.type?.includes('11') ? '#1d4ed8' : '#059669', textTransform: 'uppercase', marginTop: 2 }}>
                      {pitch.type}
                    </div>
                  </div>

                  {/* Background slot lines */}
                  {Array.from({ length: SLOT_COUNT }, (_, i) => (
                    <div key={i} style={{
                      gridColumn: `${i + 2}`,
                      gridRow: '1',
                      borderRight: i % 2 === 1 ? '1px solid #e5e7eb' : '1px solid #f3f4f6',
                    }} />
                  ))}

                  {/* Booking blocks */}
                  {pitchBookings.map(b => {
                    const cfg = PAY_CFG[b.paymentStatus] || PAY_CFG.unpaid;
                    const { gridColumnStart, gridColumnEnd } = bookingGridCol(b.startTime, b.endTime);
                    return (
                      <Tooltip key={b.id} title={`${b.userName} · ${b.startTime}–${b.endTime} · ${cfg.label}`}>
                        <div
                          onClick={() => setDetail(b)}
                          style={{
                            gridColumn: `${gridColumnStart} / ${gridColumnEnd}`,
                            gridRow: '1',
                            margin: '6px 3px',
                            background: cfg.bg,
                            borderRadius: 6,
                            padding: '5px 8px',
                            color: '#fff',
                            cursor: 'pointer',
                            overflow: 'hidden',
                            zIndex: 2,
                            boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                            transition: 'filter 0.15s',
                          }}
                          onMouseEnter={e => (e.currentTarget.style.filter = 'brightness(1.1)')}
                          onMouseLeave={e => (e.currentTarget.style.filter = 'brightness(1)')}
                        >
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
      </Card>

      {/* Stats */}
      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        {[
          { icon: <CalendarOutlined />, bg: '#059669', iconColor: '#fff', label: 'Tổng lượt đặt hôm nay', value: `${filtered.length} lượt`, valColor: '#1f2937' },
          { icon: <AreaChartOutlined />, bg: '#e0e7ff', iconColor: '#4f46e5', label: 'Tỷ lệ lấp đầy', value: `${occupancy}%`, valColor: '#1f2937' },
          { icon: <MoneyCollectOutlined />, bg: '#fee2e2', iconColor: '#dc2626', label: 'Doanh thu dự kiến', value: `${totalRev.toLocaleString()} VNĐ`, valColor: '#1f2937' },
          { icon: <FieldTimeOutlined />, bg: '#f3f4f6', iconColor: '#4b5563', label: 'Lượt chưa thanh toán', value: `${String(unpaidCount).padStart(2, '0')} lượt`, valColor: unpaidCount > 0 ? '#dc2626' : '#1f2937' },
        ].map(({ icon, bg, iconColor, label, value, valColor }) => (
          <Col xs={24} sm={12} lg={6} key={label}>
            <Card bordered={false} bodyStyle={{ padding: 20, display: 'flex', alignItems: 'center', gap: 16 }}
              style={{ borderRadius: 12, border: '1px solid #e5e7eb' }}>
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: bg, color: iconColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>
                {icon}
              </div>
              <div>
                <div style={{ color: '#4b5563', fontSize: 12, fontWeight: 600 }}>{label}</div>
                <div style={{ fontSize: 20, fontWeight: 800, color: valColor }}>{value}</div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* ── ADD MODAL ── */}
      <Modal open={showAdd} onCancel={() => { setShowAdd(false); addForm.resetFields(); }}
        footer={null} width={580} bodyStyle={{ padding: 0 }} style={{ borderRadius: 12, overflow: 'hidden' }}>
        <div style={{ display: 'flex', minHeight: 420 }}>
          {/* Left sidebar */}
          <div style={{ width: 180, background: 'linear-gradient(160deg,#00a67d,#007a5c)', padding: 28, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ fontSize: 36 }}>📋</div>
            <div style={{ color: '#fff', fontWeight: 800, fontSize: 17, lineHeight: 1.3 }}>Đặt sân mới</div>
            <div style={{ color: 'rgba(255,255,255,0.78)', fontSize: 12, marginTop: 4 }}>Điền thông tin để tạo lịch đặt sân cho khách hàng</div>
            <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {['✅ Xác nhận ngay', '✅ Ghi chú linh hoạt', '✅ Quản lý tập trung'].map(t => (
                <div key={t} style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11 }}>{t}</div>
              ))}
            </div>
          </div>

          {/* Right form */}
          <div style={{ flex: 1, padding: '24px 28px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontWeight: 700, fontSize: 16, color: '#1f2937', marginBottom: 20 }}>Thông tin đặt sân</div>
            <Form form={addForm} layout="vertical" style={{ flex: 1 }}>
              <Row gutter={12}>
                <Col span={13}>
                  <Form.Item name="userName" label={<span style={{ fontWeight: 600, fontSize: 12 }}>Tên khách hàng</span>}
                    rules={[{ required: true, message: 'Nhập tên!' }]}>
                    <Input prefix={<UserOutlined style={{ color: '#9ca3af' }} />} placeholder="Nguyễn Văn A" style={{ borderRadius: 8, height: 38 }} />
                  </Form.Item>
                </Col>
                <Col span={11}>
                  <Form.Item name="phone" label={<span style={{ fontWeight: 600, fontSize: 12 }}>Số điện thoại</span>}>
                    <Input prefix={<PhoneOutlined style={{ color: '#9ca3af' }} />} placeholder="09xxxxxxxx" style={{ borderRadius: 8, height: 38 }} />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item name="pitchId" label={<span style={{ fontWeight: 600, fontSize: 12 }}>Chọn sân</span>}
                rules={[{ required: true, message: 'Chọn sân!' }]}>
                <Select placeholder="Chọn sân bóng" style={{ height: 38 }}
                  options={pitches.map(p => ({ value: p.id, label: `${p.name} — ${p.type}` }))} />
              </Form.Item>

              <Row gutter={12}>
                <Col span={12}>
                  <Form.Item name="date" label={<span style={{ fontWeight: 600, fontSize: 12 }}>Ngày đặt</span>}
                    initialValue={selectedDate} rules={[{ required: true, message: 'Chọn ngày!' }]}>
                    <DatePicker style={{ width: '100%', height: 38, borderRadius: 8 }} format="DD/MM/YYYY" />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item name="startTime" label={<span style={{ fontWeight: 600, fontSize: 12 }}>Bắt đầu</span>}
                    rules={[{ required: true, message: 'Chọn giờ!' }]}>
                    <TimePicker style={{ width: '100%', height: 38, borderRadius: 8 }} format="HH:mm" minuteStep={30} />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item name="endTime" label={<span style={{ fontWeight: 600, fontSize: 12 }}>Kết thúc</span>}
                    rules={[{ required: true, message: 'Chọn giờ!' }]}>
                    <TimePicker style={{ width: '100%', height: 38, borderRadius: 8 }} format="HH:mm" minuteStep={30} />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item name="price" label={<span style={{ fontWeight: 600, fontSize: 12 }}>Giá tiền (VNĐ)</span>}
                rules={[{ required: true, message: 'Nhập giá!' }]}>
                <Input prefix={<MoneyCollectOutlined style={{ color: '#9ca3af' }} />} type="number" placeholder="300000" style={{ borderRadius: 8, height: 38 }} />
              </Form.Item>

              <Form.Item name="note" label={<span style={{ fontWeight: 600, fontSize: 12 }}>Ghi chú</span>} style={{ marginBottom: 0 }}>
                <Input.TextArea rows={2} placeholder="Ghi chú thêm..." style={{ borderRadius: 8 }} />
              </Form.Item>
            </Form>

            <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
              <Button onClick={() => { setShowAdd(false); addForm.resetFields(); }}
                style={{ flex: 1, height: 42, borderRadius: 8, fontWeight: 600 }}>
                Hủy
              </Button>
              <Button type="primary" onClick={handleAdd}
                style={{ flex: 2, height: 42, borderRadius: 8, background: '#00a67d', fontWeight: 700, fontSize: 14 }}>
                ✅ Xác nhận đặt sân
              </Button>
            </div>
          </div>
        </div>
      </Modal>

      {/* ── DETAIL MODAL ── */}
      <Modal title={<span style={{ fontWeight: 700 }}>📋 Chi tiết đặt sân</span>}
        open={!!detail} onCancel={() => setDetail(null)} footer={null} width={460}>
        {detail && (
          <div style={{ paddingTop: 8 }}>
            <div style={{ background: '#f9fafb', borderRadius: 10, padding: 16, marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 17, color: '#1f2937' }}>{detail.userName}</div>
                  <div style={{ color: '#6b7280', fontSize: 13 }}><PhoneOutlined style={{ marginRight: 4 }} />{detail.phone || '—'}</div>
                </div>
                <Tag color={detail.paymentStatus === 'unpaid' ? 'red' : 'green'} style={{ fontWeight: 600 }}>
                  {PAY_CFG[detail.paymentStatus]?.label}
                </Tag>
              </div>
              {[
                { icon: <CalendarOutlined />, label: 'Ngày', val: dayjs(detail.date).format('DD/MM/YYYY') },
                { icon: <ClockCircleOutlined />, label: 'Giờ', val: `${detail.startTime} – ${detail.endTime}` },
                { icon: <TeamOutlined />, label: 'Sân', val: detail.pitchName },
                { icon: <MoneyCollectOutlined />, label: 'Giá', val: `${detail.price.toLocaleString()} VNĐ` },
                { icon: <UserOutlined />, label: 'Nguồn', val: SRC_LABEL[detail.source || 'admin'] },
              ].map(({ icon, label, val }) => (
                <div key={label} style={{ display: 'flex', gap: 8, marginBottom: 7, fontSize: 14, alignItems: 'center' }}>
                  <span style={{ color: '#9ca3af', width: 18 }}>{icon}</span>
                  <span style={{ color: '#6b7280', width: 55 }}>{label}:</span>
                  <span style={{ fontWeight: 600, color: '#1f2937' }}>{val}</span>
                </div>
              ))}
              {detail.note && (
                <div style={{ marginTop: 8, padding: '7px 12px', background: '#fef9c3', borderRadius: 8, fontSize: 13, color: '#854d0e' }}>
                  📝 {detail.note}
                </div>
              )}
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {detail.paymentStatus === 'unpaid' && (
                <Button icon={<CheckCircleOutlined />} type="primary" style={{ background: '#10b981', flex: 1 }}
                  onClick={() => { updatePaymentStatus(detail.id, 'deposited'); setDetail({ ...detail, paymentStatus: 'deposited' }); message.success('Cập nhật: Đã cọc'); }}>
                  Xác nhận cọc
                </Button>
              )}
              {detail.paymentStatus === 'deposited' && (
                <Button icon={<CheckCircleOutlined />} type="primary" style={{ background: '#059669', flex: 1 }}
                  onClick={() => { updatePaymentStatus(detail.id, 'paid'); setDetail({ ...detail, paymentStatus: 'paid' }); message.success('Đã thanh toán đủ!'); }}>
                  Thanh toán đủ
                </Button>
              )}
              {detail.status !== 'cancelled' && (
                <Button icon={<CloseCircleOutlined />} danger
                  onClick={() => { updateBookingStatus(detail.id, 'cancelled'); setDetail({ ...detail, status: 'cancelled' }); message.warning('Đã hủy đặt sân'); }}>
                  Hủy đặt
                </Button>
              )}
              <Popconfirm title="Xác nhận xóa?" onConfirm={() => { deleteBooking(detail.id); setDetail(null); message.success('Đã xóa!'); }} okText="Xóa" cancelText="Thôi">
                <Button icon={<DeleteOutlined />} danger type="primary">Xóa</Button>
              </Popconfirm>
            </div>
          </div>
        )}
      </Modal>
    </PageContainer>
  );
};

export default AdminScheduleGrid;