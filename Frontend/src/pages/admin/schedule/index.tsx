import React, { useState } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { Card, Modal, Button, Form, Input, DatePicker, message, Typography, Row, Col } from 'antd';
import { SearchOutlined, FilterOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

// Time slots from 06:00 to 23:00 (30 min intervals)
const generateTimeSlots = () => {
  const slots = [];
  for (let i = 6; i < 23; i++) {
    slots.push(`${i.toString().padStart(2, '0')}:00`);
    slots.push(`${i.toString().padStart(2, '0')}:30`);
  }
  return slots;
};
const timeSlots = generateTimeSlots();

const pitches = [
  { id: 'p1', name: 'Sân 5 - A1' },
  { id: 'p2', name: 'Sân 5 - A2' },
  { id: 'p3', name: 'Sân 7 - B1' },
  { id: 'p4', name: 'Sân 7 - B2' },
];

const mockBookings = [
  { id: 'b1', pitchId: 'p1', startIdx: 24, endIdx: 26, status: 'booked', user: 'Nguyễn Văn Hùng' }, // 18:00 - 19:30
  { id: 'b2', pitchId: 'p3', startIdx: 27, endIdx: 29, status: 'pending', user: 'Trần Bình' }, // 19:30 - 21:00
  { id: 'b3', pitchId: 'p2', startIdx: 20, endIdx: 23, status: 'booked', user: 'FC The Boys' }, // 16:00 - 18:00
];

const AdminSchedule: React.FC = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [selection, setSelection] = useState<{ pitchId: string; startIdx: number; endIdx: number } | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const getCellStatus = (pitchId: string, slotIdx: number) => {
    // Check if within current selection
    if (selection && selection.pitchId === pitchId) {
      const minIdx = Math.min(selection.startIdx, selection.endIdx);
      const maxIdx = Math.max(selection.startIdx, selection.endIdx);
      if (slotIdx >= minIdx && slotIdx <= maxIdx) return 'selected';
    }

    // Check existing bookings
    const booking = mockBookings.find(
      (b) => b.pitchId === pitchId && slotIdx >= b.startIdx && slotIdx <= b.endIdx
    );
    if (booking) return booking.status; // 'booked' | 'pending'

    return 'available';
  };

  const handleMouseDown = (pitchId: string, slotIdx: number) => {
    const status = getCellStatus(pitchId, slotIdx);
    if (status === 'booked' || status === 'pending') return;
    setIsDragging(true);
    setSelection({ pitchId, startIdx: slotIdx, endIdx: slotIdx });
  };

  const handleMouseEnter = (pitchId: string, slotIdx: number) => {
    if (!isDragging || !selection) return;
    if (selection.pitchId !== pitchId) return; // Only allow vertical drag

    const minIdx = Math.min(selection.startIdx, slotIdx);
    const maxIdx = Math.max(selection.startIdx, slotIdx);
    
    // Check for overlap with existing bookings during drag
    let hasOverlap = false;
    for (let i = minIdx; i <= maxIdx; i++) {
        const isBooked = mockBookings.some(b => b.pitchId === pitchId && i >= b.startIdx && i <= b.endIdx);
        if (isBooked) hasOverlap = true;
    }

    if (!hasOverlap) {
        setSelection({ ...selection, endIdx: slotIdx });
    }
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    if (selection) {
      setIsModalVisible(true);
    }
  };

  const handleCancelBooking = () => {
    setSelection(null);
    setIsModalVisible(false);
  };

  const handleConfirmBooking = () => {
    message.success('Tạo lịch đặt sân thành công!');
    setSelection(null);
    setIsModalVisible(false);
  };

  const calculatePrice = () => {
    if (!selection) return 0;
    const slotsCount = Math.max(selection.startIdx, selection.endIdx) - Math.min(selection.startIdx, selection.endIdx) + 1;
    // Assuming 300,000 VND per hour => 150,000 VND per 30 mins
    return slotsCount * 150000;
  };

  return (
    <PageContainer
      header={{
        title: <Title level={2} style={{ margin: 0, fontWeight: 700 }}>Lịch đặt sân</Title>,
        subTitle: <Text style={{ color: '#6b7280', fontSize: 14 }}>Quản lý thời gian, kéo thả để tạo lịch đặt sân nhanh chóng.</Text>,
      }}
    >
      <Card className="card-arena" bordered={false} bodyStyle={{ padding: 24 }}>
        {/* Toolbar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', gap: 16 }}>
            <DatePicker defaultValue={dayjs()} format="DD/MM/YYYY" size="large" style={{ borderRadius: 8, width: 240 }} />
            <Input prefix={<SearchOutlined />} placeholder="Tìm khách hàng..." size="large" style={{ borderRadius: 8, width: 240 }} />
          </div>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: 16, fontSize: 13, color: '#4b5563', marginRight: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><div style={{ width: 12, height: 12, borderRadius: 4, backgroundColor: '#ffffff', border: '1px solid #e5e7eb' }} /> Trống</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><div style={{ width: 12, height: 12, borderRadius: 4, backgroundColor: '#00a67d' }} /> Đang chọn</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><div style={{ width: 12, height: 12, borderRadius: 4, backgroundColor: '#fee2e2' }} /> Đã đặt</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><div style={{ width: 12, height: 12, borderRadius: 4, backgroundColor: '#fef3c7' }} /> Chờ duyệt</div>
            </div>
            <Button icon={<FilterOutlined />} size="large" style={{ borderRadius: 8 }}>Bộ lọc</Button>
          </div>
        </div>

        {/* Schedule Grid */}
        <div className="arena-schedule-grid" onMouseUp={handleMouseUp} onMouseLeave={() => setIsDragging(false)}>
          {/* Time Column */}
          <div className="arena-time-col">
            <div className="arena-grid-header">Giờ</div>
            {timeSlots.map((time, idx) => (
              <div key={idx} className="arena-cell time-label">
                {time}
              </div>
            ))}
          </div>

          {/* Pitch Columns */}
          {pitches.map((pitch) => (
            <div key={pitch.id} className="arena-pitch-col">
              <div className="arena-grid-header">{pitch.name}</div>
              {timeSlots.map((_, idx) => {
                const status = getCellStatus(pitch.id, idx);
                let displayContent = null;

                // Show user name if it's the start of a booking
                const booking = mockBookings.find(b => b.pitchId === pitch.id && b.startIdx === idx);
                if (booking) displayContent = booking.user;

                // Show temporary selection text
                if (status === 'selected' && idx === Math.min(selection!.startIdx, selection!.endIdx)) {
                    const minIdx = Math.min(selection!.startIdx, selection!.endIdx);
                    const maxIdx = Math.max(selection!.startIdx, selection!.endIdx);
                    const durationMins = (maxIdx - minIdx + 1) * 30;
                    displayContent = `Đang chọn... (${durationMins} phút)`;
                }

                return (
                  <div
                    key={idx}
                    className={`arena-cell ${status}`}
                    onMouseDown={() => handleMouseDown(pitch.id, idx)}
                    onMouseEnter={() => handleMouseEnter(pitch.id, idx)}
                  >
                    {displayContent}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </Card>

      {/* Booking Modal */}
      <Modal
        title={<div style={{ fontSize: 18, fontWeight: 700, color: '#1f2937' }}>Xác nhận đặt sân nhanh</div>}
        open={isModalVisible}
        onCancel={handleCancelBooking}
        footer={null}
        width={480}
        style={{ borderRadius: 12 }}
        bodyStyle={{ paddingTop: 16 }}
      >
        {selection && (
          <Form layout="vertical">
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label={<span style={{ fontWeight: 600, color: '#4b5563' }}>Sân bóng</span>}>
                  <Input value={pitches.find(p => p.id === selection.pitchId)?.name} readOnly size="large" style={{ borderRadius: 8, backgroundColor: '#f9fafb', color: '#1f2937', fontWeight: 600 }} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label={<span style={{ fontWeight: 600, color: '#4b5563' }}>Thời gian</span>}>
                  <Input 
                    value={`${timeSlots[Math.min(selection.startIdx, selection.endIdx)]} - ${timeSlots[Math.max(selection.startIdx, selection.endIdx)]} (+30p)`} 
                    readOnly 
                    size="large"
                    style={{ borderRadius: 8, backgroundColor: '#f9fafb', color: '#1f2937', fontWeight: 600 }}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item label={<span style={{ fontWeight: 600, color: '#4b5563' }}>Khách hàng</span>} required>
              <Input placeholder="Nhập tên hoặc số điện thoại khách hàng" autoFocus size="large" style={{ borderRadius: 8 }} />
            </Form.Item>

            <Form.Item label={<span style={{ fontWeight: 600, color: '#4b5563' }}>Ghi chú</span>}>
              <Input.TextArea placeholder="Ghi chú thêm (nếu có)" rows={2} style={{ borderRadius: 8 }} />
            </Form.Item>

            <div style={{ marginTop: 24, padding: 20, background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#047857', fontWeight: 600, fontSize: 15 }}>Tổng tiền dự tính:</span> 
              <span style={{ color: '#00a67d', fontSize: 24, fontWeight: 700 }}>
                  {calculatePrice().toLocaleString()}đ
              </span>
            </div>

            <div style={{ display: 'flex', gap: 12, marginTop: 24, justifyContent: 'flex-end' }}>
              <Button size="large" onClick={handleCancelBooking} style={{ borderRadius: 8, fontWeight: 500 }}>
                Hủy bỏ
              </Button>
              <Button type="primary" size="large" onClick={handleConfirmBooking} style={{ backgroundColor: '#00a67d', borderRadius: 8, fontWeight: 500, padding: '0 32px' }}>
                Xác nhận đặt
              </Button>
            </div>
          </Form>
        )}
      </Modal>
    </PageContainer>
  );
};

export default AdminSchedule;
