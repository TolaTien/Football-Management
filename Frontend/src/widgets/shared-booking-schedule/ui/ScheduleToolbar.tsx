import React from 'react';

interface ScheduleToolbarProps {
  viewMode: 'day' | 'week';
  onViewModeChange: (mode: 'day' | 'week') => void;
}

export const ScheduleToolbar: React.FC<ScheduleToolbarProps> = ({
  viewMode,
  onViewModeChange
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-lg gap-4">
      <div>
        <h2 className="font-h1 text-h1 text-emerald-900">Lịch đặt sân</h2>
        <p className="font-body-lg text-secondary">Theo dõi và đặt lịch sân bóng thời gian thực.</p>
      </div>
      
      <div className="flex items-center gap-md self-stretch sm:self-auto justify-between sm:justify-start">
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
