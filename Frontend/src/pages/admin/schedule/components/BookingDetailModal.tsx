import React from 'react';
import { Modal, Tag, Button, Popconfirm, message } from 'antd';
import {
  CalendarOutlined, ClockCircleOutlined, TeamOutlined,
  MoneyCollectOutlined, UserOutlined, PhoneOutlined,
  CheckCircleOutlined, CloseCircleOutlined, DeleteOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import type { Booking, PaymentStatus, BookingStatus } from '@/entities/booking/model/types';

interface PaymentConfig {
  bg: string;
  label: string;
}

const PAY_CFG: Record<string, PaymentConfig> = {
  deposited: { bg: '#10b981', label: 'Đã cọc' },
  paid: { bg: '#059669', label: 'Đã thanh toán' },
  unpaid: { bg: '#f87171', label: 'Chưa TT' },
};

const SRC_LABEL: Record<string, string> = {
  app: '📱 App', phone: '📞 Điện thoại', admin: '🖥️ Admin',
};

interface BookingDetailModalProps {
  detail: Booking | null;
  onClose: () => void;
  onUpdatePayment: (id: string, status: PaymentStatus) => void;
  onUpdateStatus: (id: string, status: BookingStatus) => void;
  onDelete: (id: string) => void;
  onDetailChange: (booking: Booking) => void;
}

const BookingDetailModal: React.FC<BookingDetailModalProps> = ({
  detail, onClose, onUpdatePayment, onUpdateStatus, onDelete, onDetailChange,
}) => {
  const infoRows = detail
    ? [
        { icon: <CalendarOutlined />, label: 'Ngày', val: dayjs(detail.date).format('DD/MM/YYYY') },
        { icon: <ClockCircleOutlined />, label: 'Giờ', val: `${detail.startTime} – ${detail.endTime}` },
        { icon: <TeamOutlined />, label: 'Sân', val: detail.pitchName },
        { icon: <MoneyCollectOutlined />, label: 'Giá', val: `${detail.price.toLocaleString()} VNĐ` },
        { icon: <UserOutlined />, label: 'Nguồn', val: SRC_LABEL[detail.source ?? 'admin'] },
      ]
    : [];

  return (
    <Modal title={<span style={{ fontWeight: 700 }}>📋 Chi tiết đặt sân</span>}
      open={!!detail} onCancel={onClose} footer={null} width={460}>
      {detail && (
        <div style={{ paddingTop: 8 }}>
          <div style={{ background: '#f9fafb', borderRadius: 10, padding: 16, marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div>
                <div style={{ fontWeight: 800, fontSize: 17, color: '#1f2937' }}>{detail.userName}</div>
                <div style={{ color: '#6b7280', fontSize: 13 }}>
                  <PhoneOutlined style={{ marginRight: 4 }} />{detail.phone ?? '—'}
                </div>
              </div>
              <Tag color={detail.paymentStatus === 'unpaid' ? 'red' : 'green'} style={{ fontWeight: 600 }}>
                {PAY_CFG[detail.paymentStatus]?.label}
              </Tag>
            </div>

            {infoRows.map(({ icon, label, val }) => (
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
              <Button icon={<CheckCircleOutlined />} type="primary"
                style={{ background: '#10b981', flex: 1 }}
                onClick={() => {
                  onUpdatePayment(detail.id, 'deposited');
                  onDetailChange({ ...detail, paymentStatus: 'deposited' });
                  message.success('Cập nhật: Đã cọc');
                }}>
                Xác nhận cọc
              </Button>
            )}
            {detail.paymentStatus === 'deposited' && (
              <Button icon={<CheckCircleOutlined />} type="primary"
                style={{ background: '#059669', flex: 1 }}
                onClick={() => {
                  onUpdatePayment(detail.id, 'paid');
                  onDetailChange({ ...detail, paymentStatus: 'paid' });
                  message.success('Đã thanh toán đủ!');
                }}>
                Thanh toán đủ
              </Button>
            )}
            {detail.status !== 'cancelled' && (
              <Button icon={<CloseCircleOutlined />} danger
                onClick={() => {
                  onUpdateStatus(detail.id, 'cancelled');
                  onDetailChange({ ...detail, status: 'cancelled' });
                  message.warning('Đã hủy đặt sân');
                }}>
                Hủy đặt
              </Button>
            )}
            <Popconfirm title="Xác nhận xóa?"
              onConfirm={() => { onDelete(detail.id); onClose(); message.success('Đã xóa!'); }}
              okText="Xóa" cancelText="Thôi">
              <Button icon={<DeleteOutlined />} danger type="primary">Xóa</Button>
            </Popconfirm>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default BookingDetailModal;
