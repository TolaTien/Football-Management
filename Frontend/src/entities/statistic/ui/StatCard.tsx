import React from 'react';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';

interface StatCardProps {
    icon: React.ReactNode;
    label: string;
    value: string;
    trend?: number;
    trendLabel?: string;
    color: string;
    bg: string;
    gradient?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
    icon, label, value, trend, trendLabel, color, bg, gradient,
}) => (
    <div
        style={{
            background: gradient || 'white',
            borderRadius: 16,
            padding: '22px 24px',
            boxShadow: '0 1px 4px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.04)',
            border: gradient ? 'none' : '1px solid #e2e8f0',
            transition: 'transform 0.2s, box-shadow 0.2s',
            cursor: 'default',
            position: 'relative',
            overflow: 'hidden',
        }}
        className="admin-stat-card"
    >
        {/* Decorative circle */}
        <div style={{
            position: 'absolute',
            right: -16,
            bottom: -16,
            width: 100,
            height: 100,
            borderRadius: '50%',
            backgroundColor: gradient ? 'rgba(255,255,255,0.08)' : `${color}18`,
        }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
            <div style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: gradient ? 'rgba(255,255,255,0.2)' : bg,
                color: gradient ? '#fff' : color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 20,
            }}>
                {icon}
            </div>
            {trend !== undefined && (
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 3,
                    color: trend >= 0 ? (gradient ? '#a7f3d0' : '#059669') : (gradient ? '#fca5a5' : '#dc2626'),
                    fontWeight: 700,
                    fontSize: 12,
                    background: gradient ? 'rgba(255,255,255,0.15)' : (trend >= 0 ? '#ecfdf5' : '#fef2f2'),
                    padding: '4px 8px',
                    borderRadius: 8,
                }}>
                    {trend >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                    {Math.abs(trend)}%
                </div>
            )}
        </div>
        <div style={{ color: gradient ? 'rgba(255,255,255,0.75)' : '#64748b', fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
            {label}
        </div>
        <div style={{ fontSize: 26, fontWeight: 800, color: gradient ? '#fff' : '#0f172a', lineHeight: 1.2 }}>
            {value}
        </div>
        {trendLabel && (
            <div style={{ color: gradient ? 'rgba(255,255,255,0.6)' : '#94a3b8', fontSize: 11, marginTop: 4 }}>
                {trendLabel}
            </div>
        )}
    </div>
);
