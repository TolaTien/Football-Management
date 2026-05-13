import React, { useState } from 'react';
import { ScheduleToolbar } from '../../../widgets/booking-schedule/ui/ScheduleToolbar';
import { ScheduleGrid } from '../../../widgets/booking-schedule/ui/ScheduleGrid';
import { ScheduleLegend } from '../../../widgets/booking-schedule/ui/ScheduleLegend';
import { QuickConfirmModal } from '../../../features/booking-pitch/ui/QuickConfirmModal';

const BookingAvailabilityPage: React.FC = () => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState({ pitchName: '', timeSlot: '', price: '' });

  const formatTime = (totalHours: number) => {
    const h = Math.floor(totalHours);
    const m = Math.round((totalHours - h) * 60);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const displayH = h > 12 ? h - 12 : (h === 0 ? 12 : h);
    return `${displayH.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')} ${ampm}`;
  };

  const handleTimeSlotSelect = (pitchIndex: number, startHour: number, endHour: number) => {
    const pitchName = `Pitch ${pitchIndex + 1}`;
    const timeSlot = `${formatTime(startHour)} - ${formatTime(endHour)}`;
    const duration = endHour - startHour;
    const price = `$${duration * 60}.00`; // Mock price: $60/hr
    
    setSelectedSlot({ pitchName, timeSlot, price });
    setShowConfirm(true);
  };

  return (
    <div className="animate-in fade-in duration-300 h-full flex flex-col">
      <ScheduleToolbar />
      
      {/* Schedule Grid + Legend */}
      <div className="flex-1 flex flex-col min-h-0">
        <ScheduleGrid onTimeSlotSelect={handleTimeSlotSelect} />
        <ScheduleLegend />
      </div>

      {/* Booking Confirmation Modal */}
      <QuickConfirmModal 
        isOpen={showConfirm} 
        onClose={() => setShowConfirm(false)} 
        pitchName={selectedSlot.pitchName}
        timeSlot={selectedSlot.timeSlot}
        price={selectedSlot.price}
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
