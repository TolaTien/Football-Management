import React from 'react';
import { Modal, Tag } from 'antd';
import dayjs from 'dayjs';

export interface BookingDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: any | null;
  userFullName?: string;
}

export const BookingDetailModal: React.FC<BookingDetailModalProps> = ({
  isOpen,
  onClose,
  booking,
  userFullName
}) => {
  const formatCurrency = (amount: number) => {
    return `${(amount || 0).toLocaleString('vi-VN')} đ`;
  };

  // Dynamic calculations for payment audit
  const totalServices = (booking?.bookingservices || []).reduce(
    (acc: number, cur: any) => acc + (cur.servicePriceAtBooking || cur.services?.price || 0) * cur.quantity,
    0
  );
  const fullAmount = (booking?.pitchPriceAtBooking || 0) + totalServices;
  const paidAmount = (booking?.payments || []).reduce((sum: number, p: any) => sum + (p.amount || 0), 0);
  const computedPaymentStatus = paidAmount >= (fullAmount - 1000) ? 'paid' : booking?.paymentStatus;

  const getStatusTag = (status: string) => {
    const s = status?.toLowerCase();
    switch (s) {
      case 'approved': 
      case 'confirmed':
        return <Tag color="success" className="m-0">Approved</Tag>;
      case 'pending': 
        return <Tag color="warning" className="m-0">Pending</Tag>;
      case 'rejected': 
      case 'cancelled':
        return <Tag color="error" className="m-0">Cancelled</Tag>;
      default: return <Tag color="default" className="m-0">{status || 'Unknown'}</Tag>;
    }
  };

  const getPaymentStatusTag = (status: string) => {
    const s = status?.toLowerCase();
    switch (s) {
      case 'paid':
        return <Tag color="success" className="m-0">Paid</Tag>;
      case 'partial':
        return <Tag color="processing" className="m-0">Partial</Tag>;
      case 'pending':
        return <Tag color="warning" className="m-0">Pending</Tag>;
      default: return <Tag color="default" className="m-0">{status || 'Unknown'}</Tag>;
    }
  };

  return (
    <Modal
      title={
        <div className="border-b border-gray-100 pb-3">
          <h3 className="text-lg font-bold text-emerald-900 m-0">Chi Tiết Đặt Sân</h3>
          <p className="text-xs text-gray-500 font-mono mt-1 mb-0">Mã đơn: {booking?.bookId}</p>
        </div>
      }
      open={isOpen}
      onCancel={onClose}
      footer={[
        <button 
          key="close"
          onClick={onClose}
          className="px-6 py-2 bg-emerald-900 hover:bg-emerald-800 text-white rounded-lg font-button text-sm transition-colors cursor-pointer border-none"
        >
          Đóng
        </button>
      ]}
      width={550}
      centered
    >
      {booking && (
        <div className="py-4 space-y-4">
          {/* Pitch & Time Info */}
          <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100/50 flex justify-between items-center">
            <div>
              <h4 className="font-bold text-emerald-900 text-base m-0">
                {booking.pitch?.namePitch || 'Sân bóng'}
              </h4>
              <p className="text-xs text-emerald-700/80 mt-1 m-0 font-semibold">
                Loại sân: {booking.pitch?.pitchCategory ? `${booking.pitch.pitchCategory}-a-side` : 'Chưa xác định'}
              </p>
              <div className="flex items-center gap-1.5 text-gray-600 text-xs mt-2.5">
                <span className="material-symbols-outlined text-[14px]" style={{ verticalAlign: 'middle' }}>calendar_month</span>
                <span>{dayjs(booking.startTime).format('dddd, DD/MM/YYYY')}</span>
              </div>
              <div className="flex items-center gap-1.5 text-gray-600 text-xs mt-1">
                <span className="material-symbols-outlined text-[14px]" style={{ verticalAlign: 'middle' }}>schedule</span>
                <span className="font-bold">{dayjs(booking.startTime).format('HH:mm')} - {dayjs(booking.endTime).format('HH:mm')}</span>
              </div>
            </div>
            <div className="text-center bg-white px-4 py-3 rounded-lg border border-emerald-100 shadow-sm">
              <p className="text-[10px] text-gray-400 font-bold m-0 tracking-wider">GIÁ SÂN</p>
              <p className="text-sm font-extrabold text-emerald-950 mt-1 m-0 font-mono">
                {formatCurrency(booking.pitchPriceAtBooking || booking.total)}
              </p>
            </div>
          </div>

          {/* Status & Payments */}
          <div className="grid grid-cols-2 gap-4">
            <div className="border border-gray-100 p-4 rounded-xl">
              <p className="text-[10px] text-gray-400 font-bold tracking-wider mb-1.5 mt-0">TRẠNG THÁI ĐẶT</p>
              {getStatusTag(booking.status)}
            </div>
            <div className="border border-gray-100 p-4 rounded-xl">
              <p className="text-[10px] text-gray-400 font-bold tracking-wider mb-1.5 mt-0">THANH TOÁN</p>
              {getPaymentStatusTag(computedPaymentStatus)}
            </div>
          </div>

          {/* Contact Info */}
          <div className="border border-gray-100 p-4 rounded-xl">
            <h5 className="font-bold text-emerald-900 text-sm mb-2 mt-0">Thông tin liên hệ</h5>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-gray-400">Người đặt:</span>
                <p className="font-semibold text-gray-700 m-0 mt-0.5">{userFullName || 'Player'}</p>
              </div>
              <div>
                <span className="text-gray-400">Số điện thoại:</span>
                <p className="font-semibold text-gray-700 m-0 mt-0.5 font-mono">{booking.phone || 'Chưa cung cấp'}</p>
              </div>
            </div>
          </div>

          {/* Services Ordered */}
          <div className="border border-gray-100 p-4 rounded-xl">
            <h5 className="font-bold text-emerald-900 text-sm mb-2 mt-0">Dịch vụ đi kèm</h5>
            {!booking.bookingservices || booking.bookingservices.length === 0 ? (
              <p className="text-xs text-gray-400 m-0 py-1">Không sử dụng dịch vụ bổ sung nào</p>
            ) : (
              <div className="divide-y divide-gray-100">
                {booking.bookingservices.map((item: any, i: number) => (
                  <div key={i} className="py-2.5 flex justify-between items-center text-xs">
                    <div>
                      <p className="font-semibold text-gray-800 m-0">
                        {item.services?.nameProduct || 'Dịch vụ'}
                      </p>
                      <p className="text-gray-400 m-0 mt-0.5 font-mono">
                        Đơn giá: {formatCurrency(item.servicePriceAtBooking || item.services?.price)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-800 m-0">Số lượng: x{item.quantity || 1}</p>
                      <p className="font-bold text-emerald-800 m-0 mt-0.5 font-mono">
                        {formatCurrency((item.servicePriceAtBooking || item.services?.price || 0) * (item.quantity || 1))}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Detailed Payment Breakdown */}
          <div className="pt-3.5 border-t border-gray-100 space-y-2">
            <div className="flex justify-between items-center text-xs text-gray-500">
              <span>Tổng tiền gốc (Sân + Dịch vụ):</span>
              <span className="font-semibold text-slate-800 font-mono">{formatCurrency(fullAmount)}</span>
            </div>
            <div className="flex justify-between items-center text-xs text-emerald-700">
              <span className="font-medium">Đã thanh toán qua hệ thống:</span>
              <span className="font-black font-mono">-{formatCurrency(paidAmount)}</span>
            </div>
            {fullAmount - paidAmount > 1000 && (
              <div className="flex justify-between items-center text-xs text-amber-700">
                <span className="font-medium">Còn lại cần đóng tại quầy:</span>
                <span className="font-black font-mono">{formatCurrency(fullAmount - paidAmount)}</span>
              </div>
            )}
            <div className="pt-2 flex justify-between items-center border-t border-dashed border-gray-100">
              <span className="font-bold text-emerald-950">Đã cọc giữ chỗ:</span>
              <span className="text-base font-black text-emerald-900 font-mono">
                {formatCurrency(booking.total)}
              </span>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
};
