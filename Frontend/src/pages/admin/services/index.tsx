import React, { useState } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import {
  Table, Button, Space, Typography, Popconfirm, Tag, InputNumber,
  Modal, Form, Input, Select, Upload, message,
} from 'antd';
import {
  PlusOutlined, DeleteOutlined, EditOutlined, SaveOutlined,
  InboxOutlined, ShopOutlined, CoffeeOutlined, AppstoreOutlined,
  DollarOutlined, TagsOutlined, CheckCircleOutlined,
} from '@ant-design/icons';
import { useModel } from '@umijs/max';

const { Text } = Typography;
const { Dragger } = Upload;

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

const AdminServices: React.FC = () => {
  const { services, deleteService, updateStock, addService } = useModel('adminServices');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStock, setEditingStock] = useState<{ id: string; val: number } | null>(null);
  const [form] = Form.useForm();

  const handleAdd = (values: any) => {
    addService({
      name: values.name,
      type: values.type,
      price: values.price,
    });
    message.success('Đã thêm sản phẩm mới thành công!');
    setIsModalOpen(false);
    form.resetFields();
  };

  const totalItems = services.reduce((s, x) => s + x.stock, 0);
  const lowStockCount = services.filter(s => s.status === 'low_stock').length;
  const outStockCount = services.filter(s => s.status === 'out_of_stock').length;

  const columns = [
    {
      title: 'Sản phẩm / Dịch vụ',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: any) => (
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
      render: (stock: number, record: any) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {editingStock?.id === record.id ? (
            <>
              <InputNumber
                min={0}
                value={editingStock?.val ?? 0}
                onChange={(val) => val !== null && setEditingStock({ id: record.id, val })}
                onPressEnter={() => {
                  if (editingStock) { updateStock(record.id, editingStock.val - stock); setEditingStock(null); }
                }}
                style={{ width: 90 }}
                size="small"
              />
              <SaveOutlined
                style={{ color: '#059669', cursor: 'pointer', fontSize: 16 }}
                onClick={() => {
                  if (editingStock) { updateStock(record.id, editingStock.val - stock); setEditingStock(null); }
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
      render: (_: any, record: any) => {
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
      render: (_: any, record: any) => (
        <Popconfirm
          title="Xóa sản phẩm này?"
          description="Hành động này không thể hoàn tác."
          onConfirm={() => { deleteService(record.id); message.success('Đã xóa!'); }}
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
      <div style={{ display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
        {[
          { icon: '📦', label: 'Tổng sản phẩm', value: services.length, color: '#0ea5e9', bg: '#e0f2fe' },
          { icon: '🔢', label: 'Tổng tồn kho', value: `${totalItems} đv`, color: '#059669', bg: '#dcfce7' },
          { icon: '⚠️', label: 'Sắp hết hàng', value: lowStockCount, color: '#b45309', bg: '#fef9c3' },
          { icon: '❌', label: 'Hết hàng', value: outStockCount, color: '#dc2626', bg: '#fee2e2' },
        ].map((item) => (
          <div key={item.label} style={{
            flex: '1 1 160px',
            background: 'white',
            borderRadius: 14,
            padding: '16px 20px',
            border: '1px solid #e2e8f0',
            display: 'flex', alignItems: 'center', gap: 12,
            boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
          }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10,
              backgroundColor: item.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
            }}>
              {item.icon}
            </div>
            <div>
              <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{item.label}</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: item.color, lineHeight: 1.3 }}>{item.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
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
        <Table
          columns={columns}
          dataSource={services}
          rowKey="id"
          pagination={{ pageSize: 8, size: 'small' }}
          style={{ borderRadius: 0 }}
        />
      </div>

      {/* ─── Modal Thêm Sản Phẩm ─── */}
      <Modal
        open={isModalOpen}
        onCancel={() => { setIsModalOpen(false); form.resetFields(); }}
        footer={null}
        width={620}
        style={{ top: 80 }}
        styles={{ body: { padding: 0 } }}
        closeIcon={<span style={{ fontSize: 18, color: '#94a3b8' }}>✕</span>}
      >
        <div style={{ display: 'flex', borderRadius: 16, overflow: 'hidden', minHeight: 380 }}>
          {/* Panel trái */}
          <div style={{
            width: 180, minWidth: 180,
            background: 'linear-gradient(160deg, #059669 0%, #047857 100%)',
            padding: '36px 22px',
            display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
          }}>
            <div>
              <div style={{
                width: 48, height: 48, borderRadius: 14,
                backgroundColor: 'rgba(255,255,255,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 20,
              }}>
                <ShopOutlined style={{ fontSize: 24, color: '#fff' }} />
              </div>
              <div style={{ color: '#fff', fontSize: 17, fontWeight: 800, lineHeight: 1.3, marginBottom: 10 }}>
                Thêm sản phẩm mới
              </div>
              <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: 12.5, lineHeight: 1.6 }}>
                Bổ sung hàng hóa vào kho để phục vụ khách hàng tại sân.
              </div>
            </div>
            <div style={{
              padding: '12px 14px',
              backgroundColor: 'rgba(255,255,255,0.12)',
              borderRadius: 10, border: '1px solid rgba(255,255,255,0.15)',
            }}>
              <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11, marginBottom: 4 }}>💡 Mẹo</div>
              <div style={{ color: '#fff', fontSize: 11.5, lineHeight: 1.5 }}>
                Cập nhật tồn kho thường xuyên để tránh hết hàng đột ngột.
              </div>
            </div>
          </div>

          {/* Panel phải */}
          <div style={{ flex: 1, backgroundColor: '#fff', padding: '32px 28px' }}>
            <Form form={form} layout="vertical" onFinish={handleAdd}>
              <Form.Item
                name="name"
                label={<span style={{ fontWeight: 600, color: '#374151', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}><TagsOutlined style={{ color: '#059669' }} /> Tên sản phẩm</span>}
                rules={[{ required: true, message: 'Nhập tên sản phẩm' }]}
              >
                <Input placeholder="Ví dụ: Nước suối Aquafina" size="large" style={{ borderRadius: 10 }} />
              </Form.Item>

              <Form.Item
                name="type"
                label={<span style={{ fontWeight: 600, color: '#374151', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}><AppstoreOutlined style={{ color: '#059669' }} /> Loại sản phẩm</span>}
                rules={[{ required: true, message: 'Chọn loại' }]}
                initialValue="drink"
              >
                <Select size="large" style={{ borderRadius: 10 }} options={[
                  { value: 'drink', label: '🧃 Đồ uống' },
                  { value: 'equipment', label: '⚽ Trang thiết bị' },
                  { value: 'food', label: '🍔 Đồ ăn nhanh' },
                  { value: 'other', label: '📦 Khác' },
                ]} />
              </Form.Item>

              <Form.Item
                name="price"
                label={<span style={{ fontWeight: 600, color: '#374151', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}><DollarOutlined style={{ color: '#059669' }} /> Đơn giá (VNĐ)</span>}
                rules={[{ required: true, message: 'Nhập đơn giá' }]}
              >
                <InputNumber
                  style={{ width: '100%', borderRadius: 10 }}
                  size="large"
                  formatter={v => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={(v) => v!.replace(/,/g, '') as unknown as 0}
                  min={0}
                  step={1000}
                  placeholder="15,000"
                />
              </Form.Item>

              {/* Upload ảnh */}
              <Form.Item
                name="image"
                label={<span style={{ fontWeight: 600, color: '#374151', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}><InboxOutlined style={{ color: '#059669' }} /> Hình ảnh (tuỳ chọn)</span>}
              >
                <Dragger
                  name="file"
                  multiple={false}
                  beforeUpload={() => false}
                  style={{ borderRadius: 10 }}
                >
                  <p style={{ color: '#059669', fontSize: 24, marginBottom: 4 }}><InboxOutlined /></p>
                  <p style={{ color: '#374151', fontWeight: 600, fontSize: 13 }}>Kéo & thả ảnh vào đây</p>
                  <p style={{ color: '#94a3b8', fontSize: 11 }}>PNG, JPG tối đa 2MB</p>
                </Dragger>
              </Form.Item>

              <div style={{ paddingTop: 16, borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                <Button
                  size="large"
                  onClick={() => { setIsModalOpen(false); form.resetFields(); }}
                  style={{ borderRadius: 10, height: 44, padding: '0 22px', fontWeight: 600 }}
                >
                  Hủy
                </Button>
                <Button
                  type="primary" htmlType="submit" size="large"
                  icon={<CheckCircleOutlined />}
                  style={{ borderRadius: 10, height: 44, padding: '0 26px', fontWeight: 700, boxShadow: '0 4px 12px rgba(5,150,105,0.3)' }}
                >
                  Thêm sản phẩm
                </Button>
              </div>
            </Form>
          </div>
        </div>
      </Modal>
    </PageContainer>
  );
};

export default AdminServices;
