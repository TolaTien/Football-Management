import React, { useState } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { Card, Modal, Button, Form, Input, DatePicker, message, Badge } from 'antd';
import dayjs from 'dayjs';

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
  { id: 'p1', name: 'Sân 5A' },
  { id: 'p2', name: 'Sân 5B' },
  { id: 'p3', name: 'Sân 7A' },
  { id: 'p4', name: 'Sân 11' },
];

const mockBookings = [
  { id: 'b1', pitchId: 'p1', startIdx: 24, endIdx: 26, status: 'booked', user: 'Nguyễn Văn A' }, // 18:00 - 19:30
  { id: 'b2', pitchId: 'p3', startIdx: 27, endIdx: 29, status: 'pending', user: 'Trần B' }, // 19:30 - 21:00
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
        const status = getCellStatus(pitchId, i);
        // We only check against mockBookings directly to avoid selection state interference
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

  return (
    <PageContainer title="Quản lý Lịch Sân" ghost>
      <Card className="card-minimal" title="Lịch hôm nay" extra={<DatePicker defaultValue={dayjs()} format="DD/MM/YYYY" />}>
        <div style={{ marginBottom: 16, display: 'flex', gap: 16 }}>
          <Badge color="#48bb78" text="Trống (Kéo thả để đặt)" />
          <Badge color="#f56565" text="Đã đặt" />
          <Badge color="#ecc94b" text="Chờ thanh toán" />
        </div>

        <div className="admin-grid-container" onMouseUp={handleMouseUp} onMouseLeave={() => setIsDragging(false)}>
          {/* Time Column */}
          <div className="time-column">
            <div className="grid-header">Giờ</div>
            {timeSlots.map((time, idx) => (
              <div key={idx} className="grid-cell" style={{ cursor: 'default', color: '#718096' }}>
                {time}
              </div>
            ))}
          </div>

          {/* Pitch Columns */}
          {pitches.map((pitch) => (
            <div key={pitch.id} className="pitch-column">
              <div className="grid-header">{pitch.name}</div>
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
                    className={`grid-cell ${status}`}
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

      <Modal
        title="Xác nhận đặt sân nhanh"
        open={isModalVisible}
        onCancel={handleCancelBooking}
        onOk={handleConfirmBooking}
        okText="Xác nhận đặt"
        cancelText="Hủy"
        className="minimal-modal"
      >
        {selection && (
          <Form layout="vertical">
            <Form.Item label="Sân">
              <Input value={pitches.find(p => p.id === selection.pitchId)?.name} readOnly />
            </Form.Item>
            <Form.Item label="Thời gian">
              <Input 
                value={`${timeSlots[Math.min(selection.startIdx, selection.endIdx)]} - ${timeSlots[Math.max(selection.startIdx, selection.endIdx)]} (+30p)`} 
                readOnly 
              />
            </Form.Item>
            <Form.Item label="Khách hàng">
              <Input placeholder="Nhập tên hoặc số điện thoại khách hàng" autoFocus />
            </Form.Item>
            <div style={{ padding: 12, background: 'rgba(0, 77, 64, 0.05)', borderRadius: 8 }}>
                <strong>Dự tính: </strong> 
                <span style={{ color: '#004d40', fontSize: 18, fontWeight: 600 }}>
                    {((Math.max(selection.startIdx, selection.endIdx) - Math.min(selection.startIdx, selection.endIdx) + 1) * 150000).toLocaleString()}đ
                </span>
            </div>
          </Form>
        )}
      </Modal>
    </PageContainer>
  );
};

export default AdminSchedule;
