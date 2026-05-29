import React from 'react';
import { Row, Col } from 'antd';
import { CheckCircleOutlined, ToolOutlined } from '@ant-design/icons';

interface PitchesSummaryStatsProps {
  activePitches: number;
  maintenancePitches: number;
  avgHealth: number;
}

export const PitchesSummaryStats: React.FC<PitchesSummaryStatsProps> = ({
  activePitches, maintenancePitches, avgHealth,
}) => {
  const healthLabel = avgHealth > 80 ? 'Tốt' : avgHealth > 40 ? 'Trung bình' : 'Kém';

  return (
    <Row gutter={[20, 20]} style={{ marginBottom: 24 }}>
      <Col xs={24} lg={8}>
        <div style={{ background: 'linear-gradient(135deg, #059669 0%, #047857 100%)', borderRadius: 16, padding: '22px 24px', color: 'white', boxShadow: '0 4px 20px rgba(5,150,105,0.25)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', right: -16, bottom: -16, width: 90, height: 90, borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.08)' }} />
          <div style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, marginBottom: 16 }}>
            <CheckCircleOutlined style={{ color: '#fff' }} />
          </div>
          <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Sẵn sàng hoạt động</div>
          <div style={{ fontSize: 32, fontWeight: 800, color: '#fff' }}>{activePitches} <span style={{ fontSize: 16, fontWeight: 500, opacity: 0.8 }}>sân</span></div>
        </div>
      </Col>
      <Col xs={24} lg={8}>
        <div style={{ background: 'white', borderRadius: 16, padding: '22px 24px', border: '1px solid #e2e8f0', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', right: -16, bottom: -16, width: 90, height: 90, borderRadius: '50%', backgroundColor: '#fee2e208' }} />
          <div style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: '#fee2e2', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, marginBottom: 16 }}>
            <ToolOutlined />
          </div>
          <div style={{ color: '#64748b', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Đang bảo trì</div>
          <div style={{ fontSize: 32, fontWeight: 800, color: '#dc2626' }}>{maintenancePitches} <span style={{ fontSize: 16, fontWeight: 500, color: '#94a3b8' }}>sân</span></div>
        </div>
      </Col>
      <Col xs={24} lg={8}>
        <div style={{ background: 'white', borderRadius: 16, padding: '22px 24px', border: '1px solid #e2e8f0', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', right: -16, bottom: -16, width: 90, height: 90, borderRadius: '50%', backgroundColor: '#e0e7ff18' }} />
          <div style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: '#e0e7ff', color: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, marginBottom: 16 }}>
            🌱
          </div>
          <div style={{ color: '#64748b', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Sức khỏe mặt cỏ</div>
          <div style={{ fontSize: 32, fontWeight: 800, color: '#059669' }}>{healthLabel} <span style={{ fontSize: 16, fontWeight: 700, color: '#059669' }}>({avgHealth}%)</span></div>
        </div>
      </Col>
    </Row>
  );
};
