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
    <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
      {items.map(({ icon, bg, iconColor, label, value, valColor }) => (
        <Col xs={24} sm={12} lg={6} key={label}>
          <Card bordered={false} bodyStyle={{ padding: 20, display: 'flex', alignItems: 'center', gap: 16 }}
            style={{ borderRadius: 12, border: '1px solid #e5e7eb' }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: bg, color: iconColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>
              {icon}
            </div>
            <div>
              <div style={{ color: '#4b5563', fontSize: 12, fontWeight: 600 }}>{label}</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: valColor }}>{value}</div>
            </div>
          </Card>
        </Col>
      ))}
    </Row>
  );
};
