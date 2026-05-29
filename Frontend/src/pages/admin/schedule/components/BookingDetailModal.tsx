import React from 'react';
import { Modal, Tag, Button, Popconfirm, message } from 'antd';
import {
  CalendarOutlined, ClockCircleOutlined, TeamOutlined,
  MoneyCollectOutlined, UserOutlined, PhoneOutlined,
  CheckCircleOutlined, CloseCircleOutlined, DeleteOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import type { Booking, PaymentStatus, BookingStatus } from '@/entities/booking/model/types';

interface PaymentConfig {
  bg: string;
  label: string;
}

const PAY_CFG: Record<string, PaymentConfig> = {
  deposited: { bg: '#10b981', label: 'Đã cọc' },
  paid: { bg: '#059669', label: 'Đã thanh toán toàn bộ' },
  unpaid: { bg: '#ef4444', label: 'Chưa TT' },
};

const STATUS_CFG: Record<string, { label: string; color: string; bg: string }> = {
  pending: { label: 'Đang chờ', color: '#d97706', bg: '#fef3c7' },
  approved: { label: 'Đã duyệt', color: '#16a34a', bg: '#dcfce7' },
  rejected: { label: 'Từ chối', color: '#dc2626', bg: '#fee2e2' },
  cancelled: { label: 'Đã hủy', color: '#4b5563', bg: '#f3f4f6' },
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
  onRefund: (id: string) => void;
}

const BookingDetailModal: React.FC<BookingDetailModalProps> = ({
  detail, onClose, onUpdatePayment, onUpdateStatus, onDelete, onDetailChange, onRefund,
}) => {
  if (!detail) return null;

  const firstChar = detail.userName ? detail.userName.charAt(0).toUpperCase() : 'U';

  const infoItems = [
    {
      icon: <TeamOutlined style={{ fontSize: 15, color: '#059669' }} />,
      bg: '#ecfdf5',
      label: 'Sân bóng',
      val: detail.pitchName,
    },
    {
      icon: <CalendarOutlined style={{ fontSize: 15, color: '#3b82f6' }} />,
      bg: '#eff6ff',
      label: 'Ngày đặt',
      val: dayjs(detail.date).format('DD/MM/YYYY'),
    },
    {
      icon: <ClockCircleOutlined style={{ fontSize: 15, color: '#8b5cf6' }} />,
      bg: '#f5f3ff',
      label: 'Khung giờ',
      val: `${detail.startTime} – ${detail.endTime}`,
    },
    {
      icon: <UserOutlined style={{ fontSize: 15, color: '#eab308' }} />,
      bg: '#fef9c3',
      label: 'Nguồn đặt',
      val: SRC_LABEL[detail.source ?? 'admin'] || '🖥️ Admin',
    },
  ];

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingBottom: 10, borderBottom: '1px solid #f1f5f9' }}>
          <span style={{ fontSize: 19, fontWeight: 800, color: '#0f172a' }}>📋 Chi tiết đặt sân</span>
        </div>
      }
      open={!!detail}
      onCancel={onClose}
      footer={null}
      width={480}
      style={{ top: 100 }}
      closeIcon={<span style={{ fontSize: 16, color: '#94a3b8' }}>✕</span>}
      styles={{
        body: { padding: '16px 4px 4px 4px' }
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {/* Customer Profile Card */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '14px 16px',
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: 12,
          marginBottom: 16,
          boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
        }}>
          <div style={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: 20,
            boxShadow: '0 4px 10px rgba(59, 130, 246, 0.15)'
          }}>
            {firstChar}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 800, fontSize: 18, color: '#0f172a', lineHeight: '1.2' }}>{detail.userName}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#64748b', fontSize: 14, marginTop: 4 }}>
              <PhoneOutlined style={{ color: '#3b82f6' }} />
              <span style={{ fontWeight: 500 }}>{detail.phone ?? '—'}</span>
            </div>
          </div>
          <div>
            <span style={{
              fontSize: 12,
              fontWeight: 700,
              color: STATUS_CFG[detail.status ?? 'pending']?.color || '#4b5563',
              backgroundColor: STATUS_CFG[detail.status ?? 'pending']?.bg || '#f3f4f6',
              padding: '5px 10px',
              borderRadius: 6,
              textTransform: 'uppercase',
              letterSpacing: '0.02em',
              display: 'inline-block'
            }}>
              {STATUS_CFG[detail.status ?? 'pending']?.label}
            </span>
          </div>
        </div>

        {/* Pitch & Booking Grid (2x2) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 12,
          marginBottom: 16
        }}>
          {infoItems.map(({ icon, bg, label, val }) => (
            <div key={label} style={{
              padding: '12px 14px',
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: 12,
              display: 'flex',
              flexDirection: 'column',
              gap: 6
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{
                  width: 24,
                  height: 24,
                  borderRadius: 6,
                  backgroundColor: bg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {icon}
                </div>
                <span style={{ fontSize: 12, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.02em' }}>{label}</span>
              </div>
              <span style={{ fontSize: 15, fontWeight: 700, color: '#1e293b' }}>{val}</span>
            </div>
          ))}
        </div>

        {/* Cost & Payment Banner */}
        <div style={{
          background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
          border: '1px solid #e2e8f0',
          borderRadius: 12,
          padding: '14px 16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16
        }}>
          <div>
            <span style={{ fontSize: 12, fontWeight: 600, color: '#64748b', display: 'block', marginBottom: 2, textTransform: 'uppercase', letterSpacing: '0.02em' }}>Tổng chi phí</span>
            <span style={{ fontSize: 21, fontWeight: 850, color: '#0f172a' }}>
              {detail.price.toLocaleString()} <span style={{ fontSize: 14, fontWeight: 600, color: '#64748b' }}>VNĐ</span>
            </span>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: '#94a3b8', display: 'block', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.02em' }}>Thanh toán</span>
            <span style={{
              fontSize: 13,
              fontWeight: 800,
              color: '#fff',
              backgroundColor: PAY_CFG[detail.paymentStatus]?.bg || '#94a3b8',
              padding: '6px 14px',
              borderRadius: 30,
              boxShadow: `0 2px 8px ${(PAY_CFG[detail.paymentStatus]?.bg || '#94a3b8')}30`,
              display: 'inline-block'
            }}>
              {PAY_CFG[detail.paymentStatus]?.label}
            </span>
          </div>
        </div>

        {/* Note (if exists) */}
        {detail.note && (
          <div style={{
            background: '#fffbeb',
            border: '1px solid #fef3c7',
            borderRadius: 12,
            padding: '12px 14px',
            marginBottom: 16,
            display: 'flex',
            gap: 8,
            alignItems: 'flex-start'
          }}>
            <span style={{ fontSize: 16, lineHeight: 1 }}>📝</span>
            <div>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#b45309', display: 'block', textTransform: 'uppercase', marginBottom: 2, letterSpacing: '0.02em' }}>Ghi chú từ khách</span>
              <span style={{ fontSize: 14, fontWeight: 500, color: '#78350f', lineHeight: '1.4' }}>{detail.note}</span>
            </div>
          </div>
        )}

        {/* Action Panel */}
        <div style={{
          display: 'flex',
          gap: 10,
          marginTop: 8,
          paddingTop: 16,
          borderTop: '1px solid #f1f5f9',
          alignItems: 'center',
          justifyContent: 'flex-end',
          flexWrap: 'wrap'
        }}>
          {/* Popconfirm Delete */}
          <Popconfirm
            title="Xác nhận xóa lượt đặt sân?"
            description="Thao tác này không thể khôi phục."
            onConfirm={() => {
              onDelete(detail.id);
              onClose();
              message.success('Đã xóa lượt đặt sân thành công');
            }}
            okText="Xóa"
            cancelText="Thôi"
            okButtonProps={{ danger: true }}
          >
            <Button
              icon={<DeleteOutlined />}
              danger
              style={{
                height: 40,
                borderRadius: 8,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 600,
              }}
            />
          </Popconfirm>

          <div style={{ flex: 1 }} />

          {/* Cancel Booking Button */}
          {detail.status !== 'cancelled' && detail.status !== 'rejected' && (
            <Button
              icon={<CloseCircleOutlined />}
              danger
              style={{
                height: 40,
                borderRadius: 8,
                fontWeight: 600,
                borderColor: '#fca5a5',
                color: '#ef4444',
                backgroundColor: '#fff',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6
              }}
              onClick={() => {
                onUpdateStatus(detail.id, 'cancelled');
                onDetailChange({ ...detail, status: 'cancelled' });
                message.warning('Đã hủy đặt sân');
              }}
            >
              Hủy đặt
            </Button>
          )}

          {/* Refund Deposit Button */}
          {(detail.status === 'rejected' || detail.status === 'cancelled') && detail.paymentStatus === 'deposited' && (
            <Button
              icon={<ReloadOutlined />}
              type="dashed"
              danger
              style={{
                height: 40,
                borderRadius: 8,
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6
              }}
              onClick={() => {
                onRefund(detail.id);
                onDetailChange({ ...detail, paymentStatus: 'unpaid' });
                message.success('Đã hoàn trả tiền đặt cọc');
              }}
            >
              Hoàn cọc
            </Button>
          )}

          {/* Primary Call-to-Action (Confirm Deposit / Full Payment) */}
          {detail.paymentStatus === 'unpaid' && (
            <Button
              icon={<CheckCircleOutlined />}
              type="primary"
              style={{
                background: '#10b981',
                borderColor: '#10b981',
                height: 40,
                borderRadius: 8,
                fontWeight: 700,
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6
              }}
              onClick={() => {
                onUpdatePayment(detail.id, 'deposited');
                onDetailChange({ ...detail, paymentStatus: 'deposited' });
                message.success('Cập nhật trạng thái: Đã đặt cọc');
              }}
            >
              Xác nhận cọc
            </Button>
          )}

          {detail.paymentStatus === 'deposited' && (
            <Button
              icon={<CheckCircleOutlined />}
              type="primary"
              style={{
                background: '#059669',
                borderColor: '#059669',
                height: 40,
                borderRadius: 8,
                fontWeight: 700,
                boxShadow: '0 4px 12px rgba(5, 150, 105, 0.2)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6
              }}
              onClick={() => {
                onUpdatePayment(detail.id, 'paid');
                onDetailChange({ ...detail, paymentStatus: 'paid' });
                message.success('Cập nhật trạng thái: Đã thanh toán toàn bộ');
              }}
            >
              Thanh toán đủ
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default BookingDetailModal;

