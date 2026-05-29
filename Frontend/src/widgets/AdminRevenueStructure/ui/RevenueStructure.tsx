import React from 'react';
import { Card, Typography } from 'antd';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

const { Text } = Typography;

interface RevenueStructureProps {
  data: Array<{ name: string; value: number }>;
  totalRevenue: number;
}

const COLORS = ['#059669', '#38bdf8', '#fbbf24'];
const VIETNAMESE_DONG_TO_MILLION = 1_000_000;

const formatValue = (val: number) => {
  if (val >= 1_000_000) {
    return `${(val / 1_000_000).toFixed(2)}M`;
  }
  if (val >= 1_000) {
    return `${(val / 1_000).toFixed(0)}K`;
  }
  return `${val}`;
};

export const RevenueStructure: React.FC<RevenueStructureProps> = ({ data, totalRevenue }) => {
  return (
    <Card
      bordered={false}
      className="rounded-2xl border border-slate-200 h-full shadow-sm"
      bodyStyle={{ padding: 24 }}
    >
      <div className="mb-5">
        <div className="font-bold text-base text-slate-800">Cơ cấu doanh thu</div>
        <Text className="text-slate-400 text-xs">Phân tích theo nguồn thu thực tế từ database</Text>
      </div>
      <div className="h-[220px]">
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
            <Tooltip formatter={(value) => `${Number(value).toLocaleString()}đ`} contentStyle={{ borderRadius: 10, border: 'none', fontSize: 12 }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      {/* Center label */}
      <div className="text-center -mt-2 mb-4">
        <div className="text-2xl font-extrabold text-emerald-600">
          {(totalRevenue / VIETNAMESE_DONG_TO_MILLION).toFixed(2)}M đ
        </div>
        <div className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Tổng doanh thu</div>
      </div>
      <div className="flex flex-col gap-2">
        {data.map((item, i) => (
          <div key={item.name} className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
            <span className="text-slate-500 text-xs flex-1">{item.name}</span>
            <span className="font-bold text-slate-800 text-xs">{formatValue(item.value)}</span>
          </div>
        ))}
      </div>
    </Card>
  );
};
