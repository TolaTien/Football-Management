import React from 'react';
import { Row, Col, Card } from 'antd';

interface StatItem {
  icon: React.ReactNode;
  bg: string;
  iconColor: string;
  label: string;
  value: string;
  valColor: string;
}

interface ScheduleStatsProps {
  items: StatItem[];
}

export const ScheduleStats: React.FC<ScheduleStatsProps> = ({ items }) => {
  return (
    <Row gutter={[24, 24]} className="mt-6">
      {items.map(({ icon, bg, iconColor, label, value, valColor }) => (
        <Col xs={24} sm={12} lg={6} key={label}>
          <Card 
            bordered={false} 
            bodyStyle={{ padding: 20 }}
            className="rounded-2xl border border-slate-200 shadow-sm transition-all duration-200 hover:shadow-md"
          >
            <div className="flex items-center gap-4">
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center text-xl flex-shrink-0"
                style={{ backgroundColor: bg, color: iconColor }}
              >
                {icon}
              </div>
              <div>
                <div className="text-slate-400 text-xs font-semibold">{label}</div>
                <div className="text-xl font-extrabold" style={{ color: valColor }}>{value}</div>
              </div>
            </div>
          </Card>
        </Col>
      ))}
    </Row>
  );
};
