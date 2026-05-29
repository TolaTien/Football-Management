import React from 'react';
import { Card, Tag, Space, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined, SettingOutlined } from '@ant-design/icons';
import type { Pitch } from '@/entities/pitch/model/types';

interface PitchCardProps {
  pitch: Pitch;
  onEdit: (pitch: Pitch) => void;
  onDelete: (id: string) => void;
  onConfigurePrice?: (pitch: Pitch) => void;
}

const getGradient = (category?: number): string => {
  if (category === 5) return 'from-emerald-500 to-emerald-700';
  if (category === 7) return 'from-blue-600 to-blue-800';
  return 'from-purple-600 to-purple-800';
};

export const PitchCard: React.FC<PitchCardProps> = ({ pitch, onEdit, onDelete, onConfigurePrice }) => {
  return (
    <Card
      hoverable
      bordered={false}
      bodyStyle={{ padding: 0 }}
      className="rounded-2xl overflow-hidden shadow-md flex flex-col h-full hover:shadow-lg transition-all duration-200"
    >
      <div className={`relative h-40 bg-gradient-to-br ${getGradient(pitch.pitchCategory)} flex items-center justify-center`}>
        <div className="text-6xl opacity-85 select-none">⚽</div>
        <div className="absolute top-2 right-2 bg-white/20 backdrop-blur-sm rounded-lg px-2.5 py-0.5 text-white text-xs font-bold">
          Sân {pitch.pitchCategory ?? '?'} người
        </div>
        <div className="absolute top-3 left-3">
          <Tag 
            color={pitch.status === 'active' ? '#10b981' : pitch.status === 'maintenance' ? '#6b7280' : '#f59e0b'} 
            className="rounded-full px-3 py-0.5 font-semibold border-none text-white shadow-sm"
          >
            {pitch.status === 'active' ? 'Sẵn sàng' : pitch.status === 'maintenance' ? '🛠 Đang bảo trì' : '🚧 Đang thi công'}
          </Tag>
        </div>
      </div>
      <div className="p-5 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-1">
          <div className="text-lg font-extrabold text-slate-800">{pitch.name}</div>
          <Space className="text-slate-450 gap-2.5">
            {onConfigurePrice && (
              <SettingOutlined className="cursor-pointer hover:text-emerald-600 transition-colors" onClick={() => onConfigurePrice(pitch)} />
            )}
            <EditOutlined className="cursor-pointer hover:text-blue-600 transition-colors" onClick={() => onEdit(pitch)} />
            <Popconfirm title="Bạn có chắc chắn muốn xóa sân này?" onConfirm={() => onDelete(pitch.id)} okText="Xóa" cancelText="Hủy">
              <DeleteOutlined className="cursor-pointer text-red-500 hover:text-red-700 transition-colors" />
            </Popconfirm>
          </Space>
        </div>
        <div className="text-slate-500 text-xs mb-4 flex-1">{pitch.desc}</div>

        <div className="flex justify-between pb-3 border-b border-dashed border-slate-100 mb-3 text-xs">
          <div className="text-slate-500 flex items-center gap-1.5">
            🌱 Tình trạng cỏ:
          </div>
          <div className={`font-bold ${pitch.grassHealth > 80 ? 'text-emerald-600' : pitch.grassHealth > 40 ? 'text-amber-600' : 'text-slate-400'}`}>
            {pitch.grassStatus}
          </div>
        </div>

        <div className="flex justify-between text-xs">
          <div className="text-slate-500 flex items-center gap-1.5">
            📅 {pitch.status === 'constructing' ? 'Ngày hoàn tất:' : 'Lịch bảo trì:'}
          </div>
          <div className={`font-bold ${pitch.status === 'maintenance' ? 'text-red-500' : 'text-slate-700'}`}>
            {pitch.nextMaintenance}
          </div>
        </div>
      </div>
    </Card>
  );
};
