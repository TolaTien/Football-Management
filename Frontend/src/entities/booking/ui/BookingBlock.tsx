import React from 'react';

export type BookingStatus = 'booked' | 'pending' | 'draft';

interface BookingBlockProps {
  status: BookingStatus;
  title: string;
  price?: string; // For draft state
}

export const BookingBlock: React.FC<BookingBlockProps> = ({ status, title, price }) => {
  // Base styles based on status
  const styles = {
    booked: 'bg-emerald-50 border-l-4 border-emerald-600 rounded-r-md transition-all',
    pending: 'bg-amber-50 border-l-4 border-amber-500 rounded-r-md transition-all',
    draft: 'bg-primary/10 border-2 border-primary border-dashed z-20 flex items-center justify-center active-drag-shadow cursor-pointer rounded-md',
  };

  const textStyles = {
    booked: 'text-emerald-800',
    pending: 'text-amber-800',
    draft: 'text-primary',
  };

  return (
    <div 
      className={`w-full h-full p-3 ${styles[status]}`}
    >
      {status === 'draft' ? (
        <div className="bg-white px-3 py-1 rounded-md shadow-lg flex items-center gap-2 border border-primary/20 animate-pulse">
          <span className="material-symbols-outlined text-primary text-sm" data-icon="info">info</span>
          <span className="text-xs font-bold text-primary font-montserrat">{price} EST.</span>
        </div>
      ) : (
        <div className="flex flex-col h-full justify-between">
          <p className={`text-[10px] font-bold uppercase font-montserrat ${textStyles[status]}`}>
            {title}
          </p>
          {status === 'booked' ? (
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-xs text-emerald-600" data-icon="lock">lock</span>
              <span className="text-[9px] text-emerald-700 font-bold">Confirmed</span>
            </div>
          ) : (
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-xs text-amber-500" data-icon="pending">pending</span>
              <span className="text-[9px] text-amber-600 font-bold">Pending</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

