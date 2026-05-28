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
  in_stock: { label: 'Còn hàng', bg: '#dcfce7', color: '#15803d' },
  low_stock: { label: 'Sắp hết', bg: '#fef9c3', color: '#b45309' },
  out_of_stock: { label: 'Hết hàng', bg: '#fee2e2', color: '#dc2626' },
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
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 42, height: 42, borderRadius: 12,
            backgroundColor: record.type === 'drink' ? '#dbeafe' : '#dcfce7',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 20, flexShrink: 0,
          }}>
            {SERVICE_ICONS[record.type] || '📦'}
          </div>
          <div>
            <div style={{ fontWeight: 700, color: '#0f172a', fontSize: 13.5 }}>{text}</div>
            <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2, fontWeight: 500 }}>
              {record.type === 'drink' ? '🧋 Đồ uống' : record.type === 'equipment' ? '🏟 Trang thiết bị' : '📦 Khác'}
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
          <div style={{ fontWeight: 700, color: '#059669', fontSize: 14 }}>{price.toLocaleString()}<span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 500 }}> đ</span></div>
          <div style={{ fontSize: 11, color: '#cbd5e1', fontWeight: 500 }}>/ đơn vị</div>
        </div>
      ),
    },
    {
      title: 'Tồn kho',
      dataIndex: 'stock',
      key: 'stock',
      render: (stock: number, record: ServiceItem) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
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
                style={{ width: 90 }}
                size="small"
              />
              <SaveOutlined
                style={{ color: '#059669', cursor: 'pointer', fontSize: 16 }}
                onClick={() => {
                  onUpdateStock(record.id, editingStock.val - stock);
                  setEditingStock(null);
                }}
              />
            </>
          ) : (
            <>
              <div style={{
                minWidth: 44, height: 32, borderRadius: 8,
                background: stock === 0 ? '#fee2e2' : stock < 10 ? '#fef9c3' : '#f0fdf4',
                color: stock === 0 ? '#dc2626' : stock < 10 ? '#b45309' : '#15803d',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 800, fontSize: 14, padding: '0 10px',
              }}>
                {stock}
              </div>
              <EditOutlined
                style={{ color: '#94a3b8', cursor: 'pointer', fontSize: 14 }}
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
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            padding: '4px 12px', borderRadius: 20,
            backgroundColor: cfg.bg, color: cfg.color,
            fontWeight: 700, fontSize: 11,
          }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: cfg.color }} />
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
            style={{ borderRadius: 8 }}
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
      pagination={{ pageSize: 8, size: 'small' }}
      style={{ borderRadius: 0 }}
    />
  );
};
