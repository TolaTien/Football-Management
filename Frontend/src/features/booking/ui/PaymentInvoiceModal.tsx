import React, { useState } from 'react';
import { Spin, message, Modal } from 'antd';
import { BookingService } from '@/entities/booking';
import dayjs from 'dayjs';

interface PaymentInvoiceModalProps {
  isOpen: boolean;
  booking: any; // Returned booking object from backend
  timeLeft: number; // in seconds
  onMinimize: () => void;
  onPaymentSuccess: () => void;
  onCancelSuccess: () => void;
}

export const PaymentInvoiceModal: React.FC<PaymentInvoiceModalProps> = ({
  isOpen,
  booking,
  timeLeft,
  onMinimize,
  onPaymentSuccess,
  onCancelSuccess,
}) => {
  const [submitting, setSubmitting] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'banking' | 'wallet' | 'cash'>('banking');
  const [walletBalance, setWalletBalance] = useState(1500000); // 1.5M VNĐ mock balance
  const [payMode, setPayMode] = useState<'deposit' | 'full'>('deposit');

  if (!isOpen || !booking) return null;

  const isExpired = timeLeft <= 0;
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeStr = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  const shortBookId = booking.bookId ? booking.bookId.substring(0, 8).toUpperCase() : 'UNKNOWN';

  // Format currency
  const formatCurrency = (val: number) => {
    return Number(val || 0).toLocaleString('vi-VN') + ' VNĐ';
  };

  // Dynamic pricing calculations
  const totalServices = (booking.bookingservices || []).reduce(
    (acc: number, cur: any) => acc + (cur.servicePriceAtBooking || cur.services?.price || 0) * cur.quantity,
    0
  );
  
  const depositAmount = booking.total || ((booking.pitchPriceAtBooking || 0) * 0.5 + totalServices);
  const fullAmount = (booking.pitchPriceAtBooking || 0) + totalServices;
  const activeAmount = payMode === 'deposit' ? depositAmount : fullAmount;

  // Handle Payment Submit
  const handlePayment = async () => {
    setSubmitting(true);
    try {
      if (paymentMethod === 'wallet' && walletBalance < activeAmount) {
        message.error('Số dư ví không đủ! Vui lòng nạp thêm hoặc chọn phương thức khác.');
        setSubmitting(false);
        return;
      }

      // Call partialPayment API with dynamic activeAmount
      await BookingService.partialPayment({
        bookingId: booking.bookId,
        amount: activeAmount,
      });

      if (paymentMethod === 'wallet') {
        setWalletBalance(prev => prev - activeAmount);
      }

      message.success('Đặt sân và thanh toán thành công!');
      onPaymentSuccess();
    } catch (err: any) {
      const errMsg = err?.response?.data?.message || 'Có lỗi xảy ra khi thanh toán';
      message.error(errMsg);
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Manual Cancellation
  const handleCancelBooking = () => {
    Modal.confirm({
      title: 'Hủy đơn đặt sân này?',
      content: 'Bạn có chắc chắn muốn hủy đơn đặt sân này không? Các sản phẩm dịch vụ và giờ chơi sẽ được giải phóng ngay lập tức.',
      okText: 'Hủy đơn',
      okType: 'danger',
      cancelText: 'Quay lại',
      onOk: async () => {
        setCancelling(true);
        try {
          await BookingService.cancelBooking(booking.bookId, 'Người dùng chủ động hủy trên hóa đơn');
          message.success('Đã hủy đơn đặt sân thành công!');
          onCancelSuccess();
        } catch (err: any) {
          const errMsg = err?.response?.data?.message || 'Không thể hủy đơn hàng';
          message.error(errMsg);
        } finally {
          setCancelling(false);
        }
      }
    });
  };

  return (
    <div className="fixed inset-0 bg-emerald-950/40 backdrop-blur-md z-[60] flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden animate-in fade-in zoom-in duration-300 my-8 border border-gray-100 relative">
        
        {/* Expired Overlay */}
        {isExpired && (
          <div className="absolute inset-0 bg-white/95 backdrop-blur-md z-50 flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-300">
            <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center text-rose-500 mb-4 shadow-lg shadow-rose-500/10">
              <span className="material-symbols-outlined text-[36px] animate-pulse">hourglass_disabled</span>
            </div>
            <h3 className="text-xl font-black text-slate-800 font-montserrat">Giao dịch đã hết hạn</h3>
            <p className="text-secondary max-w-sm mt-2 text-xs leading-relaxed">
              Đã quá thời hạn 15 phút giữ chỗ. Đơn đặt sân <strong className="text-slate-800">{booking.pitch?.namePitch}</strong> của bạn đã tự động bị hủy để nhường chỗ cho khách hàng khác.
            </p>
            <button 
              onClick={onCancelSuccess}
              className="mt-6 px-6 py-2.5 bg-slate-800 text-white rounded-xl font-bold shadow-md hover:bg-slate-700 active:scale-95 transition-all text-xs"
            >
              Quay lại lịch sân
            </button>
          </div>
        )}

        {/* Header */}
        <div className="p-5 bg-emerald-950 text-white flex justify-between items-center border-b border-emerald-900">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="px-2 py-0.5 bg-emerald-800 text-[9px] font-black rounded font-mono uppercase tracking-widest text-emerald-200">
                PENDING
              </span>
              <span className="text-[10px] text-emerald-300/80 font-mono">Invoice #{shortBookId}</span>
            </div>
            <h3 className="text-base font-extrabold font-montserrat mt-0.5">Thanh Khoản Đơn Đặt</h3>
          </div>

          <div className="flex items-center gap-3">
            {/* Live Timer Clock */}
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border backdrop-blur-md ${
              timeLeft < 180 
                ? 'bg-rose-950/40 border-rose-500/30 text-rose-300 animate-pulse' 
                : 'bg-emerald-900/40 border-emerald-800 text-emerald-300'
            }`}>
              <span className="material-symbols-outlined text-xs animate-spin-slow">hourglass_bottom</span>
              <span className="text-[10px] font-bold font-mono">Còn lại: <strong className="text-xs font-black">{timeStr}</strong></span>
            </div>

            {/* Minimize / Close Button */}
            <button 
              onClick={onMinimize} 
              className="p-1.5 bg-emerald-900/40 border border-emerald-800 hover:bg-emerald-800 rounded-full transition-all text-white/80 hover:text-white"
              title="Thu nhỏ hóa đơn để tiếp tục xem sân"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          </div>
        </div>

        {/* Content Body (Centered Stacked Flex Scroll) */}
        <div className="p-6 flex flex-col gap-5 bg-gray-50/20 max-h-[70vh] overflow-y-auto custom-scrollbar">
          
          {/* Payment Option Selection (Dynamic 50% vs 100%) */}
          <section className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-3">
            <h4 className="text-[10px] font-black text-emerald-950 uppercase tracking-widest flex items-center gap-1.5">
              <span className="material-symbols-outlined text-base text-emerald-600">split_screen</span>
              Chọn hạn mức thanh toán
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPayMode('deposit')}
                className={`flex flex-col p-3 rounded-xl border text-left transition-all ${
                  payMode === 'deposit'
                    ? 'border-emerald-600 bg-emerald-50/30 ring-1 ring-emerald-600/20'
                    : 'border-gray-100 hover:border-gray-200 bg-white'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className={`text-[10px] font-black uppercase tracking-wider ${payMode === 'deposit' ? 'text-emerald-900' : 'text-gray-500'}`}>
                    Đặt cọc (50% Sân)
                  </span>
                  <span className={`material-symbols-outlined text-sm ${payMode === 'deposit' ? 'text-emerald-600' : 'text-gray-300'}`}>
                    {payMode === 'deposit' ? 'radio_button_checked' : 'radio_button_unchecked'}
                  </span>
                </div>
                <p className={`text-xs font-black mt-1 ${payMode === 'deposit' ? 'text-emerald-950' : 'text-slate-800'}`}>
                  {formatCurrency(depositAmount)}
                </p>
                <p className="text-[9px] text-gray-400 mt-0.5 leading-tight">
                  Trả trước 50% tiền sân và 100% dịch vụ. Phần còn lại trả tại quầy.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setPayMode('full')}
                className={`flex flex-col p-3 rounded-xl border text-left transition-all ${
                  payMode === 'full'
                    ? 'border-emerald-600 bg-emerald-50/30 ring-1 ring-emerald-600/20'
                    : 'border-gray-100 hover:border-gray-200 bg-white'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className={`text-[10px] font-black uppercase tracking-wider ${payMode === 'full' ? 'text-emerald-900' : 'text-gray-500'}`}>
                    Thanh toán hết (100%)
                  </span>
                  <span className={`material-symbols-outlined text-sm ${payMode === 'full' ? 'text-emerald-600' : 'text-gray-300'}`}>
                    {payMode === 'full' ? 'radio_button_checked' : 'radio_button_unchecked'}
                  </span>
                </div>
                <p className={`text-xs font-black mt-1 ${payMode === 'full' ? 'text-emerald-950' : 'text-slate-800'}`}>
                  {formatCurrency(fullAmount)}
                </p>
                <p className="text-[9px] text-gray-400 mt-0.5 leading-tight">
                  Thanh toán toàn bộ 100% tiền sân và dịch vụ. Không cần thanh toán thêm tại sân.
                </p>
              </button>
            </div>
          </section>

          {/* Pitch & Services Combined Section */}
          <section className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <div className="flex justify-between items-start border-b border-gray-50 pb-3">
              <div>
                <span className="text-[9px] uppercase font-bold text-gray-400 tracking-wider">Sân bóng & Khung giờ</span>
                <h4 className="font-extrabold text-emerald-950 mt-0.5 text-sm">
                  {booking.pitch?.namePitch || 'Sân bóng mặc định'}
                </h4>
                <p className="text-xs text-emerald-800 font-bold mt-1 bg-emerald-50 px-2.5 py-1 rounded-lg inline-block border border-emerald-100/50">
                  {dayjs(booking.startTime).format('DD/MM/YYYY')} • {dayjs(booking.startTime).format('HH:mm')} - {dayjs(booking.endTime).format('HH:mm')}
                </p>
              </div>
              <div className="text-right">
                <span className="text-[9px] uppercase font-bold text-gray-400 tracking-wider">Giá thuê sân</span>
                <p className="font-extrabold text-emerald-950 mt-0.5 text-sm">{formatCurrency(booking.pitchPriceAtBooking)}</p>
              </div>
            </div>

            {/* Services inside the same card */}
            {booking.bookingservices && booking.bookingservices.length > 0 && (
              <div>
                <span className="text-[9px] uppercase font-bold text-gray-400 tracking-wider">Dịch vụ đi kèm</span>
                <div className="divide-y divide-gray-50 mt-1 max-h-[140px] overflow-y-auto pr-1 custom-scrollbar">
                  {booking.bookingservices.map((bs: any, idx: number) => {
                    const svc = bs.services || {};
                    return (
                      <div key={idx} className="flex justify-between items-center py-2 text-xs first:pt-0 last:pb-0">
                        <span className="text-gray-600 font-semibold">
                          {svc.nameProduct || 'Dịch vụ'} <strong className="text-emerald-800 font-black ml-1">x{bs.quantity}</strong>
                        </span>
                        <span className="font-extrabold text-emerald-950">
                          {formatCurrency((bs.servicePriceAtBooking || svc.price) * bs.quantity)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </section>

          {/* Sleeker Pricing Summary (Deposit or Full focus) */}
          <section className="bg-emerald-900 text-white p-5 rounded-2xl shadow-md relative overflow-hidden flex justify-between items-center">
            <div className="relative z-10">
              <span className="text-[9px] font-black uppercase tracking-widest text-emerald-300">
                {payMode === 'deposit' ? 'Tổng phí cọc cần đóng' : 'Tổng số tiền cần thanh toán'}
              </span>
              <h3 className="text-xl font-black text-amber-300 font-montserrat mt-0.5">
                {formatCurrency(activeAmount)}
              </h3>
              <p className="text-[8px] opacity-75 mt-1 leading-none">
                {payMode === 'deposit' 
                  ? '* Cọc trước 50% tiền sân + 100% dịch vụ để hoàn tất giữ chỗ' 
                  : '* Thanh toán toàn bộ 100% tiền sân và các dịch vụ đi kèm'}
              </p>
            </div>
            <div className="text-right relative z-10">
              <span className="text-[9px] opacity-70 block">Tổng tiền gốc</span>
              <span className="text-xs font-bold line-through opacity-60">
                {formatCurrency(fullAmount)}
              </span>
            </div>
            <div className="absolute -bottom-6 -right-6 opacity-10">
              <span className="material-symbols-outlined text-[90px]">payments</span>
            </div>
          </section>

          {/* Payment Method Selector */}
          <section className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <h4 className="text-[10px] font-black text-emerald-950 uppercase tracking-widest flex items-center gap-1.5">
              <span className="material-symbols-outlined text-base text-emerald-600">payment</span>
              Chọn phương thức thanh toán
            </h4>
            
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'banking', label: 'Chuyển Khoản', icon: 'account_balance' },
                { id: 'wallet', label: 'Ví Số Dư', icon: 'wallet' },
                { id: 'cash', label: 'Tiền Mặt', icon: 'payments' }
              ].map(m => (
                <button
                  key={m.id}
                  onClick={() => setPaymentMethod(m.id as any)}
                  className={`flex flex-col items-center gap-1 p-2.5 rounded-xl border transition-all ${
                    paymentMethod === m.id 
                      ? 'border-emerald-600 bg-emerald-50/50 text-emerald-900 font-extrabold shadow-sm'
                      : 'border-gray-100 bg-white text-gray-400 hover:border-gray-200'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">{m.icon}</span>
                  <span className="text-[9px] uppercase tracking-wider leading-none text-center font-bold">{m.label}</span>
                </button>
              ))}
            </div>

            {/* Dynamic detailed content per method */}
            <div className="border-t border-gray-50 pt-4 text-xs">
              
              {/* Method 1: Banking */}
              {paymentMethod === 'banking' && (
                <div className="space-y-4">
                  <div className="bg-emerald-50/30 p-4 rounded-xl border border-emerald-100/20 flex flex-col items-center gap-3">
                    
                    {/* Compact visual VietQR Mockup */}
                    <div className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm flex flex-col items-center w-full max-w-[240px]">
                      <div className="flex justify-between items-center w-full border-b border-gray-100 pb-1.5 mb-2">
                        <span className="text-[8px] font-black text-blue-900 font-mono tracking-widest">VIETQR</span>
                        <span className="text-[8px] bg-red-50 text-red-600 px-1 rounded font-black font-mono">NAPAS 247</span>
                      </div>
                      
                      <div className="w-24 h-24 bg-gray-50 flex items-center justify-center border border-gray-50 rounded p-1">
                        <svg className="w-full h-full" viewBox="0 0 100 100">
                          <rect width="100" height="100" fill="#f8fafc" />
                          <rect x="5" y="5" width="20" height="20" fill="#064e3b" stroke="#059669" strokeWidth="2" />
                          <rect x="10" y="10" width="10" height="10" fill="#ffffff" />
                          <rect x="75" y="5" width="20" height="20" fill="#064e3b" stroke="#059669" strokeWidth="2" />
                          <rect x="80" y="10" width="10" height="10" fill="#ffffff" />
                          <rect x="5" y="75" width="20" height="20" fill="#064e3b" stroke="#059669" strokeWidth="2" />
                          <rect x="10" y="80" width="10" height="10" fill="#ffffff" />
                          <path d="M35 5h10v10H35zM55 5h10v5H55zM65 15h5v15h-5zM30 25h15v5H30zM50 30h10v10H50zM5 35h15v5H5zM20 45h20v5H20zM45 45h30v5H45zM80 35h15v10H80zM5 55h20v5H5zM35 60h25v5H35zM75 55h20v15H75zM10 70h15v5H10zM40 75h10v15H40zM60 80h10v10H60zM80 80h15v15H80z" fill="#0f172a" />
                          <rect x="42" y="42" width="16" height="16" rx="4" fill="#047857" />
                          <circle cx="50" cy="50" r="3" fill="#fbbf24" />
                        </svg>
                      </div>
                      <span className="text-[8px] text-gray-400 mt-1.5 text-center">Quét bằng app ngân hàng để chuyển khoản</span>
                    </div>
                    
                    {/* Bank Info */}
                    <div className="w-full space-y-2 text-xs text-emerald-950 font-medium">
                      <div className="flex justify-between border-b border-gray-100 pb-1">
                        <span className="text-gray-400">Ngân hàng:</span>
                        <span className="font-extrabold text-slate-800">MB Bank (Quân Đội)</span>
                      </div>
                      <div className="flex justify-between border-b border-gray-100 pb-1">
                        <span className="text-gray-400">Số tài khoản:</span>
                        <span className="font-black text-emerald-900 select-all tracking-wider">1029384756</span>
                      </div>
                      <div className="flex justify-between border-b border-gray-100 pb-1">
                        <span className="text-gray-400">Chủ tài khoản:</span>
                        <span className="font-extrabold uppercase text-slate-800">DANG VAN TIEN</span>
                      </div>
                      <div className="flex justify-between border-b border-gray-100 pb-1">
                        <span className="text-gray-400">Số tiền chuyển:</span>
                        <span className="font-black text-emerald-900">{formatCurrency(activeAmount)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Nội dung chuyển:</span>
                        <span className="font-black text-amber-700 bg-amber-50 px-2 py-0.5 rounded select-all font-mono">
                          PITCHHUB {shortBookId}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Method 2: Wallet */}
              {paymentMethod === 'wallet' && (
                <div className="space-y-3 bg-emerald-50/20 p-4 rounded-xl border border-emerald-100/10">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-gray-500 uppercase">Ví Cá Nhân</span>
                    <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-black font-mono">ACTIVE</span>
                  </div>
                  <div className="py-1">
                    <p className="text-[9px] text-gray-400 uppercase tracking-widest font-bold">Số dư khả dụng:</p>
                    <p className="text-xl font-black text-emerald-950 mt-0.5 font-montserrat">{formatCurrency(walletBalance)}</p>
                  </div>
                  <div className="text-[11px] text-gray-500 border-t border-dashed border-gray-100 pt-2.5 space-y-1">
                    <div className="flex justify-between">
                      <span>Số tiền thanh toán:</span>
                      <span className="font-bold text-slate-800">-{formatCurrency(activeAmount)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-emerald-900">
                      <span>Số dư sau giao dịch:</span>
                      <span>{formatCurrency(walletBalance - activeAmount)}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Method 3: Cash */}
              {paymentMethod === 'cash' && (
                <div className="p-4 bg-amber-50/50 border border-amber-100 rounded-xl text-xs text-amber-950 space-y-2">
                  <h5 className="font-extrabold flex items-center gap-1 text-amber-950 text-xs">
                    <span className="material-symbols-outlined text-[14px]">info</span>
                    Thanh toán trực tiếp tại quầy
                  </h5>
                  <p className="leading-relaxed text-[11px]">
                    Vui lòng di chuyển đến quầy đón tiếp của **Sân Bóng Văn Tiến** trong vòng 15 phút, cung cấp mã hóa đơn <strong className="font-mono bg-amber-100 px-1 py-0.5 rounded text-amber-950 font-black">{shortBookId}</strong> để thanh toán số tiền <strong className="text-emerald-900 font-bold">{formatCurrency(activeAmount)}</strong> bằng tiền mặt và bảo đảm giữ chỗ thành công.
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* Unified Stacked Action Buttons */}
          <div className="space-y-2 mt-2">
            <button
              onClick={handlePayment}
              disabled={submitting || isExpired}
              className="w-full py-3.5 bg-primary text-white rounded-xl font-bold shadow-lg shadow-emerald-950/10 hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed text-xs"
            >
              {submitting ? (
                <Spin size="small" />
              ) : (
                <>
                  <span className="material-symbols-outlined text-sm">check_circle</span>
                  {paymentMethod === 'banking' ? 'Tôi Đã Chuyển Khoản' : paymentMethod === 'wallet' ? 'Xác Nhận Thanh Toán Ví' : 'Xác Nhận Giữ Chỗ Quầy'}
                </>
              )}
            </button>

            <button
              onClick={handleCancelBooking}
              disabled={cancelling || submitting || isExpired}
              className="w-full py-2.5 bg-white text-rose-600 hover:text-rose-700 font-bold border border-rose-100 hover:bg-rose-50/30 rounded-xl transition-all flex items-center justify-center gap-1 text-[11px] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {cancelling ? <Spin size="small" /> : <span className="material-symbols-outlined text-xs">delete</span>}
              Hủy Đơn Đặt Sân
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
