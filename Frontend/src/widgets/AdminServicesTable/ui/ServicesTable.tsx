import React from 'react';
import { Table, Popconfirm, Button, InputNumber } from 'antd';
import { EditOutlined, SaveOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ServiceItem } from '@/entities/service-item/model/types';

interface ServicesTableProps {
  services: ServiceItem[];
  editingStock: { id: string; val: number } | null;
  setEditingStock: (val: { id: string; val: number } | null) => void;
  onUpdateStock: (id: string, qty: number) => void;
  onDeleteService: (id: string) => void;
}

const SERVICE_ICONS: Record<string, string> = {
  drink: '🧃',
  equipment: '⚽',
  food: '🍔',
  other: '📦',
};

const STATUS_CONFIG: Record<string, { label: string; bg: string; color: string }> = {
  in_stock: { label: 'Còn hàng', bg: 'bg-emerald-50 text-emerald-700', color: 'bg-emerald-700' },
  low_stock: { label: 'Sắp hết', bg: 'bg-amber-50 text-amber-700', color: 'bg-amber-700' },
  out_of_stock: { label: 'Hết hàng', bg: 'bg-red-50 text-red-700', color: 'bg-red-700' },
};

export const ServicesTable: React.FC<ServicesTableProps> = ({
  services, editingStock, setEditingStock, onUpdateStock, onDeleteService,
}) => {
  const columns = [
    {
      title: 'Sản phẩm / Dịch vụ',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: ServiceItem) => (
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0 ${
            record.type === 'drink' ? 'bg-blue-50' : 'bg-emerald-50'
          }`}>
            {SERVICE_ICONS[record.type] || '📦'}
          </div>
          <div>
            <div className="font-bold text-slate-800 text-sm">{text}</div>
            <div className="text-[10px] text-slate-400 mt-0.5 font-medium">
              {record.type === 'drink' ? '🧃 Đồ uống' : record.type === 'equipment' ? '🏟 Trang thiết bị' : '📦 Khác'}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Đơn giá',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => (
        <div>
          <div className="font-bold text-emerald-600 text-sm">
            {price.toLocaleString()}<span className="text-[10px] text-slate-400 font-normal"> đ</span>
          </div>
          <div className="text-[10px] text-slate-350 font-medium">/ đơn vị</div>
        </div>
      ),
    },
    {
      title: 'Tồn kho',
      dataIndex: 'stock',
      key: 'stock',
      render: (stock: number, record: ServiceItem) => (
        <div className="flex items-center gap-2">
          {editingStock?.id === record.id ? (
            <>
              <InputNumber
                min={0}
                value={editingStock?.val ?? 0}
                onChange={(val) => val !== null && setEditingStock({ id: record.id, val })}
                onPressEnter={() => {
                  onUpdateStock(record.id, editingStock.val - stock);
                  setEditingStock(null);
                }}
                className="w-20 rounded-lg h-8"
                size="small"
              />
              <SaveOutlined
                className="text-emerald-600 cursor-pointer text-base p-1 hover:brightness-90"
                onClick={() => {
                  onUpdateStock(record.id, editingStock.val - stock);
                  setEditingStock(null);
                }}
              />
            </>
          ) : (
            <>
              <div className={`min-w-[40px] h-8 rounded-lg flex items-center justify-center font-extrabold text-sm px-2.5 ${
                stock === 0 ? 'bg-red-50 text-red-650' : stock < 10 ? 'bg-amber-50 text-amber-650' : 'bg-emerald-50 text-emerald-650'
              }`}>
                {stock}
              </div>
              <EditOutlined
                className="text-slate-400 cursor-pointer text-xs p-1 hover:text-emerald-600"
                onClick={() => setEditingStock({ id: record.id, val: stock })}
              />
            </>
          )}
        </div>
      ),
    },
    {
      title: 'Trạng thái',
      key: 'status',
      render: (_: unknown, record: ServiceItem) => {
        const cfg = STATUS_CONFIG[record.status] || STATUS_CONFIG.out_of_stock;
        return (
          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-bold text-[10px] ${cfg.bg}`}>
            <div className={`w-1.5 h-1.5 rounded-full ${cfg.color}`} />
            {cfg.label}
          </div>
        );
      },
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 80,
      render: (_: unknown, record: ServiceItem) => (
        <Popconfirm
          title="Xóa sản phẩm này?"
          description="Hành động này không thể hoàn tác."
          onConfirm={() => { onDeleteService(record.id); }}
          okText="Xóa"
          cancelText="Hủy"
          okButtonProps={{ danger: true }}
        >
          <Button
            danger icon={<DeleteOutlined />} type="text" size="small"
            className="rounded-lg"
          />
        </Popconfirm>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={services}
      rowKey="id"
      pagination={{ pageSize: 8, size: 'small', className: 'px-6 py-3' }}
      className="admin-table border-none"
    />
  );
};
