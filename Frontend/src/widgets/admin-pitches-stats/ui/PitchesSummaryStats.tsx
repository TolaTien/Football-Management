import React from 'react';
import { Row, Col } from 'antd';
import { CheckOutlined, ToolOutlined, SafetyCertificateOutlined } from '@ant-design/icons';

interface PitchesSummaryStatsProps {
  activePitches: number;
  maintenancePitches: number;
  avgHealth: number; // Keep avgHealth prop name for compatibility, but we treat it as operatingIndex
}

export const PitchesSummaryStats: React.FC<PitchesSummaryStatsProps> = ({
  activePitches, maintenancePitches, avgHealth,
}) => {
  const formattedActive = activePitches < 10 ? `0${activePitches}` : activePitches;
  const formattedMaintenance = maintenancePitches < 10 ? `0${maintenancePitches}` : maintenancePitches;

  // Determine dynamic operating status based on the operating index percentage (avgHealth)
  let statusText = 'Cần chú ý';
  let textColor = 'text-amber-600';
  let dotBg = 'bg-amber-500';

  if (avgHealth === 100) {
    statusText = 'Hoàn hảo';
    textColor = 'text-emerald-600';
    dotBg = 'bg-emerald-500';
  } else if (avgHealth >= 80) {
    statusText = 'Hoạt động tốt';
    textColor = 'text-blue-600';
    dotBg = 'bg-blue-500';
  }

  return (
    <Row gutter={[24, 24]} className="mb-8">
      {/* CARD 1: TỔNG SỐ SÂN */}
      <Col xs={24} md={8}>
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between h-[150px]">
          {/* Watermark Tick */}
          <div className="absolute right-4 bottom-2 opacity-5 pointer-events-none select-none text-[80px] font-bold text-emerald-600">
            ✓
          </div>
          
          <div className="flex justify-between items-start">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl">
              <CheckOutlined />
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
              100% Hoạt động
            </span>
          </div>
          
          <div className="mt-4">
            <div className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">TỔNG SỐ SÂN</div>
            <div className="text-2xl font-extrabold text-slate-800">
              {formattedActive} <span className="text-sm font-semibold text-slate-500">Sân sẵn sàng</span>
            </div>
          </div>
        </div>
      </Col>

      {/* CARD 2: ĐANG BẢO TRÌ */}
      <Col xs={24} md={8}>
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between h-[150px]">
          <div className="flex justify-between items-start">
            <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center text-xl">
              <ToolOutlined />
            </div>
            <span className="text-xs font-bold text-slate-400 bg-slate-50 px-2.5 py-1 rounded-full">
              Không có sự cố
            </span>
          </div>

          <div className="mt-4">
            <div className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">ĐANG BẢO TRÌ</div>
            <div className="text-2xl font-extrabold text-slate-800">
              {formattedMaintenance} <span className="text-sm font-semibold text-slate-500">Sân</span>
            </div>
          </div>
        </div>
      </Col>

      {/* CARD 3: CHỈ SỐ VẬN HÀNH */}
      <Col xs={24} md={8}>
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between h-[150px]">
          <div className="flex justify-between items-start">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl">
              <SafetyCertificateOutlined />
            </div>
            <span className={`text-xs font-bold ${textColor} flex items-center gap-1`}>
              <span className={`w-1.5 h-1.5 rounded-full ${dotBg}`}></span> {statusText}
            </span>
          </div>

          <div className="mt-4">
            <div className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">CHỈ SỐ VẬN HÀNH</div>
            <div className="text-2xl font-extrabold text-slate-800">
              {avgHealth} <span className="text-sm font-semibold text-slate-500">%</span>
            </div>
          </div>
        </div>
      </Col>
    </Row>
  );
};
