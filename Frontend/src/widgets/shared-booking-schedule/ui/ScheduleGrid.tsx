import React from 'react';
import { PitchHeaderCell, type PitchItem } from '@/entities/pitch';
import { TimeAxis, BookingBlock, TIME_SLOTS } from '@/entities/booking';
import dayjs from 'dayjs';

interface ScheduleGridProps {
  pitches: PitchItem[];
  viewMode: 'day' | 'week';
  selectedDate: dayjs.Dayjs;
  selectedPitchId: string;
  onTimeSlotSelect: (index: number, timeSlot: string) => void;
}

export const ScheduleGrid: React.FC<ScheduleGridProps> = ({ 
  pitches = [], 
  viewMode,
  selectedDate,
  selectedPitchId,
  onTimeSlotSelect 
}) => {
  const weekDays = Array.from({ length: 7 }).map((_, i) => dayjs().add(i, 'day'));
  const safePitches = Array.isArray(pitches) ? pitches : [];

  const getBookingForSlot = (pitch: PitchItem, slot: string, date: dayjs.Dayjs) => {
    if (!pitch || !pitch.booking || !Array.isArray(pitch.booking) || pitch.booking.length === 0) return null;

    const [slotStartStr] = slot.split(' - ');
    if (!slotStartStr) return null;
    
    const [hours, minutes] = slotStartStr.split(':').map(n => parseInt(n));
    const slotStart = date.set('hour', hours).set('minute', minutes).set('second', 0).set('millisecond', 0);

    const booking = pitch.booking.find(b => {
      const bStart = dayjs(b.startTime);
      const bEnd = dayjs(b.endTime);
      
      // Compare exact date (year, month, day)
      const isSameDate = bStart.isSame(date, 'day');
      if (!isSameDate) return false;
      
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

  // Determine column array to render
  const columnIndices = viewMode === 'day' ? [0, 1, 2, 3] : [0, 1, 2, 3, 4, 5, 6];

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col h-[calc(100vh-250px)]">
      {/* Grid Headers */}
      <div className="flex border-b border-gray-200 bg-gray-50">
        <div className="w-24 flex-shrink-0 border-r border-gray-200 flex items-center justify-center p-4">
          <span className="material-symbols-outlined text-gray-400" data-icon="schedule">schedule</span>
        </div>
        <div className={`flex-1 grid ${viewMode === 'day' ? 'grid-cols-4' : 'grid-cols-7'}`}>
          {viewMode === 'day' ? (
            safePitches.slice(0, 4).map((pitch, idx) => (
              <PitchHeaderCell 
                key={pitch.pitchId} 
                name={pitch.namePitch} 
                type={`${pitch.pitchCategory}-A-SIDE`} 
                isLast={idx === 3 || idx === safePitches.length - 1} 
              />
            ))
          ) : (
            weekDays.map((day, idx) => (
              <PitchHeaderCell 
                key={day.toISOString()} 
                name={day.format('ddd DD/MM')} 
                type={day.isSame(dayjs(), 'day') ? 'TODAY' : day.format('dddd')} 
                isLast={idx === 6} 
              />
            ))
          )}
          {viewMode === 'day' && safePitches.length === 0 && [1, 2, 3, 4].map(i => (
            <PitchHeaderCell key={i} name={`Pitch ${i}`} type="Loading..." isLast={i === 4} />
          ))}
        </div>
      </div>

      {/* Grid Body - Scrollable Container */}
      <div className="flex-1 flex overflow-y-auto relative">
        <TimeAxis />

        {/* Interactive Grid Cells */}
        <div className={`flex-1 grid ${viewMode === 'day' ? 'grid-cols-4' : 'grid-cols-7'}`}>
          {columnIndices.map(colIndex => {
            // Find appropriate pitch and date for this column
            const pitch = viewMode === 'day' 
              ? safePitches[colIndex] 
              : safePitches.find(p => p.pitchId === selectedPitchId);
            const date = viewMode === 'day' ? selectedDate : weekDays[colIndex];

            return (
              <div key={colIndex} className="border-r border-gray-100 flex flex-col">
                {TIME_SLOTS.map((slot) => {
                  const booking = pitch ? getBookingForSlot(pitch, slot, date) : null;
                  
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
