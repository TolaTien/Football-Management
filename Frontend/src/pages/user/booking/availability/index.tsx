import React, { useState, useEffect } from 'react';
import { ScheduleToolbar, ScheduleGrid, ScheduleLegend } from '@/widgets/shared-booking-schedule';
import { QuickConfirmModal, PaymentInvoiceModal, PaymentTimerWidget } from '@/features/booking';
import { BookingService } from '@/entities/booking';
import { PitchService, PitchItem } from '@/entities/pitch';
import { message, Spin, Select } from 'antd';
import dayjs from 'dayjs';

const formatTime = (dateStr: string | Date | null | undefined): string => {
  if (!dateStr) return '00:00';
  const d = new Date(dateStr);
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
};

const getPitchPriceForSlot = (pitch: PitchItem, timeSlot: string): string | null => {
  if (!pitch || !pitch.pitchprice || !Array.isArray(pitch.pitchprice) || pitch.pitchprice.length === 0) {
    return null;
  }

  const [slotStart] = timeSlot.split(' - ');
  if (!slotStart) return null;

  const [slotHour, slotMin] = slotStart.split(':').map(Number);
  const slotMinutes = slotHour * 60 + slotMin;

  const matchedPrice = pitch.pitchprice.find(pr => {
    if (!pr.startTime || !pr.endTime) return false;
    const [sh, sm] = formatTime(pr.startTime).split(':').map(Number);
    const [eh, em] = formatTime(pr.endTime).split(':').map(Number);
    
    const startMinutes = sh * 60 + sm;
    let endMinutes = eh * 60 + em;
    
    if (endMinutes < startMinutes) endMinutes += 24 * 60;

    return slotMinutes >= startMinutes && slotMinutes < endMinutes;
  });

  if (matchedPrice && matchedPrice.price !== undefined) {
    return `${matchedPrice.price.toLocaleString('vi-VN')} VNĐ`;
  }

  const defaultPrice = pitch.pitchprice[0]?.price;
  if (defaultPrice !== undefined) {
    return `${defaultPrice.toLocaleString('vi-VN')} VNĐ`;
  }

  return null;
};

