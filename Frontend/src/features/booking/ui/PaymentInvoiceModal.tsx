import React, { useState } from 'react';
import { Spin, message, Modal } from 'antd';
import { BookingService } from '@/entities/booking';
import dayjs from 'dayjs';
import { useAppDispatch } from '@/app/store/hooks';
import { fetchNotifications } from '@/entities/notification';

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
  const dispatch = useAppDispatch();
  const [submitting, setSubmitting] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'banking' | 'cash'>('banking');
  const [walletBalance, setWalletBalance] = useState(1500000); // 1.5M VNĐ mock balance
  const payMode = 'deposit';

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

  // Copy helper
  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    message.success(`Đã sao chép ${label} thành công!`);
  };

  // Dynamic pricing calculations
  const totalServices = (booking.bookingservices || []).reduce(
    (acc: number, cur: any) => acc + (cur.servicePriceAtBooking || cur.services?.price || 0) * cur.quantity,
    0
  );
  
  // Robust base pitch price recovery with intelligent fallbacks (supports legacy/mock database entries)
  const basePitchPrice = booking.pitchPriceAtBooking || 
                         (booking.total ? (booking.paymentStatus === 'partial' ? (booking.total - totalServices) * 2 : (booking.total - totalServices)) : 0) || 
                         120000;
  
  const fullAmount = basePitchPrice + totalServices;
  const depositAmount = fullAmount * 0.5;
  const activeAmount = payMode === 'deposit' ? depositAmount : fullAmount;

  // Handle Payment Submit
  const handlePayment = async () => {
    setSubmitting(true);
    try {
      // Call partialPayment API with dynamic activeAmount
      await BookingService.partialPayment({
        bookingId: booking.bookId,
        amount: activeAmount,
      });

      // Kéo notification từ DB ngay lập tức → chuông cập nhật real-time
      dispatch(fetchNotifications(1));


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
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[60] flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-[32px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] w-full max-w-xl overflow-hidden animate-in fade-in zoom-in duration-300 my-8 border border-slate-100 relative">
        
        {/* Expired Overlay */}
        {isExpired && (
          <div className="absolute inset-0 bg-white/95 backdrop-blur-md z-50 flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-300">
            <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center text-rose-500 mb-5 shadow-lg shadow-rose-500/10">
              <span className="material-symbols-outlined text-[42px] animate-pulse">hourglass_disabled</span>
            </div>
            <h3 className="text-2xl font-black text-slate-800 font-montserrat">Giao dịch đã hết hạn</h3>
            <p className="text-gray-500 max-w-md mt-2 text-sm leading-relaxed">
              Đã quá thời hạn 15 phút giữ chỗ. Đơn đặt sân <strong className="text-slate-800">{booking.pitch?.namePitch}</strong> của bạn đã tự động bị hủy để nhường chỗ cho khách hàng khác.
            </p>
            <button 
              onClick={onCancelSuccess}
              className="mt-6 px-8 py-3 bg-slate-950 text-white rounded-2xl font-bold shadow-lg hover:bg-slate-800 active:scale-95 transition-all text-sm"
            >
              Quay lại lịch sân
            </button>
          </div>
        )}

        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-emerald-950 to-emerald-900 text-white flex justify-between items-center border-b border-emerald-800/50 shadow-md">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 bg-emerald-500/20 border border-emerald-500/30 text-[9px] font-black rounded-md font-mono uppercase tracking-widest text-emerald-300">
                CHỜ DUYỆT
              </span>
              <span className="text-[11px] text-emerald-300/80 font-mono">Hóa đơn #{shortBookId}</span>
            </div>
            <h3 className="text-lg font-black font-montserrat mt-1 tracking-tight">Thanh Toán Đơn Đặt Sân</h3>
          </div>

          <div className="flex items-center gap-3">
            {/* Live Timer Clock */}
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl border backdrop-blur-md transition-colors ${
              timeLeft < 180 
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-400 animate-pulse' 
                : 'bg-white/5 border-white/10 text-emerald-300'
            }`}>
              <span className="material-symbols-outlined text-xs animate-spin-slow">hourglass_bottom</span>
              <span className="text-[10px] font-bold font-mono">Còn lại: <strong className="text-xs font-black">{timeStr}</strong></span>
            </div>

            {/* Minimize / Close Button */}
            <button 
              onClick={onMinimize} 
              className="p-2 bg-white/5 border border-white/10 hover:bg-white/10 rounded-full transition-all text-white/80 hover:text-white flex items-center justify-center"
              title="Thu nhỏ hóa đơn để tiếp tục xem sân"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 flex flex-col gap-5 bg-slate-50/50 max-h-[70vh] overflow-y-auto custom-scrollbar">
          


          {/* Detailed breakdown card */}
          <section className="bg-white p-5 rounded-[24px] border border-slate-100 shadow-sm space-y-4 flex-none">
            <div className="flex justify-between items-start border-b border-slate-100 pb-4">
              <div>
                <span className="text-[9px] uppercase font-bold text-gray-400 tracking-wider">Thông tin đặt sân</span>
                <h4 className="font-extrabold text-slate-800 mt-1 text-base">
                  {booking.pitch?.namePitch || 'Sân bóng'}
                </h4>
                {booking.pitch?.address && (
                  <p className="text-xs text-gray-400 font-medium inline-flex items-center gap-0.5 mt-1">
                    <span className="material-symbols-outlined text-[14px]">location_on</span>
                    {booking.pitch.address}
                  </p>
                )}
                <p className="text-xs text-emerald-800 font-bold mt-2 bg-emerald-50 border border-emerald-100/50 px-3 py-1 rounded-xl inline-flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-xs">calendar_month</span>
                  {dayjs(booking.startTime).format('DD/MM/YYYY')} • {dayjs(booking.startTime).format('HH:mm')} - {dayjs(booking.endTime).format('HH:mm')}
                </p>
              </div>
              <div className="text-right">
                <span className="text-[9px] uppercase font-bold text-gray-400 tracking-wider">Chi phí thuê gốc</span>
                <p className="font-black text-slate-800 mt-1 text-base">{formatCurrency(booking.pitchPriceAtBooking)}</p>
              </div>
            </div>

            {/* Services List */}
            {booking.bookingservices && booking.bookingservices.length > 0 && (
              <div className="pt-2">
                <span className="text-[9px] uppercase font-bold text-gray-400 tracking-wider">Sản phẩm & Dịch vụ đi kèm</span>
                <div className="divide-y divide-slate-100 mt-2 max-h-[140px] overflow-y-auto pr-1 custom-scrollbar">
                  {booking.bookingservices.map((bs: any, idx: number) => {
                    const svc = bs.services || {};
                    return (
                      <div key={idx} className="flex justify-between items-center py-2.5 text-xs first:pt-0 last:pb-0">
                        <span className="text-slate-600 font-medium">
                          {(svc.nameProduct || 'Dịch vụ').replace(/^\[(?:drink|equipment|food|other)\]\s*/, '')} <strong className="text-emerald-800 font-extrabold ml-1 bg-emerald-50 border border-emerald-100/30 px-1.5 py-0.5 rounded-md">x{bs.quantity}</strong>
                        </span>
                        <span className="font-bold text-slate-800">
                          {formatCurrency((bs.servicePriceAtBooking || svc.price) * bs.quantity)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </section>

          {/* Sleeker Pricing Summary breakdown & total box */}
          <section className="bg-emerald-950 text-white p-6 rounded-[28px] shadow-lg relative overflow-hidden flex flex-col gap-4 flex-none">
            {/* Header info */}
            <div className="flex justify-between items-start border-b border-white/10 pb-4 relative z-10">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-300/80">
                  Hạn mức: {payMode === 'deposit' ? 'ĐẶT CỌC 50% TỔNG ĐƠN' : 'THANH TOÁN TOÀN BỘ'}
                </span>
                <h3 className="text-2xl font-black text-amber-300 font-montserrat mt-1">
                  {formatCurrency(activeAmount)}
                </h3>
              </div>
              <div className="text-right">
                <span className="text-[9px] text-white/60 block uppercase font-bold">Tổng chi phí gốc</span>
                <span className="text-sm font-bold line-through text-white/40">
                  {formatCurrency(fullAmount)}
                </span>
              </div>
            </div>

            {/* Micro Breakdown of calculation */}
            <div className="text-[11px] text-emerald-100/90 space-y-1.5 relative z-10 font-medium">
              <div className="flex justify-between items-center">
                <span className="text-emerald-300/80">Chi phí thuê sân:</span>
                <span>{formatCurrency(booking.pitchPriceAtBooking)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-emerald-300/80">Tổng tiền dịch vụ:</span>
                <span>+{formatCurrency(totalServices)}</span>
              </div>
              {payMode === 'deposit' ? (
                <>
                  <div className="flex justify-between items-center text-amber-300">
                    <span>Mức đặt cọc áp dụng (50%):</span>
                    <span className="font-bold">x50%</span>
                  </div>
                  <div className="border-t border-white/10 pt-2 flex justify-between items-center font-bold text-amber-300 text-xs">
                    <span>TỔNG CỌC CẦN ĐÓNG:</span>
                    <span className="text-sm font-black">{formatCurrency(depositAmount)}</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between items-center">
                    <span>Tiền dịch vụ đi kèm:</span>
                    <span>+{formatCurrency(totalServices)}</span>
                  </div>
                  <div className="border-t border-white/10 pt-2 flex justify-between items-center font-bold text-amber-300 text-xs">
                    <span>TỔNG CỘNG THANH TOÁN:</span>
                    <span className="text-sm font-black">{formatCurrency(fullAmount)}</span>
                  </div>
                </>
              )}
            </div>

            <div className="absolute -bottom-6 -right-6 opacity-[0.03]">
              <span className="material-symbols-outlined text-[130px]">payments</span>
            </div>
          </section>

          {/* Payment Method Selector */}
          <section className="bg-white p-5 rounded-[24px] border border-slate-100 shadow-sm space-y-4 flex-none">
            <h4 className="text-[10px] font-black text-emerald-950 uppercase tracking-widest flex items-center gap-2">
              <span className="material-symbols-outlined text-base text-emerald-600">payment</span>
              Chọn phương thức thanh toán
            </h4>
            
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'banking', label: 'Chuyển Khoản', icon: 'account_balance' },
                { id: 'cash', label: 'Tiền Mặt', icon: 'payments' }
              ].map(m => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setPaymentMethod(m.id as any)}
                  className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl border transition-all ${
                    paymentMethod === m.id 
                      ? 'border-emerald-600 bg-emerald-50/40 text-emerald-900 font-black shadow-sm ring-1 ring-emerald-600/20'
                      : 'border-slate-100 bg-white text-slate-400 hover:border-slate-200'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">{m.icon}</span>
                  <span className="text-[9px] uppercase tracking-wider font-extrabold leading-none text-center">{m.label}</span>
                </button>
              ))}
            </div>

            {/* Dynamic detailed content per method */}
            <div className="border-t border-slate-100 pt-4">
              
              {/* Method 1: Banking */}
              {paymentMethod === 'banking' && (
                <div className="space-y-4 animate-in fade-in duration-300">
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col items-center gap-4">
                    
                    {/* VietQR Mockup */}
                    <div className="bg-white p-4 rounded-xl border border-slate-150 shadow-md flex flex-col items-center w-full max-w-[250px]">
                      <div className="flex justify-between items-center w-full border-b border-slate-100 pb-2 mb-3">
                        <span className="text-[9px] font-black text-blue-900 font-mono tracking-widest">VIETQR</span>
                        <span className="text-[8px] bg-red-50 text-red-600 px-1.5 py-0.5 rounded font-black font-mono">NAPAS 247</span>
                      </div>
                      
                      <div className="w-28 h-28 bg-slate-50 flex items-center justify-center border border-slate-100 rounded-lg p-2 relative group">
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
                      <span className="text-[9px] text-gray-400 mt-2 text-center">Quét bằng ứng dụng ngân hàng để chuyển khoản nhanh</span>
                    </div>
                    
                    {/* Bank Info */}
                    <div className="w-full space-y-2.5 text-xs text-slate-800">
                      <div className="flex justify-between items-center border-b border-slate-100 pb-1.5">
                        <span className="text-gray-400 font-medium">Ngân hàng:</span>
                        <span className="font-extrabold text-slate-700">MB Bank (Quân Đội)</span>
                      </div>
                      
                      <div className="flex justify-between items-center border-b border-slate-100 pb-1.5">
                        <span className="text-gray-400 font-medium">Số tài khoản:</span>
                        <div className="flex items-center gap-1.5">
                          <span className="font-black text-emerald-950 font-mono tracking-wider">1029384756</span>
                          <button 
                            type="button"
                            onClick={() => handleCopy('1029384756', 'số tài khoản')}
                            className="text-emerald-600 hover:text-emerald-700 p-1 bg-emerald-50 rounded-md flex items-center justify-center transition-colors"
                          >
                            <span className="material-symbols-outlined text-xs">content_copy</span>
                          </button>
                        </div>
                      </div>

                      <div className="flex justify-between items-center border-b border-slate-100 pb-1.5">
                        <span className="text-gray-400 font-medium">Chủ tài khoản:</span>
                        <span className="font-black uppercase text-slate-700">DANG VAN TIEN</span>
                      </div>

                      <div className="flex justify-between items-center border-b border-slate-100 pb-1.5">
                        <span className="text-gray-400 font-medium">Số tiền:</span>
                        <div className="flex items-center gap-1.5">
                          <span className="font-black text-emerald-950">{formatCurrency(activeAmount)}</span>
                          <button 
                            type="button"
                            onClick={() => handleCopy(activeAmount.toString(), 'số tiền')}
                            className="text-emerald-600 hover:text-emerald-700 p-1 bg-emerald-50 rounded-md flex items-center justify-center transition-colors"
                          >
                            <span className="material-symbols-outlined text-xs">content_copy</span>
                          </button>
                        </div>
                      </div>

                      <div className="flex justify-between items-center pb-0.5">
                        <span className="text-gray-400 font-medium">Nội dung CK:</span>
                        <div className="flex items-center gap-1.5">
                          <span className="font-black text-amber-800 bg-amber-50 border border-amber-100 px-2.5 py-0.5 rounded-lg font-mono">
                            PITCHHUB {shortBookId}
                          </span>
                          <button 
                            type="button"
                            onClick={() => handleCopy(`PITCHHUB ${shortBookId}`, 'nội dung chuyển khoản')}
                            className="text-amber-800 hover:text-amber-900 p-1 bg-amber-100/50 rounded-md flex items-center justify-center transition-colors"
                          >
                            <span className="material-symbols-outlined text-xs">content_copy</span>
                          </button>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              )}

              {/* Method 2: Cash */}
              {paymentMethod === 'cash' && (
                <div className="p-5 bg-amber-50 border border-amber-100 rounded-2xl text-xs text-amber-950 space-y-3 animate-in fade-in duration-300">
                  <h5 className="font-black flex items-center gap-1.5 text-amber-950 text-xs">
                    <span className="material-symbols-outlined text-[16px]">info</span>
                    Thanh toán trực tiếp tại quầy
                  </h5>
                  <p className="leading-relaxed text-[11px] text-amber-900">
                    Vui lòng di chuyển đến quầy đón tiếp của **Sân Bóng** trong vòng 15 phút, cung cấp mã hóa đơn <strong className="font-mono bg-amber-100 border border-amber-200 px-1.5 py-0.5 rounded text-amber-950 font-black">{shortBookId}</strong> để thanh toán số tiền <strong className="text-emerald-950 font-black">{formatCurrency(activeAmount)}</strong> bằng tiền mặt và nhận xác thực đơn đặt sân.
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* Actions */}
          <div className="space-y-3 mt-2 flex-none">
            <button
              onClick={handlePayment}
              disabled={submitting || isExpired}
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black shadow-lg shadow-emerald-900/10 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-xs uppercase tracking-wider"
            >
              {submitting ? (
                <Spin size="small" />
              ) : (
                <>
                  <span className="material-symbols-outlined text-sm">check_circle</span>
                  {paymentMethod === 'banking' ? 'Tôi Đã Chuyển Khoản' : 'Xác Nhận Giữ Chỗ Quầy'}
                </>
              )}
            </button>

            <button
              onClick={handleCancelBooking}
              disabled={cancelling || submitting || isExpired}
              className="w-full py-3 bg-white text-rose-600 hover:text-rose-700 font-bold border border-rose-100 hover:bg-rose-50/30 rounded-2xl transition-all flex items-center justify-center gap-1 text-[11px] disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider"
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
