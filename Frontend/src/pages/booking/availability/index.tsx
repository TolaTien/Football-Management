import React, { useState, useEffect } from 'react';
import { ScheduleToolbar } from '../../../widgets/booking-schedule/ui/ScheduleToolbar';
import { ScheduleGrid } from '../../../widgets/booking-schedule/ui/ScheduleGrid';
import { ScheduleLegend } from '../../../widgets/booking-schedule/ui/ScheduleLegend';
import { QuickConfirmModal } from '../../../features/booking-pitch/ui/QuickConfirmModal';
import { PitchService, PitchItem } from '@/shared/api/pitch/pitch.service';
import { message, Spin } from 'antd';

const BookingAvailabilityPage: React.FC = () => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState({ pitchName: '', timeSlot: '', price: '', pitchId: '' });
  const [pitches, setPitches] = useState<PitchItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPitches();
  }, []);

  const fetchPitches = async () => {
    setLoading(true);
    try {
      const res = await PitchService.getAllPitches();
      setPitches(res.pitches);
    } catch (err) {
      message.error('Không thể tải danh sách sân');
    } finally {
      setLoading(false);
    }
  };

  const handleTimeSlotSelect = (pitchIndex: number, timeSlot: string) => {
    const pitch = pitches[pitchIndex];
    if (!pitch) return;

    const pitchName = pitch.namePitch;
    const pitchId = pitch.pitchId;
    
    // Find price for this slot if available in pitchprice
    // For now use mock or default
    const price = `120,000 VNĐ`; 
    
    setSelectedSlot({ pitchName, timeSlot, price, pitchId });
    setShowConfirm(true);
  };

  const handleBookingSuccess = () => {
    setShowConfirm(false);
    fetchPitches(); // Refresh the grid
  };

  return (
    <div className="animate-in fade-in duration-300 h-full flex flex-col">
      <ScheduleToolbar />
      
      {/* Schedule Grid + Legend */}
      <div className="flex-1 flex flex-col min-h-0">
        {loading ? (
          <div className="flex-1 flex items-center justify-center bg-white rounded-xl border border-gray-200">
            <Spin size="large" tip="Loading schedule...">
              <div className="p-8" />
            </Spin>
          </div>
        ) : (
          <ScheduleGrid pitches={pitches} onTimeSlotSelect={handleTimeSlotSelect} />
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
      />

      {/* Floating Status Helper */}
      <div className="fixed bottom-lg right-lg z-30">
        <div className="flex flex-col items-end gap-3">
          <div className="bg-white px-4 py-2 rounded-full shadow-lg border border-emerald-100 flex items-center gap-3 animate-pulse">
            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
            <span className="text-xs font-bold text-emerald-900 font-montserrat">4 Pitches Active Now</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingAvailabilityPage;
