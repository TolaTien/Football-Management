import React from 'react';
import { Card, Typography } from 'antd';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

const { Text } = Typography;

interface RevenueStructureProps {
  data: Array<{ name: string; value: number }>;
  totalRevenue: number;
}

const COLORS = ['#059669', '#34d399', '#fbbf24', '#f87171'];
const VIETNAMESE_DONG_TO_MILLION = 1000000;

export const RevenueStructure: React.FC<RevenueStructureProps> = ({ data, totalRevenue }) => {
  return (
    <Card
      bordered={false}
      style={{ borderRadius: 16, border: '1px solid #e2e8f0', height: '100%', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
      bodyStyle={{ padding: 24 }}
    >
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontWeight: 700, fontSize: 15, color: '#0f172a' }}>Cơ cấu doanh thu</div>
        <Text style={{ color: '#94a3b8', fontSize: 12 }}>Phân tích theo nguồn thu tháng này</Text>
      </div>
      <div style={{ height: 220 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%" cy="50%"
              innerRadius={55} outerRadius={80}
              paddingAngle={4} dataKey="value"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value: any) => `${Number(value).toLocaleString()}đ`} contentStyle={{ borderRadius: 10, border: 'none', fontSize: 12 }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      {/* Center label */}
      <div style={{ textAlign: 'center', marginTop: -8, marginBottom: 16 }}>
        <div style={{ fontSize: 22, fontWeight: 800, color: '#059669' }}>
          {(totalRevenue / VIETNAMESE_DONG_TO_MILLION).toFixed(1)}M đ
        </div>
        <div style={{ color: '#94a3b8', fontSize: 11, fontWeight: 600 }}>Tổng doanh thu</div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {data.map((item, i) => (
          <div key={item.name} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 10, height: 10, borderRadius: 3, backgroundColor: COLORS[i], flexShrink: 0 }} />
            <span style={{ color: '#64748b', fontSize: 12, flex: 1 }}>{item.name}</span>
            <span style={{ fontWeight: 700, color: '#0f172a', fontSize: 12 }}>{(item.value / VIETNAMESE_DONG_TO_MILLION).toFixed(1)}M</span>
          </div>
        ))}
      </div>
    </Card>
  );
};
