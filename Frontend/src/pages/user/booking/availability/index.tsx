import React, { useState, useEffect } from 'react';
import { ScheduleToolbar, ScheduleGrid, ScheduleLegend } from '@/widgets/shared-booking-schedule';
import { QuickConfirmModal, PaymentInvoiceModal, PaymentTimerWidget } from '@/features/booking';
import { BookingService } from '@/entities/booking';
import { PitchService, PitchItem } from '@/entities/pitch';
import { message, Spin, Select, DatePicker } from 'antd';
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

  const parts = timeSlot.split(' - ');
  const slotStart = parts[0];
  const slotEnd = parts[1];
  if (!slotStart || !slotEnd) return null;

  const [shStr, smStr] = slotStart.split(':').map(Number);
  const [ehStr, emStr] = slotEnd.split(':').map(Number);
  let durationMinutes = (ehStr * 60 + emStr) - (shStr * 60 + smStr);
  if (durationMinutes < 0) durationMinutes += 24 * 60;

  const slotMinutes = shStr * 60 + smStr;

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
    const calculatedPrice = Math.round((matchedPrice.price * durationMinutes) / 60);
    return `${calculatedPrice.toLocaleString('vi-VN')} VNĐ`;
  }

  const defaultPrice = pitch.pitchprice[0]?.price;
  if (defaultPrice !== undefined) {
    const calculatedPrice = Math.round((defaultPrice * durationMinutes) / 60);
    return `${calculatedPrice.toLocaleString('vi-VN')} VNĐ`;
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
    date: '',
    pitchAddress: ''
  });
  const [pitches, setPitches] = useState<PitchItem[]>([]);
  const [facilities, setFacilities] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Day/Week states & Facility filters
  const [viewMode, setViewMode] = useState<'day' | 'week'>('day');
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs>(dayjs());
  const [selectedFacility, setSelectedFacility] = useState<string>('');
  const [selectedPitchId, setSelectedPitchId] = useState<string>('');

  // Payment invoice states
  const [activeBooking, setActiveBooking] = useState<any>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showTimerWidget, setShowTimerWidget] = useState(false);
  const [timeLeft, setTimeLeft] = useState(900); // 15 mins in seconds

  useEffect(() => {
    initFacilities();

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

  // Khởi tạo danh sách cơ sở bằng cách fetch toàn bộ các trang sân bóng từ API
  const initFacilities = async () => {
    setLoading(true);
    try {
      let allPitches: PitchItem[] = [];
      let page = 1;
      let hasMore = true;

      while (hasMore) {
        const res = await PitchService.getAllPitches({ page });
        const currentPitches = res.pitches || [];
        allPitches = [...allPitches, ...currentPitches];
        
        const totalPages = res.pagination?.totalPages || 1;
        if (page >= totalPages || currentPitches.length === 0) {
          hasMore = false;
        } else {
          page++;
        }
      }

      const extractedFacilities = Array.from(new Set(allPitches.map(p => p.address).filter(Boolean))) as string[];
      setFacilities(extractedFacilities);
      
      if (extractedFacilities.length > 0) {
        const defaultFacility = extractedFacilities[0];
        setSelectedFacility(defaultFacility);
        await fetchPitchesForFacility(defaultFacility, viewMode);
      }
    } catch (err) {
      message.error('Không thể tải thông tin cơ sở');
    } finally {
      setLoading(false);
    }
  };

  // Tải danh sách sân bóng theo cơ sở cụ thể qua API (hỗ trợ phân trang nhiều trang)
  const fetchPitchesForFacility = async (facility: string, mode: 'day' | 'week') => {
    setLoading(true);
    try {
      let facilityPitches: PitchItem[] = [];
      let page = 1;
      let hasMore = true;

      while (hasMore) {
        const res = await PitchService.getAllPitches({ address: facility, page });
        const currentPitches = res.pitches || [];
        facilityPitches = [...facilityPitches, ...currentPitches];
        
        const totalPages = res.pagination?.totalPages || 1;
        if (page >= totalPages || currentPitches.length === 0) {
          hasMore = false;
        } else {
          page++;
        }
      }

      setPitches(facilityPitches);
      
      if (facilityPitches.length > 0) {
        if (mode === 'day') {
          setSelectedPitchId('all');
        } else {
          setSelectedPitchId(facilityPitches[0].pitchId);
        }
      } else {
        setSelectedPitchId('');
      }
    } catch (err) {
      message.error('Không thể tải danh sách sân của cơ sở');
    } finally {
      setLoading(false);
    }
  };

  const handleFacilityChange = async (facilityVal: string) => {
    setSelectedFacility(facilityVal);
    await fetchPitchesForFacility(facilityVal, viewMode);
  };

  const handleViewModeChange = (mode: 'day' | 'week') => {
    setViewMode(mode);
    if (mode === 'day') {
      setSelectedPitchId('all');
    } else {
      setSelectedPitchId(pitches[0]?.pitchId || '');
    }
  };

  // Lọc danh sách sân hiển thị thực tế trên grid từ state pitches (đã được fetch đầy đủ theo cơ sở từ API)
  const filteredPitches = viewMode === 'day'
    ? (selectedPitchId === 'all' ? pitches : pitches.filter(p => p.pitchId === selectedPitchId))
    : pitches.filter(p => p.pitchId === selectedPitchId);

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
      pitch = filteredPitches[pitchIndexOrDayIndex];
    } else {
      pitch = filteredPitches.find(p => p.pitchId === selectedPitchId);
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
      date: targetDateStr,
      pitchAddress: pitch.address
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
    fetchPitchesForFacility(selectedFacility, viewMode); // Refresh the grid of current facility
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
    fetchPitchesForFacility(selectedFacility, viewMode); // Refresh the grid of current facility
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
        onViewModeChange={handleViewModeChange}
      />

      {/* Unified Search & Filter bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white p-4 rounded-xl border border-gray-200 mb-lg shadow-sm">
        {/* Dropdown Chọn cơ sở */}
        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] font-bold text-gray-500 font-montserrat uppercase tracking-wider">1. Chọn cơ sở:</span>
          <Select 
            value={selectedFacility}
            onChange={handleFacilityChange}
            placeholder="Chọn cơ sở"
            className="h-10 text-xs font-semibold"
            options={facilities.map(addr => ({
              label: addr,
              value: addr
            }))}
          />
        </div>

        {/* Dropdown Chọn sân bóng */}
        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] font-bold text-gray-500 font-montserrat uppercase tracking-wider">2. Chọn sân:</span>
          <Select 
            value={selectedPitchId}
            onChange={(val) => setSelectedPitchId(val)}
            placeholder="Chọn sân bóng"
            className="h-10 text-xs font-semibold"
            disabled={!selectedFacility}
            options={[
              ...(viewMode === 'day' ? [{ label: 'Tất cả các sân', value: 'all' }] : []),
              ...pitches.map(p => ({
                label: p.namePitch,
                value: p.pitchId
              }))
            ]}
          />
        </div>

        {/* Chọn Ngày - Chỉ hoạt động khi ở chế độ xem Ngày */}
        {viewMode === 'day' ? (
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-bold text-gray-500 font-montserrat uppercase tracking-wider">3. Chọn ngày chơi:</span>
            <DatePicker 
              value={selectedDate} 
              onChange={(val) => val && setSelectedDate(val)} 
              disabledDate={(current) => {
                const today = dayjs().startOf('day');
                const maxDate = dayjs().add(6, 'day').endOf('day');
                return current && (current < today || current > maxDate);
              }}
              allowClear={false}
              className="h-10 rounded-lg border-gray-200 hover:border-primary focus:border-primary w-full text-xs"
            />
          </div>
        ) : (
          <div className="flex flex-col gap-1.5 justify-center">
            <span className="text-[10px] font-bold text-gray-500 font-montserrat uppercase tracking-wider">3. Chọn ngày chơi:</span>
            <div className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-100 p-2 rounded-lg flex items-center gap-1.5 h-10">
              <span className="material-symbols-outlined text-[16px]">calendar_month</span>
              7 Ngày từ hôm nay ({dayjs().format('DD/MM')} - {dayjs().add(6, 'day').format('DD/MM')})
            </div>
          </div>
        )}

        {/* Hướng dẫn/Khung giờ */}
        <div className="flex flex-col justify-end text-right md:border-l md:border-gray-100 md:pl-4">
          <span className="text-[10px] font-bold text-emerald-800 font-montserrat uppercase tracking-wider">Khung giờ hoạt động</span>
          <span className="text-sm font-extrabold text-emerald-950 mt-1 flex items-center justify-end gap-1">
            <span className="material-symbols-outlined text-emerald-600 text-sm">schedule</span>
            05:00 - 23:00 hàng ngày
          </span>
        </div>
      </div>
      
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
            pitches={filteredPitches} 
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
        pitchAddress={selectedSlot.pitchAddress}
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
