import React from 'react';
import { Card, Typography } from 'antd';
import { CheckCircleOutlined, RightOutlined } from '@ant-design/icons';
import type { Pitch } from '@/entities/pitch';


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
      <Card
        bordered={false}
        className="rounded-xl shadow-sm border border-slate-100"
        bodyStyle={{ padding: 24 }}
      >
        <div className="text-lg font-bold mb-4 flex items-center gap-2">
          <div className="text-[#00a67d]">⚽</div> Chọn sân
        </div>

        <div className="flex flex-col gap-3">
          {pitches.map(p => (
            <div
              key={p.id}
              onClick={() => onSelectPitch(p.id)}
              className={`py-4 px-5 rounded-xl cursor-pointer flex justify-between items-center transition-all duration-200 border ${activePitch === p.id ? 'border-[#00a67d] bg-[#ecfdf5] border-2' : 'border-slate-100 bg-white'
                }`}
            >
              <div>
                <div className="font-bold text-slate-800 text-[15px] mb-1">{p.name}</div>
                <div className="text-slate-500 text-[13px]">{p.desc}</div>
              </div>
              {activePitch === p.id ? (
                <CheckCircleOutlined className="text-[#00a67d] text-xl" />
              ) : (
                <RightOutlined className="text-slate-400" />
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 py-4 px-5 bg-slate-50 rounded-xl border border-slate-200">
          <div className="flex justify-between items-center">
            <Text className="font-semibold text-slate-500 text-xs">TÌNH TRẠNG SÂN</Text>
            <div className="py-1 px-3 bg-emerald-100 text-emerald-600 rounded-full font-extrabold text-xs">
              RẤT TỐT
            </div>
          </div>
          <div className="w-full h-1 bg-slate-200 rounded-sm mt-3">
            <div className="w-[85%] h-full bg-emerald-600 rounded-sm"></div>
          </div>
        </div>
      </Card>

      <Card
        bordered={false}
        className="mt-6 bg-slate-800 border-none rounded-xl"
        bodyStyle={{ padding: 24 }}
      >
        <div className="text-slate-50 text-lg font-bold mb-1">Phân tích doanh thu</div>
        <div className="text-slate-400 text-sm mb-6">30 ngày qua cho {pitches.find(p => p.id === activePitch)?.name}</div>

        <div className="text-white text-4xl font-extrabold mb-2">48.2M VNĐ</div>
        <div className="text-emerald-400 text-sm font-semibold">↗ +12.4% so với tháng trước</div>
      </Card>
    </>
  );
};
