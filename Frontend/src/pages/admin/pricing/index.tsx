import React, { useState } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { Row, Col, Card, Typography, Button, Space, message, Tag, Modal, Form, InputNumber, TimePicker, Input, Select, Popconfirm } from 'antd';
import {
  HistoryOutlined, SaveOutlined, PlusOutlined, EditOutlined, DeleteOutlined, CheckCircleOutlined, RightOutlined, FilterOutlined, BulbFilled,
  ClockCircleOutlined, DollarOutlined, TagsOutlined,
} from '@ant-design/icons';
import { useModel } from '@umijs/max';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

const AdminPitches: React.FC = () => {
  const { pitches, prices, updatePrice, addPriceRule, deletePriceRule } = useModel('adminPitches');
  const [activePitch, setActivePitch] = useState(pitches[0]?.id || '');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPrice, setEditingPrice] = useState<{id: string, val: number} | null>(null);
  const [form] = Form.useForm();

  // Lọc giá theo sân đang chọn
  const currentPrices = prices.filter(p => p.pitchId === activePitch);

  const handleSavePrice = (id: string) => {
    if (editingPrice && editingPrice.id === id) {
      updatePrice(id, editingPrice.val);
      setEditingPrice(null);
      message.success('Đã cập nhật giá!');
    }
  };

  const handleAddRule = (values: any) => {
    const timeRange = `${values.startTime.format('HH:mm')} - ${values.endTime.format('HH:mm')}`;
    addPriceRule({
      pitchId: activePitch,
      timeRange: timeRange,
      price: values.price,
      type: values.type,
      status: 'active',
      icon: 'sun' // hardcoded for demo
    });
    message.success('Đã thêm khung giờ mới!');
    setIsModalOpen(false);
    form.resetFields();
  };

  return (
    <PageContainer
      header={{
        title: <Title level={2} style={{ margin: 0, fontWeight: 700 }}>Cấu hình Bảng giá Sân</Title>,
        subTitle: <Text style={{ color: '#6b7280' }}>Quản lý các quy tắc giá theo giờ và điều chỉnh giờ cao điểm.</Text>,
        extra: [
          <Button key="history" icon={<HistoryOutlined />} style={{ borderRadius: 8, backgroundColor: '#e0e7ff', color: '#4f46e5', border: 'none', fontWeight: 600 }}>
            Xem nhật ký thay đổi
          </Button>,
          <Button key="save" type="primary" icon={<SaveOutlined />} style={{ backgroundColor: '#00a67d', borderRadius: 8, fontWeight: 600 }}>
            Lưu tất cả thay đổi
          </Button>
        ]
      }}
    >
      <Row gutter={[24, 24]}>
        {/* Cột trái: Danh sách Sân + Phân tích */}
        <Col xs={24} lg={8}>
          <Card bordered={false} bodyStyle={{ padding: 24, borderRadius: 12, boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
            <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ color: '#00a67d' }}>⚽</div> Chọn sân
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {pitches.map(p => (
                <div 
                  key={p.id}
                  onClick={() => setActivePitch(p.id)}
                  style={{
                    padding: '16px 20px',
                    borderRadius: 12,
                    border: activePitch === p.id ? '2px solid #00a67d' : '1px solid #f3f4f6',
                    backgroundColor: activePitch === p.id ? '#ecfdf5' : '#ffffff',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    transition: 'all 0.2s'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, color: '#1f2937', fontSize: 15, marginBottom: 4 }}>{p.name}</div>
                    <div style={{ color: '#6b7280', fontSize: 13 }}>{p.desc}</div>
                  </div>
                  {activePitch === p.id ? <CheckCircleOutlined style={{ color: '#00a67d', fontSize: 20 }} /> : <RightOutlined style={{ color: '#9ca3af' }} />}
                </div>
              ))}
            </div>

            <div style={{ marginTop: 24, padding: '16px 20px', backgroundColor: '#f9fafb', borderRadius: 12, border: '1px solid #e5e7eb' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ fontWeight: 600, color: '#6b7280', fontSize: 12 }}>TÌNH TRẠNG SÂN</Text>
                <div style={{ padding: '4px 12px', backgroundColor: '#d1fae5', color: '#059669', borderRadius: 16, fontWeight: 800, fontSize: 12 }}>
                  RẤT TỐT
                </div>
              </div>
              <div style={{ width: '100%', height: 4, backgroundColor: '#e5e7eb', borderRadius: 2, marginTop: 12 }}>
                <div style={{ width: '85%', height: '100%', backgroundColor: '#059669', borderRadius: 2 }}></div>
              </div>
            </div>
          </Card>

          <Card bordered={false} style={{ marginTop: 24, backgroundColor: '#1e293b', border: 'none', borderRadius: 12 }} bodyStyle={{ padding: 24 }}>
            <div style={{ color: '#f8fafc', fontSize: 18, fontWeight: 700, marginBottom: 4 }}>Phân tích doanh thu</div>
            <div style={{ color: '#94a3b8', fontSize: 14, marginBottom: 24 }}>30 ngày qua cho {pitches.find(p=>p.id === activePitch)?.name}</div>
            
            <div style={{ color: '#ffffff', fontSize: 36, fontWeight: 800, marginBottom: 8 }}>48.2M VNĐ</div>
            <div style={{ color: '#34d399', fontSize: 14, fontWeight: 600 }}>↗ +12.4% so với tháng trước</div>
          </Card>
        </Col>

        {/* Cột phải: Bảng giá + Xem trước lịch */}
        <Col xs={24} lg={16}>
          <Card bordered={false} bodyStyle={{ padding: 24, borderRadius: 12, boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <div style={{ fontSize: 18, fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ color: '#00a67d' }}>🕒</div> Quy tắc giá theo giờ
              </div>
              <Space>
                <Button icon={<FilterOutlined />} size="large" style={{ borderRadius: 8 }} />
                <Button type="primary" icon={<PlusOutlined />} size="large" style={{ backgroundColor: '#4b5563', borderRadius: 8, fontWeight: 600 }} onClick={() => setIsModalOpen(true)}>
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
            {currentPrices.map(pr => (
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
                      onPressEnter={() => handleSavePrice(pr.id)}
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
                    <SaveOutlined style={{ cursor: 'pointer', color: '#059669' }} onClick={() => handleSavePrice(pr.id)} />
                  ) : (
                    <EditOutlined style={{ cursor: 'pointer', color: '#4b5563' }} onClick={() => setEditingPrice({ id: pr.id, val: pr.price })} />
                  )}
                  <Popconfirm title="Xóa khung giờ này?" onConfirm={() => deletePriceRule(pr.id)}>
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

          {/* Lịch Preview theo Mockup */}
          <Card bordered={false} style={{ marginTop: 24, borderRadius: 12, boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }} bodyStyle={{ padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <div style={{ fontSize: 18, fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ color: '#00a67d' }}>📅</div> Xem trước lịch tuần
              </div>
              <div style={{ display: 'flex', gap: 16, fontSize: 13, color: '#4b5563', fontWeight: 600 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#10b981' }} /> Đã đặt</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#e5e7eb' }} /> Còn trống</div>
              </div>
            </div>

            <div style={{ display: 'flex', height: 120, border: '1px solid #e5e7eb', borderRadius: 8, overflow: 'hidden' }}>
              <div style={{ width: 60, borderRight: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '10px 0', fontSize: 10, color: '#9ca3af', textAlign: 'center', fontWeight: 600 }}>
                <div>06:00</div>
                <div>12:00</div>
                <div>18:00</div>
                <div>00:00</div>
              </div>
              <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(14, 1fr)', gridTemplateRows: 'repeat(4, 1fr)', gap: 2, padding: 8, backgroundColor: '#f9fafb' }}>
                {Array.from({ length: 56 }).map((_, i) => {
                  // Simulate some busy hours based on mockup pattern
                  let color = '#e5e7eb'; // default empty
                  if (i > 30 && i < 40) color = '#f87171'; // red for very busy
                  else if (i % 3 === 0 || i % 7 === 0) color = '#10b981'; // green for booked
                  else if (i > 45) color = '#1f2937'; // dark for night
                  
                  return (
                    <div key={i} style={{ 
                      backgroundColor: color,
                      borderRadius: 2
                    }} />
                  );
                })}
              </div>
            </div>
            
            {/* FAB Button at bottom right */}
            <div style={{ position: 'relative' }}>
              <Button type="primary" shape="circle" icon={<PlusOutlined />} size="large" style={{ position: 'absolute', right: -16, top: -20, width: 48, height: 48, backgroundColor: '#00a67d', boxShadow: '0 4px 10px rgba(0,166,125,0.4)' }} onClick={() => setIsModalOpen(true)}/>
            </div>
          </Card>
        </Col>
      </Row>

      {/* ── Modal Thêm Khung Giờ – 2 panel premium ── */}
      <Modal
        open={isModalOpen}
        onCancel={() => { setIsModalOpen(false); form.resetFields(); }}
        footer={null}
        width={640}
        style={{ top: 80 }}
        styles={{ body: { padding: 0 } }}
        closeIcon={<span style={{ fontSize: 18, color: '#9ca3af' }}>✕</span>}
      >
        <div style={{ display: 'flex', borderRadius: 12, overflow: 'hidden', minHeight: 400 }}>
          {/* Panel trái xanh */}
          <div style={{
            width: 185, minWidth: 185,
            background: 'linear-gradient(160deg, #059669 0%, #047857 100%)',
            padding: '36px 20px',
            display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
          }}>
            <div>
              <div style={{
                width: 48, height: 48, borderRadius: 12,
                backgroundColor: 'rgba(255,255,255,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20,
              }}>
                <ClockCircleOutlined style={{ fontSize: 24, color: '#fff' }} />
              </div>
              <div style={{ color: '#fff', fontSize: 17, fontWeight: 800, lineHeight: 1.3, marginBottom: 12 }}>Thêm Khung Giờ</div>
              <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: 13, lineHeight: 1.6 }}>
                Thiết lập khung giờ và mức giá phù hợp để tối ưu doanh thu sân bóng.
              </div>
            </div>
            <div style={{ padding: '12px 14px', backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: 10, border: '1px solid rgba(255,255,255,0.15)' }}>
              <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11, marginBottom: 4 }}>💡 Mẹo</div>
              <div style={{ color: '#fff', fontSize: 12, lineHeight: 1.5 }}>Giờ 18–20h có mật độ đặt cao nhất.</div>
            </div>
          </div>

          {/* Panel phải */}
          <div style={{ flex: 1, backgroundColor: '#fff', padding: '32px 28px' }}>
            <Form form={form} layout="vertical" onFinish={handleAddRule}>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="startTime"
                    label={<span style={{ fontWeight: 600, color: '#374151', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}><ClockCircleOutlined style={{ color: '#059669' }} /> Giờ bắt đầu</span>}
                    rules={[{ required: true, message: 'Chọn giờ' }]}
                  >
                    <TimePicker format="HH:mm" size="large" style={{ width: '100%', borderRadius: 10, borderColor: '#d1d5db' }} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="endTime"
                    label={<span style={{ fontWeight: 600, color: '#374151', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}><ClockCircleOutlined style={{ color: '#059669' }} /> Giờ kết thúc</span>}
                    rules={[{ required: true, message: 'Chọn giờ' }]}
                  >
                    <TimePicker format="HH:mm" size="large" style={{ width: '100%', borderRadius: 10, borderColor: '#d1d5db' }} />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                name="type"
                label={<span style={{ fontWeight: 600, color: '#374151', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}><TagsOutlined style={{ color: '#059669' }} /> Tên khung giờ</span>}
                rules={[{ required: true }]}
                initialValue="Giờ thường"
              >
                <Input placeholder="Ví dụ: Giờ vàng buổi tối" size="large" style={{ borderRadius: 10, borderColor: '#d1d5db' }} />
              </Form.Item>

              <Form.Item
                name="price"
                label={<span style={{ fontWeight: 600, color: '#374151', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}><DollarOutlined style={{ color: '#059669' }} /> Đơn giá (VNĐ/h)</span>}
                rules={[{ required: true, message: 'Nhập đơn giá' }]}
              >
                <InputNumber
                  style={{ width: '100%', borderRadius: 10 }}
                  size="large"
                  formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={(value) => value!.replace(/\$\s?|(,*)/g, '') as unknown as 0}
                  min={0}
                  step={10000}
                  placeholder="350,000"
                />
              </Form.Item>

              <div style={{ paddingTop: 16, borderTop: '1px solid #f3f4f6', display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
                <Button size="large" onClick={() => { setIsModalOpen(false); form.resetFields(); }}
                  style={{ borderRadius: 10, height: 44, padding: '0 24px', fontWeight: 600, color: '#374151', borderColor: '#d1d5db' }}
                >
                  Hủy
                </Button>
                <Button type="primary" htmlType="submit" size="large"
                  icon={<PlusOutlined />}
                  style={{ backgroundColor: '#059669', borderColor: '#059669', borderRadius: 10, height: 44, padding: '0 28px', fontWeight: 700, boxShadow: '0 4px 12px rgba(5,150,105,0.3)' }}
                >
                  Thêm Khung Giờ
                </Button>
              </div>
            </Form>
          </div>
        </div>
      </Modal>
    </PageContainer>
  );
};

export default AdminPitches;