import React from 'react';

interface TimeAxisProps {
  startHour: number;
  endHour: number;
}

export const TimeAxis: React.FC<TimeAxisProps> = ({ startHour, endHour }) => {
  const hours = [];
  for (let i = startHour; i <= endHour; i++) {
    hours.push(`${i.toString().padStart(2, '0')}:00`);
  }

  return (
    <div className="w-24 flex-shrink-0 border-r border-gray-200 bg-gray-50/50">
      {hours.map((hour) => (
        <div key={hour} className="h-12 flex items-center justify-center text-[11px] font-bold text-gray-400">
          {hour}
        </div>
      ))}
    </div>
  );
};
