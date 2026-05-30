import React from 'react';

export const TIME_SLOTS = [
  '07:30 - 09:00',
  '09:00 - 10:30',
  '10:30 - 12:00',
  '12:00 - 13:30',
  '13:30 - 15:00',
  '15:00 - 16:30',
  '16:30 - 18:00',
  '18:00 - 19:30',
  '19:30 - 21:00',
  '21:00 - 22:30',
  '22:30 - 24:00',
];

export const TimeAxis: React.FC = () => {
  return (
    <div className="w-24 flex-shrink-0 border-r border-gray-200 bg-gray-50/50 flex flex-col">
      {TIME_SLOTS.map((slot) => (
        <div key={slot} className="flex-1 min-h-[80px] flex items-center justify-center text-[11px] font-bold text-gray-400 border-b border-gray-100 last:border-b-0">
          {slot}
        </div>
      ))}
    </div>
  );
};
