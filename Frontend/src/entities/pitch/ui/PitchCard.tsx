import React from 'react';
import { Tag, Progress, Popconfirm, Tooltip } from 'antd';
import { EditOutlined, SettingOutlined, DeleteOutlined } from '@ant-design/icons';
import type { Pitch } from '@/entities/pitch/model/types';

interface PitchCardProps {
  pitch: Pitch;
  onEdit: (pitch: Pitch) => void;
  onDelete: (id: string) => void;
  onConfigurePrice?: (pitch: Pitch) => void;
}

export const PitchCard: React.FC<PitchCardProps> = ({ pitch, onEdit, onDelete, onConfigurePrice }) => {
  // Determine grass type based on grassStatus
  const isHybrid = pitch.grassStatus.toLowerCase().includes('hybrid');
  const grassType = isHybrid ? 'Hybrid' : 'Nhân tạo';

  return (
    <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between h-[270px] relative overflow-hidden">
      
      {/* Top Section: Title & Status */}
      <div className="flex justify-between items-start mb-4">
        <div className="text-lg font-extrabold text-slate-800 tracking-tight leading-snug">
          {pitch.name} - {pitch.type.replace('Sân ', '')}
        </div>

        <Tag 
          color={pitch.status === 'active' ? '#e6f4ea' : '#fcedea'} 
          className="rounded-full px-3 py-1 font-bold border-none shadow-sm flex items-center gap-1.5"
          style={{ color: pitch.status === 'active' ? '#137333' : '#c5221f' }}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${pitch.status === 'active' ? 'bg-[#137333]' : 'bg-[#c5221f]'}`}></span>
          {pitch.status === 'active' ? 'Sẵn sàng' : 'Bảo trì'}
        </Tag>
      </div>

      {/* Grid: Grass Type & Grass Condition */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="bg-[#f0fdf4] border border-[#dcfce7] rounded-xl p-2.5 flex flex-col">
          <span className="text-[9px] font-extrabold text-slate-400 uppercase mb-1">Loại cỏ</span>
          <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
            🌱 {grassType}
          </span>
        </div>
        <div className="bg-[#eff6ff] border border-[#dbeafe] rounded-xl p-2.5 flex flex-col">
          <span className="text-[9px] font-extrabold text-slate-400 uppercase mb-1">Tình trạng</span>
          <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
            ✓ Tuyệt vời
          </span>
        </div>
      </div>

      {/* Metrics Section */}
      <div className="mb-5 flex-1 flex flex-col justify-center">
        <div className="flex justify-between items-center text-xs">
          <span className="text-slate-400 font-medium">Lần bảo trì cuối</span>
          <span className="font-bold text-slate-700">{pitch.nextMaintenance || '25/05/2026'}</span>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex items-center gap-2 pt-4 border-t border-slate-50">
        <button
          onClick={() => onEdit(pitch)}
          className="flex-1 h-11 rounded-xl bg-[#e0f2fe] text-[#0284c7] hover:bg-[#bae6fd] hover:text-[#0369a1] font-extrabold text-xs transition-colors duration-150 flex items-center justify-center gap-1.5 border-none cursor-pointer"
        >
          <EditOutlined className="text-sm" /> Cập nhật
        </button>

        {onConfigurePrice && (
          <Tooltip title="Cấu hình bảng giá">
            <button
              onClick={() => onConfigurePrice(pitch)}
              className="w-11 h-11 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-500 border border-slate-200 transition-colors flex items-center justify-center cursor-pointer"
            >
              <SettingOutlined className="text-base" />
            </button>
          </Tooltip>
        )}

        <Popconfirm 
          title="Bạn có chắc chắn muốn xóa sân này?" 
          onConfirm={() => onDelete(pitch.id)} 
          okText="Xóa" 
          cancelText="Hủy"
        >
          <Tooltip title="Xóa sân bóng">
            <button
              className="w-11 h-11 rounded-xl bg-red-50 hover:bg-red-100 text-red-500 border border-red-100 transition-colors flex items-center justify-center cursor-pointer"
            >
              <DeleteOutlined className="text-base" />
            </button>
          </Tooltip>
        </Popconfirm>
      </div>

    </div>
  );
};
