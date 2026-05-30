import React from 'react';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';

interface ScheduleToolbarProps {
  viewMode: 'day' | 'week';
  onViewModeChange: (mode: 'day' | 'week') => void;
  selectedDate: dayjs.Dayjs;
  onDateChange: (date: dayjs.Dayjs) => void;
}

export const ScheduleToolbar: React.FC<ScheduleToolbarProps> = ({
  viewMode,
  onViewModeChange,
  selectedDate,
  onDateChange
}) => {
  const disabledDate = (current: dayjs.Dayjs) => {
    // Can only select from today to today + 6 days (1 week)
    const today = dayjs().startOf('day');
    const maxDate = dayjs().add(6, 'day').endOf('day');
    return current && (current < today || current > maxDate);
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-lg gap-4">
      <div>
        <h2 className="font-h1 text-h1 text-emerald-900">Lịch đặt sân</h2>
        <p className="font-body-lg text-secondary">Theo dõi và đặt lịch sân bóng thời gian thực.</p>
      </div>
      
      <div className="flex items-center gap-md self-stretch sm:self-auto justify-between sm:justify-start">
        {/* Date Selector - Only shown in Day view */}
        {viewMode === 'day' && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-500 font-montserrat uppercase tracking-wider">Ngày:</span>
            <DatePicker 
              value={selectedDate} 
              onChange={(val) => val && onDateChange(val)} 
              disabledDate={disabledDate}
              allowClear={false}
              className="border-gray-200 rounded-lg h-10 hover:border-primary focus:border-primary"
            />
          </div>
        )}

        {/* View Mode Toggle */}
        <div className="flex items-center bg-white border border-outline-variant rounded-lg p-xs h-10 shadow-sm">
          <button 
            onClick={() => onViewModeChange('day')}
            className={`px-4 py-1.5 rounded-md font-button text-xs transition-all ${
              viewMode === 'day' 
              ? 'bg-emerald-50 text-emerald-900 font-bold' 
              : 'text-gray-400 hover:text-emerald-900'
            }`}
          >
            Ngày
          </button>
          <button 
            onClick={() => onViewModeChange('week')}
            className={`px-4 py-1.5 rounded-md font-button text-xs transition-all ${
              viewMode === 'week' 
              ? 'bg-emerald-50 text-emerald-900 font-bold' 
              : 'text-gray-400 hover:text-emerald-900'
            }`}
          >
            Tuần
          </button>
        </div>
      </div>
    </div>
  );
};
