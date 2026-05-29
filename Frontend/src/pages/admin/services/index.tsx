import React, { useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { Button, Typography, Form } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '@/shared/model/hooks';
import { fetchServices, addService, updateStock, deleteService } from '@/entities/service-item/model/serviceSlice';
import type { ServiceType } from '@/entities/service-item/model/types';

// FSD Imports
import { ServicesSummaryStats, ServicesTable } from '@/widgets/AdminServicesTable';
import { AddServiceModal } from '@/features/manage-service';

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
            <div className="font-extrabold text-2xl text-slate-800 tracking-tight">Quản lý Kho & Dịch vụ</div>
            <Text className="text-slate-400 text-xs">Nước uống, bóng, áo sân cho thuê / bán lẻ tại hệ thống sân bóng</Text>
          </div>
        ),
        extra: [
          <Button
            key="add" type="primary" icon={<PlusOutlined />}
            onClick={() => setIsModalOpen(true)}
            className="h-10 px-5 font-bold rounded-xl bg-emerald-600 border-emerald-600 hover:bg-emerald-700 hover:border-emerald-700 shadow-md shadow-emerald-600/10 flex items-center"
          >
            Thêm sản phẩm
          </Button>,
        ],
      }}
    >
      {/* Top Summary */}
      <ServicesSummaryStats items={summaryItems} />

      {/* Table container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4.5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div className="font-bold text-slate-800 text-sm">📋 Danh sách sản phẩm</div>
          <Text className="text-slate-400 text-xs font-semibold">{services.length} mục</Text>
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