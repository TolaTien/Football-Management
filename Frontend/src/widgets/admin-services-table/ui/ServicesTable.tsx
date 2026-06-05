import React from 'react';
import { Table, Popconfirm, Button, InputNumber, Tooltip } from 'antd';
import { EditOutlined, SaveOutlined, DeleteOutlined, CloseOutlined, CoffeeOutlined, SkinOutlined, EllipsisOutlined } from '@ant-design/icons';
import type { ServiceItem } from '@/entities/service-item';

interface ServicesTableProps {
  services: ServiceItem[];
  editingStock: { id: string; val: number } | null;
  setEditingStock: (val: { id: string; val: number } | null) => void;
  onUpdateStock: (id: string, qty: number) => void;
  onDeleteService: (id: string) => void;
  onEditService: (record: ServiceItem) => void;
}

const TYPE_CONFIG: Record<string, { label: string; icon: React.ReactNode; bg: string; text: string; badgeBg: string }> = {
  equipment: { label: 'Trang bị', icon: <SkinOutlined />, bg: 'bg-emerald-50 text-emerald-600', text: 'text-emerald-700', badgeBg: 'bg-emerald-100' },
  other: { label: 'Khác', icon: <EllipsisOutlined />, bg: 'bg-slate-50 text-slate-600', text: 'text-slate-700', badgeBg: 'bg-slate-100' },
};


const STATUS_CONFIG: Record<string, { label: string; bg: string; color: string }> = {
  in_stock: { label: 'Còn hàng', bg: 'bg-emerald-50 text-emerald-700', color: 'bg-emerald-500' },
  low_stock: { label: 'Sắp hết', bg: 'bg-amber-50 text-amber-700', color: 'bg-amber-500' },
  out_of_stock: { label: 'Hết hàng', bg: 'bg-rose-50 text-rose-700', color: 'bg-rose-500' },
};

export const ServicesTable: React.FC<ServicesTableProps> = ({
  services, editingStock, setEditingStock, onUpdateStock, onDeleteService, onEditService,
}) => {
  const columns = [
    {
      title: 'Sản phẩm / Dịch vụ',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: ServiceItem) => {
        const typeCfg = TYPE_CONFIG[record.type] || TYPE_CONFIG.other;
        return (
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0 shadow-inner ${typeCfg.bg}`}>
              {typeCfg.icon}
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-slate-800 text-sm leading-snug">{text}</span>
              <span className={`inline-block w-max px-2 py-0.5 mt-1 rounded text-[9px] font-extrabold uppercase tracking-wider ${typeCfg.badgeBg} ${typeCfg.text}`}>
                {typeCfg.label}
              </span>
            </div>
          </div>
        );
      }
    },
    {
      title: 'Đơn giá',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => (
        <div className="flex flex-col whitespace-nowrap">
          <span className="font-bold text-slate-800 text-sm font-mono whitespace-nowrap">
            {price.toLocaleString()} <span className="text-[10px] text-slate-400 font-normal">đ</span>
          </span>
        </div>
      ),
    },
    {
      title: 'Tồn kho',
      dataIndex: 'stock',
      key: 'stock',
      render: (stock: number, record: ServiceItem) => {
        const isEditing = editingStock?.id === record.id;
        return (
          <div className="flex items-center gap-2">
            {isEditing ? (
              <div className="flex items-center gap-1.5 bg-slate-50 p-1 rounded-lg border border-slate-200 shadow-inner">
                <InputNumber
                  min={0}
                  value={editingStock?.val ?? 0}
                  onChange={(val) => val !== null && setEditingStock({ id: record.id, val })}
                  onPressEnter={() => {
                    onUpdateStock(record.id, editingStock.val - stock);
                    setEditingStock(null);
                  }}
                  className="w-16 rounded-md border-slate-200 font-bold font-mono text-center"
                  size="small"
                  controls={false}
                />
                <Button
                  size="small"
                  type="primary"
                  className="bg-emerald-600 border-emerald-600 hover:bg-emerald-700 flex items-center justify-center w-6 h-6 p-0 min-w-0 rounded-md text-white"
                  icon={<SaveOutlined className="text-xs" />}
                  onClick={() => {
                    onUpdateStock(record.id, editingStock.val - stock);
                    setEditingStock(null);
                  }}
                />
                <Button
                  size="small"
                  type="text"
                  className="hover:bg-slate-200 text-slate-450 flex items-center justify-center w-6 h-6 p-0 min-w-0 rounded-md"
                  icon={<CloseOutlined className="text-xs" />}
                  onClick={() => setEditingStock(null)}
                />
              </div>
            ) : (
              <div className="flex items-center gap-2 group">
                <div className={`h-7 px-2.5 rounded-lg flex items-center justify-center font-black font-mono text-xs shadow-sm ${stock === 0
                  ? 'bg-rose-50 text-rose-600 border border-rose-100'
                  : stock < 10
                    ? 'bg-amber-50 text-amber-600 border border-amber-100'
                    : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                  }`}>
                  {stock}
                </div>
                <Tooltip title="Cập nhật nhanh kho">
                  <Button
                    size="small"
                    type="text"
                    shape="circle"
                    icon={<EditOutlined />}
                    className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-emerald-600 hover:bg-slate-100 transition-all duration-200"
                    onClick={() => setEditingStock({ id: record.id, val: stock })}
                  />
                </Tooltip>
              </div>
            )}
          </div>
        );
      }
    },
    {
      title: 'Trạng thái',
      key: 'status',
      render: (_: unknown, record: ServiceItem) => {
        const cfg = STATUS_CONFIG[record.status] || STATUS_CONFIG.out_of_stock;
        return (
          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-extrabold text-[10px] ${cfg.bg}`}>
            <div className={`w-1.5 h-1.5 rounded-full ${cfg.color}`} />
            {cfg.label}
          </div>
        );
      },
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 100,
      render: (_: unknown, record: ServiceItem) => (
        <div className="flex items-center gap-1">
          <Tooltip title="Sửa thông tin sản phẩm">
            <Button
              icon={<EditOutlined />}
              type="text"
              size="small"
              className="rounded-lg hover:bg-slate-100 text-slate-500 hover:text-emerald-600"
              onClick={() => onEditService(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Xóa sản phẩm này?"
            description="Hành động này không thể hoàn tác."
            onConfirm={() => { onDeleteService(record.id); }}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Tooltip title="Xóa dịch vụ">
              <Button
                danger
                icon={<DeleteOutlined />}
                type="text"
                size="small"
                className="rounded-lg hover:bg-rose-50"
              />
            </Tooltip>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={services}
      rowKey="id"
      pagination={{ pageSize: 8, size: 'small', className: 'px-6 py-3 border-t border-slate-100' }}
      className="admin-table border-none"
    />
  );
};
