import React from 'react';

export type BookingStatus = 'booked' | 'pending' | 'draft';

interface BookingBlockProps {
  status: BookingStatus;
  title: string;
  top: number; // in pixels
  height: number; // in pixels
  left?: string; // e.g. '0%', '25%'
  width?: string; // e.g. '25%'
  price?: string; // For draft state
}

export const BookingBlock: React.FC<BookingBlockProps> = ({ status, title, top, height, left = '0', width = '100%', price }) => {
  // Base styles based on status
  const styles = {
    booked: 'bg-error/10 border-l-4 border-error',
    pending: 'bg-tertiary-container/20 border-l-4 border-tertiary-container',
    draft: 'bg-primary/20 border-2 border-primary border-dashed z-20 flex items-center justify-center active-drag-shadow',
  };

  const textStyles = {
    booked: 'text-error',
    pending: 'text-tertiary-container',
    draft: 'text-primary',
  };

  return (
    <div 
      className={`absolute p-3 z-10 ${styles[status]}`}
      style={{ top: `${top}px`, height: `${height}px`, left, width }}
    >
      {status === 'draft' ? (
        <div className="bg-white px-3 py-1 rounded-md shadow-lg flex items-center gap-2 border border-primary/20">
          <span className="material-symbols-outlined text-primary text-sm" data-icon="info">info</span>
          <span className="text-xs font-bold text-primary font-montserrat">{price} EST.</span>
        </div>
      ) : (
        <div className="flex flex-col h-full justify-between">
          <p className={`text-[10px] font-bold uppercase font-montserrat ${textStyles[status]}`}>
            {title}
          </p>
          {status === 'booked' && (
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-xs text-error" data-icon="lock">lock</span>
              <span className="text-[9px] text-error/80 font-bold">Confirmed</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
