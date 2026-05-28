import React from 'react';
import { Card, Typography } from 'antd';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const { Text } = Typography;

interface RevenueTrendProps {
  data: Array<{ day: string; revenue: number }>;
}

export const RevenueTrend: React.FC<RevenueTrendProps> = ({ data }) => {
  return (
    <Card
      bordered={false}
      style={{ borderRadius: 16, border: '1px solid #e2e8f0', marginBottom: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
      bodyStyle={{ padding: 24 }}
    >
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontWeight: 700, fontSize: 15, color: '#0f172a' }}>Xu hướng doanh thu 7 ngày</div>
        <Text style={{ color: '#94a3b8', fontSize: 12 }}>Biến động doanh thu theo từng ngày trong tuần</Text>
      </div>
      <div style={{ height: 160 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="areaGreen" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#059669" stopOpacity={0.2} />
                <stop offset="100%" stopColor="#059669" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} tickFormatter={v => `${(v / 1e6).toFixed(0)}M`} />
            <Tooltip formatter={(val: any) => [`${Number(val).toLocaleString()}đ`, 'Doanh thu']} contentStyle={{ borderRadius: 10, border: 'none', fontSize: 12 }} />
            <Area type="monotone" dataKey="revenue" stroke="#059669" strokeWidth={2.5} fill="url(#areaGreen)" dot={{ fill: '#059669', strokeWidth: 0, r: 4 }} activeDot={{ r: 6 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
