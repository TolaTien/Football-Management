import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: string;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, icon }) => {
  return (
    <div className="bg-emerald-900 text-white rounded-xl p-lg shadow-lg relative overflow-hidden h-32 flex flex-col justify-center">
      <div className="relative z-10 flex flex-col items-center justify-center text-center">
        <p className="text-emerald-300 font-label-caps text-xs mb-xs">{title}</p>
        <h4 className="text-3xl font-h1">{value}</h4>
      </div>
      <div className="absolute -bottom-10 -right-10 opacity-10 pointer-events-none">
        <span className="material-symbols-outlined text-[160px]" data-icon={icon}>{icon}</span>
      </div>
    </div>
  );
};
