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
            className="rounded-2xl border border-slate-200 shadow-sm"
            bodyStyle={{ padding: 28 }}
        >
            <div className="flex justify-between items-start mb-6">
                <div>
                    <Text className="text-slate-400 text-[13px] block">Doanh thu ca thành công trong tuần · Doanh thu thực tế (gồm cả phí phạt hủy ca) xem tại thẻ phía trên</Text>
                    <Text className="text-slate-400 text-[13px] block">Ước tính theo lịch đặt sân hiện tại · 7 ngày qua</Text>
                </div>
                <div className="flex gap-2">
                    <div className="flex items-center gap-1.5 text-slate-400 text-xs">
                        <div className="w-2.5 h-2.5 rounded-[3px] bg-emerald-600" /> Doanh thu
                    </div>
                </div>
            </div>
            <div className="h-[260px]">
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
