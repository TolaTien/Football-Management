import React, { useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { Button, Typography, Form } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '@/shared/model/hooks';
import { fetchServices, addService, updateStock, deleteService } from '@/entities/service-item/model/serviceSlice';
import type { ServiceType } from '@/entities/service-item/model/types';
import { ServicesSummaryStats, ServicesTable } from '@/widgets/admin-services-table';
import { AddServiceModal } from '@/features/admin-manage-service';

const { Text } = Typography;

const AdminServices: React.FC = () => {
  const dispatch = useAppDispatch();
  const { services } = useAppSelector((state) => state.service);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStock, setEditingStock] = useState<{ id: string; val: number } | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    dispatch(fetchServices());
  }, [dispatch]);

  const handleAdd = (values: { name: string; type: ServiceType; price: number }) => {
    dispatch(addService({
      name: values.name,
      type: values.type,
      price: values.price,
    }));
    setIsModalOpen(false);
    form.resetFields();
  };

  const totalItems = services.reduce((s, x) => s + x.stock, 0);
  const lowStockCount = services.filter(s => s.status === 'low_stock').length;
  const outStockCount = services.filter(s => s.status === 'out_of_stock').length;

  const summaryItems = [
    { icon: '📦', label: 'Tổng sản phẩm', value: services.length, color: '#0ea5e9', bg: '#e0f2fe' },
    { icon: '🔢', label: 'Tổng tồn kho', value: `${totalItems} đv`, color: '#059669', bg: '#dcfce7' },
    { icon: '⚠️', label: 'Sắp hết hàng', value: lowStockCount, color: '#b45309', bg: '#fef9c3' },
    { icon: '❌', label: 'Hết hàng', value: outStockCount, color: '#dc2626', bg: '#fee2e2' },
  ];

  return (
    <PageContainer
      header={{
        title: (
          <div>
            <div style={{ fontWeight: 800, fontSize: 22, color: '#0f172a' }}>Quản lý Kho & Dịch vụ</div>
            <Text style={{ color: '#94a3b8', fontSize: 13 }}>Nước uống, bóng, áo sân cho thuê / bán tại sân</Text>
          </div>
        ),
        extra: [
          <Button
            key="add" type="primary" icon={<PlusOutlined />}
            onClick={() => setIsModalOpen(true)}
            style={{ height: 40, padding: '0 20px', fontWeight: 700 }}
          >
            Thêm sản phẩm
          </Button>,
        ],
      }}
    >
      {/* Top Summary */}
      <ServicesSummaryStats items={summaryItems} />

      {/* Table container */}
      <div style={{
        background: 'white', borderRadius: 16,
        border: '1px solid #e2e8f0',
        boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
        overflow: 'hidden',
      }}>
        <div style={{ padding: '18px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontWeight: 700, color: '#0f172a', fontSize: 15 }}>📋 Danh sách sản phẩm</div>
          <Text style={{ color: '#94a3b8', fontSize: 12 }}>{services.length} mục</Text>
        </div>
        <ServicesTable
          services={services}
          editingStock={editingStock}
          setEditingStock={setEditingStock}
          onUpdateStock={(id, qty) => dispatch(updateStock({ id, qty }))}
          onDeleteService={(id) => dispatch(deleteService(id))}
        />
      </div>

      {/* Add Service Modal */}
      <AddServiceModal
        isOpen={isModalOpen}
        onCancel={() => { setIsModalOpen(false); form.resetFields(); }}
        onFinish={handleAdd}
        form={form}
      />
    </PageContainer>
  );
};

export default AdminServices;