import React from 'react';
import { Card, Typography } from 'antd';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

const { Text } = Typography;

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, value }: any) => {
    if (value === 0) return null;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return (
        <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={700}>
            {`${value}%`}
        </text>
    );
};

interface HourlyDistributionProps {
    bookings?: any[];
    pitches?: any[];
}

export const HourlyDistribution: React.FC<HourlyDistributionProps> = ({
    bookings = [],
    pitches = []
}) => {
    // 1. Chỉ tính các đơn đặt sân được duyệt (thành công)
    const approvedBookings = bookings.filter(b => b.status === 'approved');
    const totalApproved = approvedBookings.length;

    // 2. Thống kê số lượng lượt đặt của từng sân hiện có
    const pitchCounts = pitches.map(p => {
        const count = approvedBookings.filter(b => b.pitchId === p.id).length;
        return {
            id: p.id,
            name: p.name,
            count
        };
    });

    // 3. Phối màu hiện đại
    const COLORS = ['#059669', '#3b82f6', '#f59e0b', '#8b5cf6', '#ec4899', '#14b8a6', '#f43f5e'];

    // 4. Tạo dữ liệu Pie Chart
    const rawData = pitchCounts.map((pc, idx) => {
        const percent = totalApproved > 0 ? (pc.count / totalApproved) * 100 : (100 / (pitches.length || 1));
        return {
            name: pc.name,
            value: Math.round(percent),
            color: COLORS[idx % COLORS.length],
            count: pc.count
        };
    });

    // Cân đối làm tròn để đảm bảo tổng phần trăm luôn là 100% nếu có dữ liệu
    const sumPercent = rawData.reduce((sum, item) => sum + item.value, 0);
    if (totalApproved > 0 && sumPercent !== 100 && rawData.length > 0) {
        const maxValItem = [...rawData].sort((a, b) => b.value - a.value)[0];
        const found = rawData.find(item => item.name === maxValItem.name);
        if (found) {
            found.value += (100 - sumPercent);
        }
    }

    // Nếu không có lượt đặt nào, hiển thị 0% cho tất cả nhưng vẽ đều trên chart
    const pieData = rawData.map(item => ({
        ...item,
        displayValue: totalApproved > 0 ? item.value : 0
    }));

    return (
        <Card
            bordered={false}
            style={{ borderRadius: 16, border: '1px solid #e2e8f0', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', height: '100%' }}
            bodyStyle={{ padding: 24 }}
        >
            <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>Hiệu suất sử dụng sân</div>
            <Text style={{ color: '#94a3b8', fontSize: 12 }}>Tỷ lệ đặt sân theo các sân trong hệ thống</Text>

            <div style={{ height: 160, marginTop: 8 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={pieData}
                            cx="50%" cy="50%"
                            innerRadius={48} outerRadius={72}
                            dataKey="value"
                            labelLine={false}
                            label={(props) => renderCustomizedLabel({ ...props, value: props.payload.displayValue })}
                            stroke="none"
                        >
                            {pieData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip 
                            formatter={(val: any, name: any, props: any) => [`${props.payload.displayValue}% (${props.payload.count} lượt)`, '']} 
                            contentStyle={{ borderRadius: 10, border: 'none', fontSize: 12 }} 
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>

            {/* Legend */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 4, maxHeight: 150, overflowY: 'auto' }}>
                {pieData.map(d => (
                    <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
                        <div style={{ width: 10, height: 10, borderRadius: 3, backgroundColor: d.color, flexShrink: 0 }} />
                        <span style={{ color: '#64748b', flex: 1, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{d.name}</span>
                        <span style={{ color: '#94a3b8', marginRight: 4 }}>({d.count} lượt)</span>
                        <span style={{ fontWeight: 700, color: '#0f172a' }}>{d.displayValue}%</span>
                    </div>
                ))}
            </div>
        </Card>
    );
};
