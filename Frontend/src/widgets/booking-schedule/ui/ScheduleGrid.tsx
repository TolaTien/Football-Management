import React, { useState, useRef } from 'react';
import { PitchHeaderCell } from '../../../entities/pitch/ui/PitchHeaderCell';
import { TimeAxis } from '../../../entities/booking/ui/TimeAxis';
import { BookingBlock } from '../../../entities/booking/ui/BookingBlock';

interface ScheduleGridProps {
  onTimeSlotSelect: (pitchIndex: number, startHour: number, endHour: number) => void;
}

export const ScheduleGrid: React.FC<ScheduleGridProps> = ({ onTimeSlotSelect }) => {
  const startHour = 8;
  const endHour = 23;
  const pixelsPerHour = 48; // h-12 = 48px
  const snapPixels = 24; // 30 minutes snap

  const contentRef = useRef<HTMLDivElement>(null);
  
  // Track dragging state
  const [dragState, setDragState] = useState<{
    colIndex: number;
    startY: number;
    currentY: number;
  } | null>(null);

  // Helper to calculate top absolute position
  const calculateTop = (hour: number, minute: number) => {
    return (hour - startHour) * pixelsPerHour + (minute / 60) * pixelsPerHour;
  };

  const handleMouseDown = (e: React.MouseEvent, colIndex: number) => {
    // Only left click
    if (e.button !== 0 || !contentRef.current) return;
    
    // The rect of the inner moving content
    const rect = contentRef.current.getBoundingClientRect();
    // Since contentRef is moving up when scrolling, rect.top becomes negative, naturally accounting for scroll.
    const y = e.clientY - rect.top;
    
    // Snap to 30-minute blocks
    const snappedY = Math.floor(y / snapPixels) * snapPixels;
    
    setDragState({
      colIndex,
      startY: snappedY,
      currentY: snappedY,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragState || !contentRef.current) return;
    
    const rect = contentRef.current.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const snappedY = Math.floor(y / snapPixels) * snapPixels;
    
    setDragState(prev => prev ? { ...prev, currentY: snappedY } : null);
  };

  const handleMouseUp = () => {
    if (!dragState) return;
    
    const startY = Math.min(dragState.startY, dragState.currentY);
    let endY = Math.max(dragState.startY, dragState.currentY) + snapPixels;
    
    // Tối đa 2 tiếng = 4 blocks 30 phút (4 * 24 = 96px)
    if (endY - startY > 96) {
      endY = startY + 96;
    }

    const startH = startHour + (startY / pixelsPerHour);
    const endH = startHour + (endY / pixelsPerHour);

    onTimeSlotSelect(dragState.colIndex, startH, endH);
    setDragState(null);
  };

  // Render the temporary draft block while user is dragging
  const renderDraftBlock = (colIndex: number) => {
    if (!dragState || dragState.colIndex !== colIndex) return null;
    
    const startY = Math.min(dragState.startY, dragState.currentY);
    let endY = Math.max(dragState.startY, dragState.currentY) + snapPixels;
    
    // Tối đa 2 tiếng
    if (endY - startY > 96) {
      endY = startY + 96;
    }

    const height = endY - startY;
    const price = `$${(height / pixelsPerHour) * 60}.00`; // Mock: $60/hr

    return (
      <BookingBlock 
        status="draft" 
        title="Draft" 
        top={startY} 
        height={height}
        left="0%" 
        width="100%" 
        price={price}
      />
    );
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col h-[calc(100vh-250px)]">
      {/* Grid Headers */}
      <div className="flex border-b border-gray-200 bg-gray-50">
        <div className="w-24 flex-shrink-0 border-r border-gray-200 flex items-center justify-center p-4">
          <span className="material-symbols-outlined text-gray-400" data-icon="schedule">schedule</span>
        </div>
        <div className="flex-1 grid grid-cols-4">
          <PitchHeaderCell name="Pitch 1" type="5-A-SIDE • TURF" />
          <PitchHeaderCell name="Pitch 2" type="7-A-SIDE • HYBRID" />
          <PitchHeaderCell name="Pitch 3" type="5-A-SIDE • TURF" />
          <PitchHeaderCell name="Pitch 4" type="11-A-SIDE • GRASS" isLast />
        </div>
      </div>

      {/* Grid Body - Scrollable Container */}
      <div className="flex-1 flex overflow-y-auto relative">
        <TimeAxis startHour={startHour} endHour={endHour} />

        {/* Interactive Grid Cells - Inner Content Wrapper */}
        <div 
          className="flex-1 grid grid-cols-4 relative pitch-grid-line" 
          ref={contentRef}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          style={{ minHeight: `${(endHour - startHour + 1) * pixelsPerHour}px` }}
        >
          {[0, 1, 2, 3].map(colIndex => (
            <div 
              key={colIndex}
              className="border-r border-gray-100 hover:bg-primary/5 transition-colors cursor-pointer relative select-none"
              onMouseDown={(e) => handleMouseDown(e, colIndex)}
              onDragStart={(e) => e.preventDefault()}
            >
              {/* Draft interaction block */}
              {renderDraftBlock(colIndex)}
              
              {/* Mock Existing Bookings */}
              {colIndex === 0 && (
                <BookingBlock 
                  status="booked" 
                  title="League Match #204" 
                  top={calculateTop(9, 0)} 
                  height={pixelsPerHour * 3} 
                  left="0%" width="100%" 
                />
              )}
              
              {colIndex === 1 && (
                <BookingBlock 
                  status="pending" 
                  title="Training Session" 
                  top={calculateTop(16, 0)} 
                  height={pixelsPerHour * 1} 
                  left="0%" width="100%" 
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
