import React from 'react';

export const ScheduleLegend: React.FC = () => {
  return (
    <div className="border-t border-gray-200 p-md flex justify-between items-center bg-gray-50">
      <div className="flex gap-lg">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
          <span className="text-xs text-gray-500 font-medium">Trống</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-error"></div>
          <span className="text-xs text-gray-500 font-medium">Đã đặt</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-tertiary-container"></div>
          <span className="text-xs text-gray-500 font-medium">Chờ duyệt</span>
        </div>
      </div>
      <div className="text-xs text-gray-400 font-medium">
        Giờ hiện tại: <span className="text-emerald-900 font-bold">10:45 AM</span>
      </div>
    </div>
  );
};
