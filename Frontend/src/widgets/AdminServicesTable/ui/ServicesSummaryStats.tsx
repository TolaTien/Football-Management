import React from 'react';

interface SummaryItem {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: string;
  bg: string;
  border: string;
}

interface ServicesSummaryStatsProps {
  items: SummaryItem[];
}

export const ServicesSummaryStats: React.FC<ServicesSummaryStatsProps> = ({ items }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
      {items.map((item) => (
        <div 
          key={item.label} 
          className={`bg-white rounded-2xl p-5 border ${item.border} flex items-center gap-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300`}
        >
          <div 
            className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-inner"
            style={{ backgroundColor: item.bg }}
          >
            {item.icon}
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider mb-1">{item.label}</div>
            <div className="text-2xl font-black font-mono leading-none" style={{ color: item.color }}>{item.value}</div>
          </div>
        </div>
      ))}
    </div>
  );
};
