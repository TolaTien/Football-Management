import React from 'react';
import { Modal } from 'antd';
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
  const payments = booking?.payments || [];
  const paidAmount = payments.reduce((sum: number, p: any) => sum + (p.amount || 0), 0);
  const fallbackPaidAmount =
    booking?.paymentStatus === 'paid'
      ? fullAmount
      : booking?.paymentStatus === 'partial'
        ? booking?.total || 0
        : 0;
  const displayPaidAmount = paidAmount || fallbackPaidAmount;
  const hasBankingPayment = payments.some((p: any) => p.paymentMethod === 'banking');
  const hasCashPayment = payments.some((p: any) => p.paymentMethod === 'cash');
  const paidLabel =
    hasBankingPayment && !hasCashPayment
      ? 'Đã thanh toán trực tuyến:'
      : hasCashPayment && !hasBankingPayment
        ? 'Đã thanh toán tại quầy:'
        : 'Đã thanh toán:';
  const computedPaymentStatus = displayPaidAmount >= (fullAmount - 1000) ? 'paid' : booking?.paymentStatus;

  const getStatusPill = (status: string) => {
    const s = status?.toLowerCase();
    let label = 'Không xác định';
    let bgClass = 'bg-white/10 text-white border-white/10';
    let dotClass = 'bg-white';
    
    if (s === 'approved' || s === 'confirmed') {
      label = 'Đã duyệt';
      bgClass = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      dotClass = 'bg-emerald-400 animate-pulse';
    } else if (s === 'pending') {
      label = 'Chờ duyệt';
      bgClass = 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      dotClass = 'bg-amber-400 animate-pulse';
    } else if (s === 'rejected' || s === 'cancelled') {
      label = 'Đã hủy';
      bgClass = 'bg-rose-500/20 text-rose-300 border-rose-500/30';
      dotClass = 'bg-rose-400';
    }
    
    return (
      <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded border text-[10px] font-bold ${bgClass}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${dotClass}`} />
        <span>{label}</span>
      </div>
    );
  };

  const getPaymentStatusPill = (status: string) => {
    const s = status?.toLowerCase();
    let label = 'Không xác định';
    let bgClass = 'bg-white/10 text-white border-white/10';
    let dotClass = 'bg-white';
    
    if (s === 'paid') {
      label = 'Đã thanh toán';
      bgClass = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      dotClass = 'bg-emerald-400';
    } else if (s === 'partial') {
      label = 'Cọc một phần';
      bgClass = 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      dotClass = 'bg-blue-400 animate-pulse';
    } else if (s === 'pending' || s === 'unpaid') {
      label = 'Chưa thanh toán';
      bgClass = 'bg-rose-500/20 text-rose-300 border-rose-500/30';
      dotClass = 'bg-rose-400';
    }
    
    return (
      <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded border text-[10px] font-bold ${bgClass}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${dotClass}`} />
        <span>{label}</span>
      </div>
    );
  };

  return (
    <Modal
      title={
        <div className="border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-emerald-600 text-2xl" style={{ verticalAlign: 'middle' }}>sports_soccer</span>
            <h3 className="text-lg font-extrabold text-emerald-950 m-0 leading-none">Chi Tiết Đặt Sân</h3>
          </div>
          {booking?.bookId && (
            <div className="flex items-center gap-1.5 mt-2 bg-gray-50 px-2 py-0.5 rounded border border-gray-100 w-fit">
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Mã đơn:</span>
              <span className="text-[11px] font-mono font-bold text-gray-700">{booking.bookId}</span>
            </div>
          )}
        </div>
      }
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={500}
      centered
      closeIcon={<span className="text-gray-400 hover:text-gray-600 transition-colors text-base">✕</span>}
      styles={{
        body: { padding: '12px 2px 2px 2px' }
      }}
    >
      {booking && (
        <div className="space-y-3.5">
          {/* Pitch & Time Info Banner (Compact Gradient Banner with Status Pills inside) */}
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-emerald-900 to-emerald-950 p-4 text-white shadow-md">
            <div className="relative z-10 flex justify-between items-start">
              <div>
                <div className="flex items-center gap-1.5 mb-2 flex-wrap">
                  <span className="inline-block px-1.5 py-0.5 bg-emerald-800 text-emerald-300 rounded text-[9px] font-bold uppercase tracking-wider">
                    {booking.pitch?.pitchCategory ? `${booking.pitch.pitchCategory}-a-side` : 'Chưa xác định'}
                  </span>
                  {getStatusPill(booking.status)}
                  {getPaymentStatusPill(computedPaymentStatus)}
                </div>
                
                <h4 className="font-extrabold text-lg text-white m-0 tracking-wide">
                  {booking.pitch?.namePitch || 'Sân bóng'}
                </h4>
                
                <div className="flex gap-4 mt-3.5 text-emerald-100 text-xs">
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[15px] text-emerald-400" style={{ verticalAlign: 'middle' }}>calendar_month</span>
                    <span className="font-medium">{dayjs(booking.startTime).format('dd/MM/YYYY')}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[15px] text-emerald-400" style={{ verticalAlign: 'middle' }}>schedule</span>
                    <span className="font-bold bg-white/10 px-1.5 py-0.5 rounded text-[11px]">
                      {dayjs(booking.startTime).format('HH:mm')} - {dayjs(booking.endTime).format('HH:mm')}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="text-right bg-white/10 backdrop-blur-md px-3 py-2 rounded-xl border border-white/10 shadow-lg min-w-[110px]">
                <p className="text-[8px] text-emerald-300 font-extrabold m-0 tracking-wider uppercase">ĐƠN GIÁ SÂN</p>
                <p className="text-base font-black text-white mt-1 m-0 font-mono">
                  {formatCurrency(booking.pitchPriceAtBooking || booking.total)}
                </p>
              </div>
            </div>
            
            {/* Decorative background circle */}
            <div className="absolute right-0 bottom-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl -mr-6 -mb-6"></div>
          </div>

          {/* 2-Column Row: Contact Info & Services */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Contact Info Card */}
            <div className="bg-white border border-gray-100 p-3.5 rounded-xl shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 mb-2.5 border-b border-gray-50 pb-1.5">
                  <span className="material-symbols-outlined text-emerald-600 text-[16px]" style={{ verticalAlign: 'middle' }}>contact_mail</span>
                  <h5 className="font-extrabold text-emerald-950 text-xs m-0">Thông tin liên hệ</h5>
                </div>
                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-gray-400 font-medium">Người đặt:</span>
                    <p className="font-bold text-gray-800 m-0 mt-0.5 text-xs">{userFullName || 'Player'}</p>
                  </div>
                  <div>
                    <span className="text-gray-400 font-medium">Số điện thoại:</span>
                    <p className="font-bold text-gray-800 m-0 mt-0.5 text-xs font-mono">{booking.phone || 'Chưa cung cấp'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Services Ordered Card */}
            <div className="bg-white border border-gray-100 p-3.5 rounded-xl shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 mb-2.5 border-b border-gray-50 pb-1.5">
                  <span className="material-symbols-outlined text-emerald-600 text-[16px]" style={{ verticalAlign: 'middle' }}>local_cafe</span>
                  <h5 className="font-extrabold text-emerald-950 text-xs m-0">Dịch vụ đi kèm</h5>
                </div>
                {!booking.bookingservices || booking.bookingservices.length === 0 ? (
                  <p className="text-[11px] text-gray-400 m-0 py-3.5 text-center bg-gray-50 rounded-lg border border-dashed border-gray-100">
                    Không có dịch vụ đi kèm
                  </p>
                ) : (
                  <div className="space-y-1.5 max-h-[75px] overflow-y-auto pr-1">
                    {booking.bookingservices.map((item: any, i: number) => (
                      <div key={i} className="flex justify-between items-center text-[11px] py-0.5">
                        <span className="font-bold text-gray-700 truncate max-w-[100px]" title={item.services?.nameProduct}>
                          {item.services?.nameProduct || 'Dịch vụ'}
                        </span>
                        <span className="text-gray-400 font-mono">x{item.quantity || 1}</span>
                        <span className="font-bold text-emerald-800 font-mono">
                          {formatCurrency((item.servicePriceAtBooking || item.services?.price || 0) * (item.quantity || 1))}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Compact Receipt Breakdown Card */}
          <div className="bg-gradient-to-b from-gray-50 to-slate-100/50 border border-gray-200/60 p-4 rounded-xl shadow-inner space-y-2.5 relative">
            {/* Ticket punches decoration */}
            <div className="absolute left-0 top-1/2 w-2.5 h-4 bg-white border-r border-gray-200 rounded-r-full -translate-y-1/2 -ml-[1px]"></div>
            <div className="absolute right-0 top-1/2 w-2.5 h-4 bg-white border-l border-gray-200 rounded-l-full -translate-y-1/2 -mr-[1px]"></div>

            <div className="flex justify-between items-center text-xs text-gray-500 font-medium">
              <span>Tổng tiền gốc (Sân + Dịch vụ):</span>
              <span className="font-bold text-slate-800 font-mono">{formatCurrency(fullAmount)}</span>
            </div>
            <div className="flex justify-between items-center text-xs text-emerald-700 font-medium">
              <span>{paidLabel}</span>
              <span className="font-black font-mono">-{formatCurrency(displayPaidAmount)}</span>
            </div>
            
            {fullAmount - displayPaidAmount > 1000 && (
              <div className="flex justify-between items-center text-xs text-amber-700 bg-amber-50 px-2.5 py-1.5 rounded-lg border border-amber-100/80 font-medium">
                <span>Còn lại cần đóng tại quầy:</span>
                <span className="font-black font-mono text-xs">{formatCurrency(fullAmount - displayPaidAmount)}</span>
              </div>
            )}
            
            <div className="pt-2.5 flex justify-between items-center border-t border-dashed border-gray-200">
              <div className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px] text-emerald-700" style={{ verticalAlign: 'middle' }}>payments</span>
                <span className="font-extrabold text-emerald-950 text-xs">Đã cọc giữ chỗ:</span>
              </div>
              <span className="text-base font-black text-emerald-800 font-mono">
                {formatCurrency(displayPaidAmount)}
              </span>
            </div>
          </div>

          {/* Footer Action Button inside body */}
          <div className="pt-3 mt-1 border-t border-gray-100 flex justify-end">
            <button 
              onClick={onClose}
              className="w-full sm:w-auto px-6 py-2 bg-gradient-to-r from-emerald-800 to-emerald-900 hover:from-emerald-700 hover:to-emerald-800 text-white rounded-lg font-button text-sm font-bold tracking-wide transition-all shadow-md active:scale-95 border-none cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]" style={{ verticalAlign: 'middle' }}>check_circle</span>
              Đóng
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
};

