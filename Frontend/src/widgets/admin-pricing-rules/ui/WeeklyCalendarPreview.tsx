import React from 'react';
import { Card, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

interface WeeklyCalendarPreviewProps {
  onOpenAddModal: () => void;
}

export const WeeklyCalendarPreview: React.FC<WeeklyCalendarPreviewProps> = ({ onOpenAddModal }) => {
  return (
    <Card bordered={false} style={{ marginTop: 24, borderRadius: 12, boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }} bodyStyle={{ padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div style={{ fontSize: 18, fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ color: '#00a67d' }}>📅</div> Xem trước lịch tuần
        </div>
        <div style={{ display: 'flex', gap: 16, fontSize: 13, color: '#4b5563', fontWeight: 600 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#10b981' }} /> Đã đặt</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#e5e7eb' }} /> Còn trống</div>
        </div>
      </div>

      <div style={{ display: 'flex', height: 120, border: '1px solid #e5e7eb', borderRadius: 8, overflow: 'hidden' }}>
        <div style={{ width: 60, borderRight: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '10px 0', fontSize: 10, color: '#9ca3af', textAlign: 'center', fontWeight: 600 }}>
          <div>06:00</div>
          <div>12:00</div>
          <div>18:00</div>
          <div>00:00</div>
        </div>
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(14, 1fr)', gridTemplateRows: 'repeat(4, 1fr)', gap: 2, padding: 8, backgroundColor: '#f9fafb' }}>
          {Array.from({ length: 56 }).map((_, i) => {
            let color = '#e5e7eb'; // default empty
            if (i > 30 && i < 40) color = '#f87171'; // red for very busy
            else if (i % 3 === 0 || i % 7 === 0) color = '#10b981'; // green for booked
            else if (i > 45) color = '#1f2937'; // dark for night
            
            return (
              <div key={i} style={{ 
                backgroundColor: color,
                borderRadius: 2
              }} />
            );
          })}
        </div>
      </div>
      
      {/* FAB Button at bottom right */}
      <div style={{ position: 'relative' }}>
        <Button type="primary" shape="circle" icon={<PlusOutlined />} size="large" style={{ position: 'absolute', right: -16, top: -20, width: 48, height: 48, backgroundColor: '#00a67d', boxShadow: '0 4px 10px rgba(0,166,125,0.4)' }} onClick={onOpenAddModal}/>
      </div>
    </Card>
  );
};
