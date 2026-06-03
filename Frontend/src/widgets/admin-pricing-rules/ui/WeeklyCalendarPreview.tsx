import React from 'react';
import { Card, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

interface WeeklyCalendarPreviewProps {
  onOpenAddModal: () => void;
}

export const WeeklyCalendarPreview: React.FC<WeeklyCalendarPreviewProps> = ({ onOpenAddModal }) => {
  return (
    <Card
      bordered={false}
      className="mt-6 rounded-xl shadow-sm border border-slate-100"
      bodyStyle={{ padding: 24 }}
    >
      <div className="flex justify-between items-center mb-6">
        <div className="text-lg font-bold m-0 flex items-center gap-2">
          <div className="text-[#00a67d]">📅</div> Xem trước lịch tuần
        </div>
        <div className="flex gap-4 text-[13px] text-slate-600 font-semibold">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#10b981]" /> Đã đặt
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-200" /> Còn trống
          </div>
        </div>
      </div>

      <div className="flex h-[120px] border border-slate-200 rounded-lg overflow-hidden">
        <div className="w-[60px] border-r border-slate-200 flex flex-col justify-between py-2.5 text-[10px] text-slate-400 text-center font-semibold">
          <div>06:00</div>
          <div>12:00</div>
          <div>18:00</div>
          <div>00:00</div>
        </div>
        <div className="flex-1 grid grid-cols-[repeat(14,_1fr)] grid-rows-[repeat(4,_1fr)] gap-0.5 p-2 bg-slate-50">
          {Array.from({ length: 56 }).map((_, i) => {
            let color = '#e5e7eb'; // default empty
            if (i > 30 && i < 40) color = '#f87171'; // red for very busy
            else if (i % 3 === 0 || i % 7 === 0) color = '#10b981'; // green for booked
            else if (i > 45) color = '#1f2937'; // dark for night

            return (
              <div
                key={i}
                className="rounded-[2px]"
                style={{ backgroundColor: color }}
              />
            );
          })}
        </div>
      </div>

      {/* FAB Button at bottom right */}
      <div className="relative">
        <Button
          type="primary"
          shape="circle"
          icon={<PlusOutlined />}
          size="large"
          className="absolute -right-4 -top-5 w-12 h-12 bg-[#00a67d] border-[#00a67d] hover:bg-[#008f6b] hover:border-[#008f6b] shadow-lg shadow-emerald-500/40"
          onClick={onOpenAddModal}
        />
      </div>
    </Card>
  );
};
