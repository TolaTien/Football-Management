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
  onRefund: (id: string) => void;
}

export const BookingDetailModal: React.FC<BookingDetailModalProps> = ({
  detail, onClose, onUpdatePayment, onUpdateStatus, onDelete, onDetailChange, onRefund,
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
    <Modal 
      title={<span className="font-extrabold text-slate-800 text-lg">📋 Chi tiết đặt sân</span>}
      open={!!detail} 
      onCancel={onClose} 
      footer={null} 
      width={460}
      className="rounded-2xl overflow-hidden"
    >
      {detail && (
        <div className="pt-2">
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 mb-5 shadow-inner">
            <div className="flex justify-between items-center mb-4">
              <div>
                <div className="font-extrabold text-lg text-slate-800 leading-tight">{detail.userName}</div>
                <div className="text-slate-400 text-xs mt-1 flex items-center">
                  <PhoneOutlined className="mr-1.5" />{detail.phone ?? '—'}
                </div>
              </div>
              <Tag color={detail.paymentStatus === 'unpaid' ? 'red' : 'green'} className="font-bold border-none rounded-full px-3 py-0.5">
                {PAY_CFG[detail.paymentStatus]?.label}
              </Tag>
            </div>

            <div className="space-y-2.5">
              {infoRows.map(({ icon, label, val }) => (
                <div key={label} className="flex gap-2 text-xs items-center">
                  <span className="text-slate-400 w-5 flex justify-center text-sm">{icon}</span>
                  <span className="text-slate-400 w-14 font-medium">{label}:</span>
                  <span className="font-bold text-slate-700">{val}</span>
                </div>
              ))}
            </div>

            {detail.note && (
              <div className="mt-4 p-3 bg-amber-50/70 border border-amber-100 rounded-xl text-xs text-amber-800 leading-relaxed font-medium">
                📝 {detail.note}
              </div>
            )}
          </div>

          <div className="flex gap-2 flex-wrap">
            {detail.paymentStatus === 'unpaid' && (
              <Button icon={<CheckCircleOutlined />} type="primary"
                className="bg-emerald-500 border-emerald-500 hover:bg-emerald-600 hover:border-emerald-600 rounded-xl h-10 font-bold flex-1 flex items-center justify-center"
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
                className="bg-emerald-600 border-emerald-600 hover:bg-emerald-700 hover:border-emerald-700 rounded-xl h-10 font-bold flex-1 flex items-center justify-center"
                onClick={() => {
                  onUpdatePayment(detail.id, 'paid');
                  onDetailChange({ ...detail, paymentStatus: 'paid' });
                  message.success('Đã thanh toán đủ!');
                }}>
                Thanh toán đủ
              </Button>
            )}
            {detail.status !== 'cancelled' && detail.status !== 'rejected' && (
              <Button icon={<CloseCircleOutlined />} danger
                className="rounded-xl h-10 font-bold hover:bg-red-50"
                onClick={() => {
                  onUpdateStatus(detail.id, 'cancelled');
                  onDetailChange({ ...detail, status: 'cancelled' });
                  message.warning('Đã hủy đặt sân');
                }}>
                Hủy đặt
              </Button>
            )}
            {(detail.status === 'rejected' || detail.status === 'cancelled') && detail.paymentStatus === 'deposited' && (
              <Button icon={<ReloadOutlined />} type="dashed" danger
                className="rounded-xl h-10 font-bold"
                onClick={() => {
                  onRefund(detail.id);
                  onDetailChange({ ...detail, paymentStatus: 'unpaid' });
                }}>
                Hoàn cọc
              </Button>
            )}
            <Popconfirm title="Xác nhận xóa lịch đặt này?"
              onConfirm={() => { onDelete(detail.id); onClose(); message.success('Đã xóa!'); }}
              okText="Xóa" cancelText="Thôi">
              <Button icon={<DeleteOutlined />} danger type="primary" className="rounded-xl h-10 font-bold flex items-center justify-center">Xóa</Button>
            </Popconfirm>
          </div>
        </div>
      )}
    </Modal>
  );
};
