import React from 'react';

interface SummaryItem {
  icon: string;
  label: string;
  value: string | number;
  color: string;
  bg: string;
}

interface ServicesSummaryStatsProps {
  items: SummaryItem[];
}

export const ServicesSummaryStats: React.FC<ServicesSummaryStatsProps> = ({ items }) => {
  return (
    <div className="flex gap-4 mb-6 flex-wrap">
      {items.map((item) => (
        <div key={item.label} className="flex-1 min-w-[160px] bg-white rounded-2xl p-4.5 border border-slate-205 flex items-center gap-3.5 shadow-sm transition-all duration-200 hover:shadow-md">
          <div 
            className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
            style={{ backgroundColor: item.bg }}
          >
            {item.icon}
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">{item.label}</div>
            <div className="text-xl font-extrabold" style={{ color: item.color }}>{item.value}</div>
          </div>
        </div>
      ))}
    </div>
  );
};
