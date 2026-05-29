import React from 'react';
import { Card, Typography } from 'antd';
import { RobotOutlined } from '@ant-design/icons';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

const { Text } = Typography;

const pieData = [
    { name: 'Giờ cao điểm', value: 60, color: '#00a67d' },
    { name: 'Giờ sáng', value: 20, color: '#f87171' },
    { name: 'Giờ đêm', value: 20, color: '#bfdbfe' },
];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return (
        <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={700}>
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    );
};

interface HourlyDistributionProps {
    insight: string;
}

export const HourlyDistribution: React.FC<HourlyDistributionProps> = ({ insight }) => {
    return (
        <Card
            bordered={false}
            style={{ borderRadius: 16, border: '1px solid #e2e8f0', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', height: '100%' }}
            bodyStyle={{ padding: 24 }}
        >

            {/* AI Box */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-violet-50 to-violet-100 border border-violet-200 mb-6">
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-7 h-7 rounded-lg bg-violet-600 flex items-center justify-center">
                        <RobotOutlined className="text-white text-sm" />
                    </div>
                    <span className="font-bold text-violet-800 text-xs uppercase tracking-wider">AI Insights</span>
                </div>
                <div className="text-violet-900 text-sm leading-relaxed">{insight}</div>
            </div>



            <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>Khung giờ phổ biến</div>
            <Text style={{ color: '#94a3b8', fontSize: 12 }}>Phân bổ loại giờ đặt sân</Text>

            <div style={{ height: 160, marginTop: 8 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={pieData}
                            cx="50%" cy="50%"
                            innerRadius={48} outerRadius={72}
                            dataKey="value"
                            labelLine={false}
                            label={renderCustomizedLabel}
                            stroke="none"
                        >
                            {pieData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip formatter={(val: any) => [`${val}%`, '']} contentStyle={{ borderRadius: 10, border: 'none', fontSize: 12 }} />
                    </PieChart>
                </ResponsiveContainer>
            </div>

            {/* Legend */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 4 }}>
                {pieData.map(d => (
                    <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
                        <div style={{ width: 10, height: 10, borderRadius: 3, backgroundColor: d.color, flexShrink: 0 }} />
                        <span style={{ color: '#64748b', flex: 1 }}>{d.name}</span>
                        <span style={{ fontWeight: 700, color: '#0f172a' }}>{d.value}%</span>
                    </div>
                ))}
            </div>
        </Card>
    );
};
