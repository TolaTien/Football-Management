import React from 'react';
import { ArrowUpOutlined } from '@ant-design/icons';

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
  icon, label, value, trend, color, bg, gradient,
}) => (
  <div
    style={{
      background: gradient || 'white',
      borderRadius: 16,
      padding: '20px 22px',
      border: gradient ? 'none' : '1px solid #e2e8f0',
      boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
      position: 'relative',
      overflow: 'hidden',
      transition: 'transform 0.2s, box-shadow 0.2s',
    }}
    className="admin-stat-card"
  >
    <div style={{
      position: 'absolute',
      right: -12,
      bottom: -12,
      width: 80,
      height: 80,
      borderRadius: '50%',
      backgroundColor: gradient ? 'rgba(255,255,255,0.08)' : `${color}12`,
    }} />
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
      <div style={{
        width: 40,
        height: 40,
        borderRadius: 10,
        background: gradient ? 'rgba(255,255,255,0.2)' : bg,
        color: gradient ? '#fff' : color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 18,
      }}>
        {icon}
      </div>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 3,
        color: gradient ? '#a7f3d0' : (trend.startsWith('+') ? '#059669' : '#dc2626'),
        background: gradient ? 'rgba(255,255,255,0.15)' : (trend.startsWith('+') ? '#dcfce7' : '#fee2e2'),
        padding: '3px 8px',
        borderRadius: 8,
        fontWeight: 700,
        fontSize: 11,
      }}>
        {trend.startsWith('+') ? <ArrowUpOutlined /> : null}
        {trend}
      </div>
    </div>
    <div style={{ color: gradient ? 'rgba(255,255,255,0.75)' : '#64748b', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>
      {label}
    </div>
    <div style={{ fontSize: 24, fontWeight: 800, color: gradient ? '#fff' : '#0f172a' }}>
      {value}
    </div>
  </div>
);