const BookingAvailabilityPage: React.FC = () => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState({ 
    pitchName: '', 
    timeSlot: '', 
    price: '', 
    pitchId: '',
    date: ''
  });
  const [pitches, setPitches] = useState<PitchItem[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Day/Week states
  const [viewMode, setViewMode] = useState<'day' | 'week'>('day');
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs>(dayjs());
  const [selectedPitchId, setSelectedPitchId] = useState<string>('');

  // Payment invoice states
  const [activeBooking, setActiveBooking] = useState<any>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showTimerWidget, setShowTimerWidget] = useState(false);
  const [timeLeft, setTimeLeft] = useState(900); // 15 mins in seconds

  useEffect(() => {
    fetchPitches();

    // Restore active unpaid booking if it exists and hasn't expired
    try {
      const saved = localStorage.getItem('pitchhub_pending_booking');
      if (saved) {
        const { booking, expiryTimestamp } = JSON.parse(saved);
        const remaining = Math.round((expiryTimestamp - Date.now()) / 1000);
        if (remaining > 0) {
          setActiveBooking(booking);
          setTimeLeft(remaining);
          setShowTimerWidget(true);
        } else {
          // Expired while offline, clean up
          localStorage.removeItem('pitchhub_pending_booking');
        }
      }
    } catch (e) {
      console.error('Failed to restore booking state', e);
    }
  }, []);

  // Timer countdown ticker
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (activeBooking && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            handleAutoCancel();
            return 0;
          }
          
          // Sync local storage remaining time
          try {
            const saved = localStorage.getItem('pitchhub_pending_booking');
            if (saved) {
              const parsed = JSON.parse(saved);
              const remaining = Math.round((parsed.expiryTimestamp - Date.now()) / 1000);
              if (remaining <= 0) {
                clearInterval(interval);
                handleAutoCancel();
                return 0;
              }
              return remaining;
            }
          } catch (e) {
            // Ignore parsing errors
          }

          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeBooking, timeLeft]);

  const fetchPitches = async () => {
    setLoading(true);
    try {
      const res = await PitchService.getAllPitches();
      setPitches(res.pitches);
      if (res.pitches.length > 0) {
        setSelectedPitchId(res.pitches[0].pitchId);
      }
    } catch (err) {
      message.error('Không thể tải danh sách sân');
    } finally {
      setLoading(false);
    }
  };

  const handleTimeSlotSelect = (pitchIndexOrDayIndex: number, timeSlot: string) => {
    if (activeBooking) {
      message.warning('Bạn đang có một đơn đặt sân chờ thanh toán. Vui lòng thanh toán hoặc hủy đơn cũ trước khi đặt sân mới.');
      setShowPaymentModal(true);
      setShowTimerWidget(false);
      return;
    }

    let pitch: PitchItem | undefined;
    let targetDateStr = selectedDate.format('YYYY-MM-DD');

    if (viewMode === 'day') {
      pitch = pitches[pitchIndexOrDayIndex];
    } else {
      pitch = pitches.find(p => p.pitchId === selectedPitchId);
      const targetDate = dayjs().add(pitchIndexOrDayIndex, 'day');
      targetDateStr = targetDate.format('YYYY-MM-DD');
    }

    if (!pitch) return;

    const calculatedPrice = getPitchPriceForSlot(pitch, timeSlot);
    if (!calculatedPrice) {
      message.error('Khung giờ này của sân hiện chưa được cấu hình giá. Vui lòng liên hệ quản lý sân để được hỗ trợ!');
      return;
    }

    setSelectedSlot({ 
      pitchName: pitch.namePitch, 
      timeSlot, 
      price: calculatedPrice, 
      pitchId: pitch.pitchId,
      date: targetDateStr
    });
    
    setShowConfirm(true);
  };

  // Triggers when QuickConfirmModal reports successful booking
  const handleBookingSuccess = (bookingData: any) => {
    setShowConfirm(false);
    
    // Save to local storage with 15 minutes expiration
    const expiryTimestamp = Date.now() + 15 * 60 * 1000;
    localStorage.setItem('pitchhub_pending_booking', JSON.stringify({
      booking: bookingData,
      expiryTimestamp
    }));

    setActiveBooking(bookingData);
    setTimeLeft(900);
    setShowPaymentModal(true);
    setShowTimerWidget(false);
    fetchPitches(); // Refresh the grid
  };

  const handleAutoCancel = async () => {
    if (activeBooking) {
      try {
        await BookingService.cancelBooking(activeBooking.bookId, 'Quá hạn 15 phút chưa thanh toán (tự động hủy)');
        message.warning('Đơn đặt sân của bạn đã tự động bị hủy do quá hạn thanh toán 15 phút.');
      } catch (err) {
        console.error('Failed to auto-cancel booking', err);
      } finally {
        cleanupBookingState();
      }
    }
  };

  const cleanupBookingState = () => {
    localStorage.removeItem('pitchhub_pending_booking');
    setActiveBooking(null);
    setShowPaymentModal(false);
    setShowTimerWidget(false);
    setTimeLeft(900);
    fetchPitches(); // Refresh the grid
  };

  const handleMinimizePayment = () => {
    setShowPaymentModal(false);
    setShowTimerWidget(true);
  };

  const handleRestorePayment = () => {
    setShowTimerWidget(false);
    setShowPaymentModal(true);
  };

  return (
    <div className="animate-in fade-in duration-300 h-full flex flex-col">
      <ScheduleToolbar 
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
      />

      {/* Select Pitch for Week view */}
      {viewMode === 'week' && pitches.length > 0 && (
        <div className="flex items-center gap-3 bg-white p-4 rounded-xl border border-gray-200 mb-md shadow-sm">
          <span className="text-xs font-bold text-gray-500 font-montserrat uppercase tracking-wider">Chọn cơ sở:</span>
          <Select 
            value={selectedPitchId}
            onChange={(val) => setSelectedPitchId(val)}
            className="w-64"
            options={pitches.map(p => ({ label: p.namePitch, value: p.pitchId }))}
          />
        </div>
      )}
      
      {/* Schedule Grid + Legend */}
      <div className="flex-1 flex flex-col min-h-0">
        {loading ? (
          <div className="flex-1 flex items-center justify-center bg-white rounded-xl border border-gray-200">
            <Spin size="large" tip="Đang tải lịch đặt sân...">
              <div className="p-8" />
            </Spin>
          </div>
        ) : (
          <ScheduleGrid 
            pitches={pitches} 
            viewMode={viewMode}
            selectedDate={selectedDate}
            selectedPitchId={selectedPitchId}
            onTimeSlotSelect={handleTimeSlotSelect} 
          />
        )}
        <ScheduleLegend />
      </div>

      {/* Booking Confirmation Modal */}
      <QuickConfirmModal 
        isOpen={showConfirm} 
        onClose={() => setShowConfirm(false)}
        onSuccess={handleBookingSuccess}
        pitchName={selectedSlot.pitchName}
        timeSlot={selectedSlot.timeSlot}
        price={selectedSlot.price}
        pitchId={selectedSlot.pitchId}
        selectedDate={selectedSlot.date}
      />

      {/* Payment Invoice Modal */}
      <PaymentInvoiceModal
        isOpen={showPaymentModal}
        booking={activeBooking}
        timeLeft={timeLeft}
        onMinimize={handleMinimizePayment}
        onPaymentSuccess={cleanupBookingState} // Clean up and refresh states after successful payment
        onCancelSuccess={cleanupBookingState}
      />

      {/* Floating Timer Widget when minimized */}
      <PaymentTimerWidget
        isOpen={showTimerWidget}
        timeLeft={timeLeft}
        onClick={handleRestorePayment}
      />

      {/* Floating Status Helper */}
      <div className="fixed bottom-lg right-lg z-30">
        <div className="flex flex-col items-end gap-3">
          <div className="bg-white px-4 py-2 rounded-full shadow-lg border border-emerald-100 flex items-center gap-3 animate-pulse">
            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
            <span className="text-xs font-bold text-emerald-900 font-montserrat">
              {pitches.filter(p => p.status === 'active').length} Sân đang hoạt động
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingAvailabilityPage;
