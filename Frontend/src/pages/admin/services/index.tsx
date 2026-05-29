import React, { useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { Button, Typography, Form } from 'antd';
import { PlusOutlined, AppstoreOutlined, DatabaseOutlined, AlertOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '@/shared/model/hooks';
import { fetchServices, addService, updateStock, deleteService, updateService } from '@/entities/service-item/model/serviceSlice';
import type { ServiceItem, ServiceType } from '@/entities/service-item/model/types';

// FSD Imports
import { ServicesSummaryStats, ServicesTable } from '@/widgets/AdminServicesTable';
import { AddServiceModal } from '@/features/manage-service';

const { Text } = Typography;

const AdminServices: React.FC = () => {
  const dispatch = useAppDispatch();
  const { services } = useAppSelector((state) => state.service);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [editingStock, setEditingStock] = useState<{ id: string; val: number } | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    dispatch(fetchServices());
  }, [dispatch]);

  const handleFinish = (values: { name: string; type: ServiceType; price: number }) => {
    if (editingService) {
      dispatch(updateService({
        id: editingService.id,
        name: values.name,
        type: values.type,
        price: values.price,
      }));
    } else {
      dispatch(addService({
        name: values.name,
        type: values.type,
        price: values.price,
      }));
    }
    setIsModalOpen(false);
    setEditingService(null);
    form.resetFields();
  };

  const handleEditClick = (record: ServiceItem) => {
    setEditingService(record);
    setIsModalOpen(true);
  };

  const totalItems = services.reduce((s, x) => s + x.stock, 0);
  const lowStockCount = services.filter(s => s.status === 'low_stock').length;
  const outStockCount = services.filter(s => s.status === 'out_of_stock').length;

  const summaryItems = [
    { 
      icon: <AppstoreOutlined style={{ fontSize: '20px', color: '#0284c7' }} />, 
      label: 'Tổng sản phẩm', 
      value: services.length, 
      color: '#0284c7', 
      bg: '#f0f9ff', 
      border: 'border-sky-100' 
    },
    { 
      icon: <DatabaseOutlined style={{ fontSize: '20px', color: '#059669' }} />, 
      label: 'Tổng tồn kho', 
      value: `${totalItems} đv`, 
      color: '#059669', 
      bg: '#f0fdf4', 
      border: 'border-emerald-100' 
    },
    { 
      icon: <AlertOutlined style={{ fontSize: '20px', color: '#d97706' }} />, 
      label: 'Sắp hết hàng', 
      value: lowStockCount, 
      color: '#d97706', 
      bg: '#fffbeb', 
      border: 'border-amber-100' 
    },
    { 
      icon: <CloseCircleOutlined style={{ fontSize: '20px', color: '#dc2626' }} />, 
      label: 'Hết hàng', 
      value: outStockCount, 
      color: '#dc2626', 
      bg: '#fff5f5', 
      border: 'border-rose-100' 
    },
  ];

  return (
    <PageContainer
      header={{
        title: (
          <div>
            <div className="font-extrabold text-2xl text-slate-850 tracking-tight">Quản lý Kho & Dịch vụ</div>
            <Text className="text-slate-400 text-xs">Nước uống, bóng, áo sân cho thuê / bán lẻ tại hệ thống sân bóng</Text>
          </div>
        ),
        extra: [
          <Button
            key="add" type="primary" icon={<PlusOutlined />}
            onClick={() => {
              setEditingService(null);
              setIsModalOpen(true);
            }}
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
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div className="font-bold text-slate-800 text-sm">📋 Danh sách sản phẩm</div>
          <span className="bg-slate-100 text-slate-600 text-xs px-2.5 py-0.5 rounded-full font-bold">{services.length} mục</span>
        </div>
        <ServicesTable
          services={services}
          editingStock={editingStock}
          setEditingStock={setEditingStock}
          onUpdateStock={(id, qty) => dispatch(updateStock({ id, qty }))}
          onDeleteService={(id) => dispatch(deleteService(id))}
          onEditService={handleEditClick}
        />
      </div>

      {/* Add / Edit Service Modal */}
      <AddServiceModal
        isOpen={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setEditingService(null);
          form.resetFields();
        }}
        onFinish={handleFinish}
        form={form}
        editItem={editingService}
      />
    </PageContainer>
  );
};

export default AdminServices;