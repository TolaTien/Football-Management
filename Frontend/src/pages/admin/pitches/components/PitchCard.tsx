import React from 'react';
import { Card, Tag, Space, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { Pitch } from '@/entities/pitch/model/types';

interface PitchCardProps {
  pitch: Pitch;
  onEdit: (pitch: Pitch) => void;
  onDelete: (id: string) => void;
}
const getGradient = (category?: number): string => {
  if (category === 5) return 'linear-gradient(135deg, #059669 0%, #047857 100%)';
  if (category === 7) return 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)';
  return 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)';
};

export const PitchCard: React.FC<PitchCardProps> = ({ pitch, onEdit, onDelete }) => {
  return (
    <Card
      hoverable
      bordered={false}
      bodyStyle={{ padding: 0 }}
      style={{ borderRadius: 16, overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column', height: '100%' }}
    >
      <div style={{ position: 'relative', height: 160, background: getGradient(pitch.pitchCategory), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontSize: 56, opacity: 0.8 }}>⚽</div>
        <div style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(255,255,255,0.25)', borderRadius: 8, padding: '2px 10px', color: '#fff', fontSize: 12, fontWeight: 700 }}>
          Sân {pitch.pitchCategory ?? '?'} người
        </div>
        <div style={{ position: 'absolute', top: 12, left: 12 }}>
          <Tag color={pitch.status === 'active' ? '#10b981' : pitch.status === 'maintenance' ? '#6b7280' : '#f59e0b'} style={{ borderRadius: 12, padding: '2px 10px', fontWeight: 600, border: 'none' }}>
            {pitch.status === 'active' ? 'Sẵn sàng' : pitch.status === 'maintenance' ? '🛠 Đang bảo trì' : '🚧 Đang thi công'}
          </Tag>
        </div>
      </div>
      <div style={{ padding: 20, display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: '#1f2937' }}>{pitch.name}</div>
          <Space style={{ color: '#9ca3af' }}>
            <EditOutlined style={{ cursor: 'pointer' }} onClick={() => onEdit(pitch)} />
            <Popconfirm title="Bạn có chắc chắn muốn xóa sân này?" onConfirm={() => onDelete(pitch.id)} okText="Xóa" cancelText="Hủy">
              <DeleteOutlined style={{ cursor: 'pointer', color: '#dc2626' }} />
            </Popconfirm>
          </Space>
        </div>
        <div style={{ color: '#6b7280', fontSize: 13, marginBottom: 16, flex: 1 }}>{pitch.desc}</div>

        <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 12, borderBottom: '1px dashed #e5e7eb', marginBottom: 12 }}>
          <div style={{ color: '#6b7280', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
            🌱 Tình trạng mặt cỏ:
          </div>
          <div style={{ fontWeight: 600, color: pitch.grassHealth > 80 ? '#059669' : pitch.grassHealth > 40 ? '#d97706' : '#9ca3af' }}>
            {pitch.grassStatus}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ color: '#6b7280', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
            📅 {pitch.status === 'constructing' ? 'Ngày hoàn tất:' : 'Lịch bảo trì:'}
          </div>
          <div style={{ fontWeight: 600, color: pitch.status === 'maintenance' ? '#dc2626' : '#1f2937' }}>
            {pitch.nextMaintenance}
          </div>
        </div>
      </div>
    </Card>
  );
};
