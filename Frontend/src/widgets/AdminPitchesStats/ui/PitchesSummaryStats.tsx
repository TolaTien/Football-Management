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
    <Row gutter={[20, 20]} className="mb-6">
      <Col xs={24} lg={8}>
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-2xl p-5.5 text-white shadow-lg shadow-emerald-500/20 relative overflow-hidden">
          <div className="absolute -right-4 -bottom-4 w-20 h-20 rounded-full bg-white/10" />
          <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center text-xl mb-4">
            <CheckCircleOutlined className="text-white" />
          </div>
          <div className="text-white/80 text-[10px] font-bold uppercase tracking-wider mb-1.5">Sẵn sàng hoạt động</div>
          <div className="text-3xl font-extrabold text-white">
            {activePitches} <span className="text-base font-medium opacity-80">sân</span>
          </div>
        </div>
      </Col>
      <Col xs={24} lg={8}>
        <div className="bg-white rounded-2xl p-5.5 border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="absolute -right-4 -bottom-4 w-20 h-20 rounded-full bg-slate-50" />
          <div className="w-11 h-11 rounded-xl bg-red-100 text-red-600 flex items-center justify-center text-xl mb-4">
            <ToolOutlined />
          </div>
          <div className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1.5">Đang bảo trì</div>
          <div className="text-3xl font-extrabold text-red-600">
            {maintenancePitches} <span className="text-base font-medium text-slate-400">sân</span>
          </div>
        </div>
      </Col>
      <Col xs={24} lg={8}>
        <div className="bg-white rounded-2xl p-5.5 border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="absolute -right-4 -bottom-4 w-20 h-20 rounded-full bg-slate-50" />
          <div className="w-11 h-11 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center text-xl mb-4">
            🌱
          </div>
          <div className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1.5">Sức khỏe mặt cỏ</div>
          <div className="text-3xl font-extrabold text-emerald-600">
            {healthLabel} <span className="text-base font-semibold text-emerald-500/80">({avgHealth}%)</span>
          </div>
        </div>
      </Col>
    </Row>
  );
};
