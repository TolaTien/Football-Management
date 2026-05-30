import React from 'react';
import { Card, Typography } from 'antd';
import { CheckCircleOutlined, RightOutlined } from '@ant-design/icons';
import type { Pitch } from '@/entities/pitch/model/types';

const { Text } = Typography;

interface PitchSelectorProps {
  pitches: Pitch[];
  activePitch: string;
  onSelectPitch: (id: string) => void;
}

export const PitchSelector: React.FC<PitchSelectorProps> = ({
  pitches, activePitch, onSelectPitch,
}) => {
  return (
    <>
      <Card bordered={false} bodyStyle={{ padding: 24, borderRadius: 12, boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
        <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ color: '#00a67d' }}>⚽</div> Chọn sân
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {pitches.map(p => (
            <div 
              key={p.id}
              onClick={() => onSelectPitch(p.id)}
              style={{
                padding: '16px 20px',
                borderRadius: 12,
                border: activePitch === p.id ? '2px solid #00a67d' : '1px solid #f3f4f6',
                backgroundColor: activePitch === p.id ? '#ecfdf5' : '#ffffff',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                transition: 'all 0.2s'
              }}
            >
              <div>
                <div style={{ fontWeight: 700, color: '#1f2937', fontSize: 15, marginBottom: 4 }}>{p.name}</div>
                <div style={{ color: '#6b7280', fontSize: 13 }}>{p.desc}</div>
              </div>
              {activePitch === p.id ? <CheckCircleOutlined style={{ color: '#00a67d', fontSize: 20 }} /> : <RightOutlined style={{ color: '#9ca3af' }} />}
            </div>
          ))}
        </div>

        <div style={{ marginTop: 24, padding: '16px 20px', backgroundColor: '#f9fafb', borderRadius: 12, border: '1px solid #e5e7eb' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ fontWeight: 600, color: '#6b7280', fontSize: 12 }}>TÌNH TRẠNG SÂN</Text>
            <div style={{ padding: '4px 12px', backgroundColor: '#d1fae5', color: '#059669', borderRadius: 16, fontWeight: 800, fontSize: 12 }}>
              RẤT TỐT
            </div>
          </div>
          <div style={{ width: '100%', height: 4, backgroundColor: '#e5e7eb', borderRadius: 2, marginTop: 12 }}>
            <div style={{ width: '85%', height: '100%', backgroundColor: '#059669', borderRadius: 2 }}></div>
          </div>
        </div>
      </Card>

      <Card bordered={false} style={{ marginTop: 24, backgroundColor: '#1e293b', border: 'none', borderRadius: 12 }} bodyStyle={{ padding: 24 }}>
        <div style={{ color: '#f8fafc', fontSize: 18, fontWeight: 700, marginBottom: 4 }}>Phân tích doanh thu</div>
        <div style={{ color: '#94a3b8', fontSize: 14, marginBottom: 24 }}>30 ngày qua cho {pitches.find(p=>p.id === activePitch)?.name}</div>
        
        <div style={{ color: '#ffffff', fontSize: 36, fontWeight: 800, marginBottom: 8 }}>48.2M VNĐ</div>
        <div style={{ color: '#34d399', fontSize: 14, fontWeight: 600 }}>↗ +12.4% so với tháng trước</div>
      </Card>
    </>
  );
};
