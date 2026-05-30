import React from 'react';
import { Card, Typography } from 'antd';
import { ResponsiveContainer, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';

const { Text } = Typography;

interface RevenueChartProps {
    data: Array<{ name: string; amount: number }>;
}

export const RevenueChart: React.FC<RevenueChartProps> = ({ data }) => {
    return (
        <Card
            bordered={false}
            style={{ borderRadius: 16, border: '1px solid #e2e8f0', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
            bodyStyle={{ padding: 28 }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
                <div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>Phân tích doanh thu AI</div>
                    <Text style={{ color: '#94a3b8', fontSize: 13 }}>Ước tính theo lịch đặt sân hiện tại · 7 ngày qua</Text>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#94a3b8', fontSize: 12 }}>
                        <div style={{ width: 10, height: 10, borderRadius: 3, backgroundColor: '#059669' }} /> Doanh thu
                    </div>
                </div>
            </div>
            <div style={{ height: 260 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }}
                            tickFormatter={(val) => `${(val / 1000).toFixed(0)}k`}
                        />
                        <Tooltip
                            formatter={(val: any) => [`${Number(val).toLocaleString()}đ`, 'Doanh thu']}
                            contentStyle={{ borderRadius: 10, border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.12)', fontSize: 13 }}
                        />
                        <Bar dataKey="amount" fill="url(#greenGradient)" radius={[6, 6, 0, 0]} />
                        <defs>
                            <linearGradient id="greenGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#059669" />
                                <stop offset="100%" stopColor="#34d399" />
                            </linearGradient>
                        </defs>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </Card>
    );
};
