import React from 'react';
import { Modal, Tag, Button, Popconfirm, message } from 'antd';
import {
  CalendarOutlined, ClockCircleOutlined, TeamOutlined,
  MoneyCollectOutlined, UserOutlined, PhoneOutlined,
  CheckCircleOutlined, CloseCircleOutlined, DeleteOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import type { Booking, PaymentStatus, BookingStatus } from '@/entities/booking/model/types';

interface PaymentConfig {
  bg: string;
  label: string;
}

const PAY_CFG: Record<string, PaymentConfig> = {
  deposited: { bg: '#3b82f6', label: 'Đã cọc 50%' },
  paid: { bg: '#10b981', label: 'Đã thanh toán đủ' },
  unpaid: { bg: '#ef4444', label: 'Chưa thanh toán' },
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
        { icon: <MoneyCollectOutlined />, label: 'Giá sân', val: `${(detail.pitchPriceAtBooking || detail.price || 0).toLocaleString()} VNĐ` },
        { icon: <UserOutlined />, label: 'Nguồn', val: SRC_LABEL[detail.source ?? 'admin'] },
      ]
    : [];

  // Calculate service cost and detailed pricing
  const totalServices = detail
    ? (detail.bookingservices || []).reduce(
        (acc: number, cur: any) => acc + (cur.servicePriceAtBooking || cur.services?.price || 0) * cur.quantity,
        0
      )
    : 0;

  const pitchPrice = detail ? (detail.pitchPriceAtBooking || detail.price || 0) : 0;
  const fullAmount = pitchPrice + totalServices;

  // Determine amount already paid
  const isPaid = detail?.paymentStatus === 'paid';
  const isDeposited = detail?.paymentStatus === 'deposited';
  const depositAmount = detail?.total || (Math.floor(pitchPrice / 2) + totalServices);
  const computedPaid = isPaid ? fullAmount : (isDeposited ? depositAmount : 0);
  const remainingAmount = Math.max(0, fullAmount - computedPaid);

  return (
    <Modal 
      title={<span className="font-extrabold text-slate-800 text-lg">📋 Chi tiết đặt sân</span>}
      open={!!detail} 
      onCancel={onClose} 
      footer={null} 
      width={480}
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
              <Tag 
                color={
                  detail.paymentStatus === 'unpaid' ? 'error' : 
                  detail.paymentStatus === 'deposited' ? 'processing' : 'success'
                } 
                className="font-bold border-none rounded-full px-3 py-0.5"
              >
                {PAY_CFG[detail.paymentStatus]?.label || detail.paymentStatus}
              </Tag>
            </div>

            <div className="space-y-2.5">
              {infoRows.map(({ icon, label, val }) => (
                <div key={label} className="flex gap-2 text-xs items-center">
                  <span className="text-slate-400 w-5 flex justify-center text-sm">{icon}</span>
                  <span className="text-slate-400 w-16 font-medium">{label}:</span>
                  <span className="font-bold text-slate-700">{val}</span>
                </div>
              ))}
            </div>

            {/* List Services */}
            {detail.bookingservices && detail.bookingservices.length > 0 && (
              <div className="mt-4 pt-3 border-t border-dashed border-slate-200">
                <span className="text-slate-400 text-xs font-semibold block mb-1">Dịch vụ đi kèm:</span>
                <div className="space-y-1">
                  {detail.bookingservices.map((srv, idx) => {
                    const price = srv.servicePriceAtBooking || srv.services?.price || 0;
                    return (
                      <div key={idx} className="flex justify-between text-xs text-slate-600">
                        <span>• {srv.services?.nameProduct || 'Dịch vụ'} (x{srv.quantity})</span>
                        <span className="font-semibold font-mono">{(price * srv.quantity).toLocaleString()}đ</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Financial breakdown */}
            <div className="mt-4 pt-4 border-t border-dashed border-slate-200 space-y-1.5 text-xs">
              <div className="flex justify-between items-center text-slate-500">
                <span>Tiền sân gốc:</span>
                <span className="font-semibold text-slate-700 font-mono">{pitchPrice.toLocaleString()}đ</span>
              </div>
              {totalServices > 0 && (
                <div className="flex justify-between items-center text-slate-500">
                  <span>Tiền dịch vụ:</span>
                  <span className="font-semibold text-slate-700 font-mono">+{totalServices.toLocaleString()}đ</span>
                </div>
              )}
              <div className="flex justify-between items-center font-bold text-slate-800 text-sm pt-1 border-t border-slate-100">
                <span>Tổng chi phí:</span>
                <span className="font-mono text-emerald-600">{fullAmount.toLocaleString()}đ</span>
              </div>
              <div className="flex justify-between items-center text-slate-500 pt-1">
                <span>Đã thanh toán (Cọc):</span>
                <span className="font-semibold text-blue-600 font-mono">{computedPaid.toLocaleString()}đ</span>
              </div>
              {remainingAmount > 0 ? (
                <div className="flex justify-between items-center text-amber-700 font-bold pt-1.5 border-t border-dashed border-slate-200">
                  <span>Còn lại cần thu tại quầy:</span>
                  <span className="font-mono text-base text-amber-600">{remainingAmount.toLocaleString()}đ</span>
                </div>
              ) : (
                <div className="flex justify-between items-center text-emerald-700 font-bold pt-1.5 border-t border-dashed border-slate-200">
                  <span>Đã thanh toán đủ</span>
                  <span className="text-sm">✓</span>
                </div>
              )}
            </div>

            {detail.note && (
              <div className="mt-4 p-3 bg-amber-50/70 border border-amber-100 rounded-xl text-xs text-amber-800 leading-relaxed font-medium">
                📝 {detail.note}
              </div>
            )}
          </div>

          <div className="flex gap-2 flex-wrap">
            {/* Approval Action for Admin */}
            {detail.status === 'pending' && (
              <Button 
                icon={<CheckCircleOutlined />} 
                type="primary"
                className="bg-emerald-600 border-emerald-600 hover:bg-emerald-700 hover:border-emerald-700 rounded-xl h-10 font-bold flex-1 flex items-center justify-center text-white"
                onClick={() => {
                  onUpdateStatus(detail.id, 'approved');
                  onDetailChange({ ...detail, status: 'approved' });
                }}
              >
                Duyệt đặt sân
              </Button>
            )}

            {/* Payment Updates */}
            {detail.paymentStatus === 'unpaid' && (
              <Button icon={<CheckCircleOutlined />} type="primary"
                className="bg-blue-500 border-blue-500 hover:bg-blue-600 hover:border-blue-600 rounded-xl h-10 font-bold flex-1 flex items-center justify-center text-white"
                onClick={() => {
                  onUpdatePayment(detail.id, 'deposited');
                  onDetailChange({ ...detail, paymentStatus: 'deposited' });
                  message.success('Cập nhật: Đã nhận cọc');
                }}>
                Xác nhận cọc
              </Button>
            )}
            {detail.paymentStatus === 'deposited' && (
              <Button icon={<CheckCircleOutlined />} type="primary"
                className="bg-emerald-500 border-emerald-500 hover:bg-emerald-600 hover:border-emerald-600 rounded-xl h-10 font-bold flex-1 flex items-center justify-center text-white"
                onClick={() => {
                  onUpdatePayment(detail.id, 'paid');
                  onDetailChange({ ...detail, paymentStatus: 'paid' });
                  message.success('Cập nhật: Đã thanh toán đủ!');
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
              <Button icon={<DeleteOutlined />} danger type="primary" className="rounded-xl h-10 font-bold flex items-center justify-center text-white">Xóa</Button>
            </Popconfirm>
          </div>
        </div>
      )}
    </Modal>
  );
};
