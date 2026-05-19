import React from 'react';
import { PitchHeaderCell } from '../../../entities/pitch/ui/PitchHeaderCell';
import { TimeAxis, TIME_SLOTS } from '../../../entities/booking/ui/TimeAxis';
import { BookingBlock } from '../../../entities/booking/ui/BookingBlock';
import { PitchItem } from '@/shared/api/pitch/pitch.service';
import dayjs from 'dayjs';

interface ScheduleGridProps {
  pitches: PitchItem[];
  onTimeSlotSelect: (pitchIndex: number, timeSlot: string) => void;
}

export const ScheduleGrid: React.FC<ScheduleGridProps> = ({ pitches = [], onTimeSlotSelect }) => {
  
  const getBookingForSlot = (pitch: PitchItem, slot: string) => {
    if (!pitch || !pitch.booking || !Array.isArray(pitch.booking) || pitch.booking.length === 0) return null;

    const [slotStartStr] = slot.split(' - ');
    if (!slotStartStr) return null;
    
    const [hours, minutes] = slotStartStr.split(':').map(n => parseInt(n));
    const slotStart = dayjs().set('hour', hours).set('minute', minutes).set('second', 0).set('millisecond', 0);

    const booking = pitch.booking.find(b => {
      const bStart = dayjs(b.startTime);
      const bEnd = dayjs(b.endTime);
      // Check if slot start time falls within the booking interval (ignoring date for simpler grid mapping)
      // Since the grid is "Day view", we only compare hours and minutes
      const bStartHour = bStart.hour();
      const bStartMin = bStart.minute();
      const bEndHour = bEnd.hour();
      const bEndMin = bEnd.minute();
      
      const slotHour = slotStart.hour();
      const slotMin = slotStart.minute();
      
      const slotVal = slotHour * 60 + slotMin;
      const startVal = bStartHour * 60 + bStartMin;
      const endVal = bEndHour * 60 + bEndMin;
      
      return slotVal >= startVal && slotVal < endVal;
    });

    if (booking) {
      return {
        status: (booking.status === 'approved' ? 'booked' : 'pending') as 'booked' | 'pending',
        title: booking.status === 'approved' ? 'Confirmed' : 'Pending'
      };
    }

    return null;
  };

  const safePitches = Array.isArray(pitches) ? pitches : [];

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col h-[calc(100vh-250px)]">
      {/* Grid Headers */}
      <div className="flex border-b border-gray-200 bg-gray-50">
        <div className="w-24 flex-shrink-0 border-r border-gray-200 flex items-center justify-center p-4">
          <span className="material-symbols-outlined text-gray-400" data-icon="schedule">schedule</span>
        </div>
        <div className="flex-1 grid grid-cols-4">
          {safePitches.slice(0, 4).map((pitch, idx) => (
            <PitchHeaderCell 
              key={pitch.pitchId} 
              name={pitch.namePitch} 
              type={`${pitch.pitchCategory}-A-SIDE`} 
              isLast={idx === 3 || idx === safePitches.length - 1} 
            />
          ))}
          {safePitches.length === 0 && [1, 2, 3, 4].map(i => (
            <PitchHeaderCell key={i} name={`Pitch ${i}`} type="Loading..." isLast={i === 4} />
          ))}
        </div>
      </div>

      {/* Grid Body - Scrollable Container */}
      <div className="flex-1 flex overflow-y-auto relative">
        <TimeAxis />

        {/* Interactive Grid Cells */}
        <div className="flex-1 grid grid-cols-4">
          {[0, 1, 2, 3].map(colIndex => {
            const pitch = safePitches[colIndex];
            return (
              <div key={colIndex} className="border-r border-gray-100 flex flex-col">
                {TIME_SLOTS.map((slot) => {
                  const booking = pitch ? getBookingForSlot(pitch, slot) : null;
                  
                  return (
                    <div 
                      key={slot}
                      className="flex-1 min-h-[80px] border-b border-gray-100 last:border-b-0 relative group"
                      onClick={() => {
                        if (!booking && pitch) {
                          onTimeSlotSelect(colIndex, slot);
                        }
                      }}
                    >
                      {booking ? (
                        <BookingBlock status={booking.status} title={booking.title} />
                      ) : (
                        <div className="w-full h-full hover:bg-primary/10 transition-colors cursor-pointer flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <span className="text-primary font-bold text-sm">+ Book Now</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
