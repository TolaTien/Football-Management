import React from 'react';

export const ScheduleToolbar: React.FC = () => {
  return (
    <div className="flex justify-between items-end mb-lg">
      <div>
        <h2 className="font-h1 text-h1 text-emerald-900">Pitch Schedule</h2>
        <p className="font-body-lg text-secondary">Manage and track real-time bookings across all facilities.</p>
      </div>
      <div className="flex gap-md">
        <div className="flex items-center bg-white border border-outline-variant rounded-lg p-xs h-10">
          <button className="px-4 py-1 rounded-md bg-emerald-50 text-emerald-900 font-button text-xs transition-all">Day</button>
          <button className="px-4 py-1 rounded-md text-gray-400 font-button text-xs hover:text-emerald-900 transition-all">Week</button>
        </div>
        <button className="flex items-center gap-2 bg-primary text-on-primary px-6 py-2 rounded-lg font-button active:scale-95 transition-transform">
          <span className="material-symbols-outlined text-sm" data-icon="add">add</span>
          New Booking
        </button>
      </div>
    </div>
  );
};
