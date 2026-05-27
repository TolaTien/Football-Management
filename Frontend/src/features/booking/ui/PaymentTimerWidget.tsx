import React from 'react';

interface PaymentTimerWidgetProps {
  isOpen: boolean;
  timeLeft: number; // in seconds
  onClick: () => void;
}

export const PaymentTimerWidget: React.FC<PaymentTimerWidgetProps> = ({ isOpen, timeLeft, onClick }) => {
  if (!isOpen) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeStr = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  // Make indicator red if less than 3 minutes
  const isUrgent = timeLeft < 180;

  return (
    <div 
      onClick={onClick}
      className={`fixed bottom-6 left-6 z-50 flex items-center gap-3 px-5 py-3 rounded-full shadow-2xl border cursor-pointer hover:scale-105 active:scale-95 transition-all duration-300 backdrop-blur-md ${
        isUrgent 
          ? 'bg-rose-950/90 border-rose-500/30 text-rose-200 shadow-rose-950/20' 
          : 'bg-emerald-950/90 border-emerald-500/30 text-emerald-200 shadow-emerald-950/20'
      }`}
    >
      {/* Pulsing Dot */}
      <span className="relative flex h-3 w-3">
        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
          isUrgent ? 'bg-rose-400' : 'bg-amber-400'
        }`}></span>
        <span className={`relative inline-flex rounded-full h-3 w-3 ${
          isUrgent ? 'bg-rose-500' : 'bg-amber-500'
        }`}></span>
      </span>

      <div className="flex flex-col">
        <span className="text-[10px] uppercase font-bold tracking-wider opacity-80 font-montserrat">
          Unpaid Booking
        </span>
        <span className="text-sm font-extrabold font-mono leading-none mt-0.5">
          {timeStr} remaining
        </span>
      </div>

      <span className="material-symbols-outlined text-base animate-bounce" style={{ fontVariationSettings: "'FILL' 1" }}>
        open_in_full
      </span>
    </div>
  );
};
