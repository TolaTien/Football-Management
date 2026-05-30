import React from 'react';

interface FinanceStatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  trend: string;
  color: string;
  bg: string;
  gradient?: string;
}

export const FinanceStatCard: React.FC<FinanceStatCardProps> = ({
  icon, label, value, trend, color, bg, gradient
}) => {
  const isLight = !gradient;
  return (
    <div 
      className={`rounded-2xl p-5 shadow-sm border border-slate-200 flex flex-col justify-between relative overflow-hidden transition-all duration-200 hover:shadow-md ${
        gradient 
          ? `bg-gradient-to-br ${gradient} text-white` 
          : 'bg-white text-slate-800'
      }`}
    >
      <div className="absolute -right-4 -bottom-4 w-20 h-20 rounded-full bg-white/5" />
      <div className="flex justify-between items-start mb-4">
        <div 
          className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl ${
            isLight ? '' : 'bg-white/20 text-white'
          }`}
          style={isLight ? { backgroundColor: bg, color } : undefined}
        >
          {icon}
        </div>
        <span 
          className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
            isLight ? 'bg-slate-100 text-slate-600' : 'bg-white/25 text-white'
          }`}
        >
          {trend}
        </span>
      </div>
      <div>
        <div className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${isLight ? 'text-slate-400' : 'text-emerald-100'}`}>
          {label}
        </div>
        <div className="text-2xl font-extrabold">{value}</div>
      </div>
    </div>
  );
};
