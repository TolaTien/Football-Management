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
    <Card bordered={false} bodyStyle={{ padding: 24, borderRadius: 12, boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div style={{ fontSize: 18, fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ color: '#00a67d' }}>🕒</div> Quy tắc giá theo giờ
        </div>
        <Space>
          <Button icon={<FilterOutlined />} size="large" style={{ borderRadius: 8 }} />
          <Button type="primary" icon={<PlusOutlined />} size="large" style={{ backgroundColor: '#4b5563', borderRadius: 8, fontWeight: 600 }} onClick={onOpenAddModal}>
            Thêm khung giờ
          </Button>
        </Space>
      </div>

      {/* Header row */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1.5fr 1fr', padding: '0 16px 16px', borderBottom: '1px solid #f3f4f6', color: '#6b7280', fontWeight: 600, fontSize: 13 }}>
        <div>Khung giờ</div>
        <div>Đơn giá (VNĐ/h)</div>
        <div>Trạng thái</div>
        <div style={{ textAlign: 'right' }}>Thao tác</div>
      </div>

      {/* List prices */}
      {prices.map(pr => (
        <div key={pr.id} style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1.5fr 1fr', padding: '24px 16px', borderBottom: '1px solid #f3f4f6', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, backgroundColor: pr.status === 'active' ? '#e0f2fe' : '#f3f4f6', color: pr.status === 'active' ? '#0ea5e9' : '#9ca3af', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>
              {pr.status === 'active' ? '☀️' : '🌙'}
            </div>
            <div>
              <div style={{ fontWeight: 700, color: '#1f2937', fontSize: 15, marginBottom: 4 }}>{pr.timeRange}</div>
              <div style={{ color: '#6b7280', fontSize: 13 }}>{pr.type}</div>
            </div>
          </div>
          <div>
            {editingPrice?.id === pr.id ? (
              <InputNumber 
                value={editingPrice.val} 
                onChange={val => setEditingPrice({ id: pr.id, val: val || 0 })}
                onPressEnter={() => onSavePrice(pr.id)}
                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                style={{ width: 140, borderRadius: 8, fontWeight: 600 }}
              />
            ) : (
              <div style={{ padding: '8px 16px', border: '1px solid #e5e7eb', borderRadius: 8, display: 'inline-block', fontWeight: 600, color: '#1f2937' }}>
                {pr.price.toLocaleString()} VNĐ
              </div>
            )}
          </div>
          <div>
            <div style={{ display: 'inline-flex', padding: '4px 12px', borderRadius: 16, backgroundColor: pr.status === 'active' ? '#ecfdf5' : '#fef2f2', color: pr.status === 'active' ? '#059669' : '#dc2626', fontWeight: 700, fontSize: 12 }}>
              {pr.status === 'active' ? 'Đang hoạt động' : 'Bảo trì'}
            </div>
          </div>
          <div style={{ textAlign: 'right', display: 'flex', justifyContent: 'flex-end', gap: 16, color: '#9ca3af', fontSize: 18 }}>
            {editingPrice?.id === pr.id ? (
              <SaveOutlined style={{ cursor: 'pointer', color: '#059669' }} onClick={() => onSavePrice(pr.id)} />
            ) : (
              <EditOutlined style={{ cursor: 'pointer', color: '#4b5563' }} onClick={() => setEditingPrice({ id: pr.id, val: pr.price })} />
            )}
            <Popconfirm title="Xóa khung giờ này?" onConfirm={() => onDeletePriceRule(pr.id)}>
              <DeleteOutlined style={{ cursor: 'pointer', color: '#dc2626' }} />
            </Popconfirm>
          </div>
        </div>
      ))}

      {/* Alert / Info Box */}
      <div style={{ marginTop: 24, padding: 20, backgroundColor: '#f0fdf4', borderRadius: 12, border: '1px solid #bbf7d0', display: 'flex', gap: 16 }}>
        <BulbFilled style={{ color: '#00a67d', fontSize: 24 }} />
        <div>
          <div style={{ color: '#064e3b', fontWeight: 700, marginBottom: 4, fontSize: 14 }}>Mẹo: Tự động phát hiện giờ cao điểm</div>
          <div style={{ color: '#047857', fontSize: 13, lineHeight: 1.5 }}>
            Hệ thống nhận thấy mật độ đặt sân cao nhất diễn ra từ 18:00 đến 20:00. Cân nhắc áp dụng thêm 10% phí cho các khung giờ này để tối ưu doanh thu.
          </div>
        </div>
      </div>
    </Card>
  );
};
