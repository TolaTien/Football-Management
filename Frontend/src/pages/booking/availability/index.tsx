import React, { useState, useEffect } from 'react';
import { ScheduleToolbar } from '../../../widgets/booking-schedule/ui/ScheduleToolbar';
import { ScheduleGrid } from '../../../widgets/booking-schedule/ui/ScheduleGrid';
import { ScheduleLegend } from '../../../widgets/booking-schedule/ui/ScheduleLegend';
import { QuickConfirmModal } from '../../../features/booking-pitch/ui/QuickConfirmModal';
import { PitchService, PitchItem } from '@/entities/pitch/api/pitchService';
import { message, Spin, Select } from 'antd';
import dayjs from 'dayjs';

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

  useEffect(() => {
    fetchPitches();
  }, []);

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
    if (viewMode === 'day') {
      const pitch = pitches[pitchIndexOrDayIndex];
      if (!pitch) return;
      
      setSelectedSlot({ 
        pitchName: pitch.namePitch, 
        timeSlot, 
        price: '120,000 VNĐ', 
        pitchId: pitch.pitchId,
        date: selectedDate.format('YYYY-MM-DD')
      });
    } else {
      const pitch = pitches.find(p => p.pitchId === selectedPitchId);
      if (!pitch) return;
      
      const targetDate = dayjs().add(pitchIndexOrDayIndex, 'day');
      setSelectedSlot({
        pitchName: pitch.namePitch,
        timeSlot,
        price: '120,000 VNĐ',
        pitchId: pitch.pitchId,
        date: targetDate.format('YYYY-MM-DD')
      });
    }
    setShowConfirm(true);
  };

  const handleBookingSuccess = () => {
    setShowConfirm(false);
    fetchPitches(); // Refresh the grid
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
          <span className="text-xs font-bold text-gray-500 font-montserrat uppercase tracking-wider">Select Facility:</span>
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
            <Spin size="large" tip="Loading schedule...">
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

      {/* Floating Status Helper */}
      <div className="fixed bottom-lg right-lg z-30">
        <div className="flex flex-col items-end gap-3">
          <div className="bg-white px-4 py-2 rounded-full shadow-lg border border-emerald-100 flex items-center gap-3 animate-pulse">
            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
            <span className="text-xs font-bold text-emerald-900 font-montserrat">
              {pitches.filter(p => p.status === 'active').length} Pitches Active Now
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingAvailabilityPage;
