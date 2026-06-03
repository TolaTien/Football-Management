import React from 'react';
import { Card, Button, Space, InputNumber, Popconfirm } from 'antd';
import { FilterOutlined, PlusOutlined, SaveOutlined, EditOutlined, DeleteOutlined, BulbFilled } from '@ant-design/icons';
import type { PriceRule } from '@/entities/pitch/model/types';

interface PricingRulesListProps {
  prices: PriceRule[];
  editingPrice: { id: string; val: number } | null;
  setEditingPrice: (val: { id: string; val: number } | null) => void;
  onSavePrice: (id: string) => void;
  onDeletePriceRule: (id: string) => void;
  onOpenAddModal: () => void;
}

export const PricingRulesList: React.FC<PricingRulesListProps> = ({
  prices, editingPrice, setEditingPrice, onSavePrice, onDeletePriceRule, onOpenAddModal,
}) => {
  return (
    <Card
      bordered={false}
      className="rounded-xl shadow-sm border border-slate-100"
      bodyStyle={{ padding: 24 }}
    >
      <div className="flex justify-between items-center mb-6">
        <div className="text-lg font-bold m-0 flex items-center gap-2">
          <div className="text-[#00a67d]">🕒</div> Quy tắc giá theo giờ
        </div>
        <Space>
          <Button icon={<FilterOutlined />} size="large" className="rounded-lg" />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            size="large"
            className="bg-slate-600 border-slate-600 hover:bg-slate-700 hover:border-slate-700 rounded-lg font-semibold text-white"
            onClick={onOpenAddModal}
          >
            Thêm khung giờ
          </Button>
        </Space>
      </div>

      {/* Header row */}
      <div className="grid grid-cols-[2fr_2fr_1.5fr_1fr] px-4 pb-4 border-b border-slate-100 text-slate-500 font-semibold text-[13px]">
        <div>Khung giờ</div>
        <div>Đơn giá (VNĐ/h)</div>
        <div>Trạng thái</div>
        <div className="text-right">Thao tác</div>
      </div>

      {/* List prices */}
      {prices.map(pr => (
        <div key={pr.id} className="grid grid-cols-[2fr_2fr_1.5fr_1fr] py-6 px-4 border-b border-slate-100 items-center">
          <div className="flex gap-4 items-center">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${pr.status === 'active' ? 'bg-sky-100 text-sky-500' : 'bg-slate-100 text-slate-400'
              }`}>
              {pr.status === 'active' ? '☀️' : '🌙'}
            </div>
            <div>
              <div className="font-bold text-slate-800 text-[15px] mb-1">{pr.timeRange}</div>
              <div className="text-slate-500 text-[13px]">{pr.type}</div>
            </div>
          </div>
          <div>
            {editingPrice?.id === pr.id ? (
              <InputNumber
                value={editingPrice.val}
                onChange={val => setEditingPrice({ id: pr.id, val: val || 0 })}
                onPressEnter={() => onSavePrice(pr.id)}
                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                className="w-[140px] rounded-lg font-semibold"
              />
            ) : (
              <div className="py-2 px-4 border border-slate-200 rounded-lg inline-block font-semibold text-slate-800">
                {pr.price.toLocaleString()} VNĐ
              </div>
            )}
          </div>
          <div>
            <div className={`inline-flex py-1 px-3 rounded-full font-bold text-xs ${pr.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
              }`}>
              {pr.status === 'active' ? 'Đang hoạt động' : 'Bảo trì'}
            </div>
          </div>
          <div className="text-right flex justify-end gap-4 text-slate-400 text-lg">
            {editingPrice?.id === pr.id ? (
              <SaveOutlined className="cursor-pointer text-emerald-600 hover:text-emerald-700" onClick={() => onSavePrice(pr.id)} />
            ) : (
              <EditOutlined className="cursor-pointer text-slate-600 hover:text-slate-700" onClick={() => setEditingPrice({ id: pr.id, val: pr.price })} />
            )}
            <Popconfirm title="Xóa khung giờ này?" onConfirm={() => onDeletePriceRule(pr.id)}>
              <DeleteOutlined className="cursor-pointer text-red-650 hover:text-red-750" />
            </Popconfirm>
          </div>
        </div>
      ))}

      {/* Alert / Info Box */}
      <div className="mt-6 p-5 bg-[#f0fdf4] rounded-xl border border-emerald-250 flex gap-4">
        <BulbFilled className="text-[#00a67d] text-2xl" />
        <div>
          <div className="text-emerald-900 font-bold mb-1 text-sm">Mẹo: Tự động phát hiện giờ cao điểm</div>
          <div className="text-emerald-700 text-[13px] leading-relaxed">
            Hệ thống nhận thấy mật độ đặt sân cao nhất diễn ra từ 18:00 đến 20:00. Cân nhắc áp dụng thêm 10% phí cho các khung giờ này để tối ưu doanh thu.
          </div>
        </div>
      </div>
    </Card>
  );
};
