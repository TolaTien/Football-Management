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
    <div style={{ display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
      {items.map((item) => (
        <div key={item.label} style={{
          flex: '1 1 160px',
          background: 'white',
          borderRadius: 14,
          padding: '16px 20px',
          border: '1px solid #e2e8f0',
          display: 'flex', alignItems: 'center', gap: 12,
          boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
        }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10,
            backgroundColor: item.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
          }}>
            {item.icon}
          </div>
          <div>
            <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{item.label}</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: item.color, lineHeight: 1.3 }}>{item.value}</div>
          </div>
        </div>
      ))}
    </div>
  );
};
