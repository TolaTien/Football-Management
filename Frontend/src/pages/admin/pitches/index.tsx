import React, { useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { Row, Col, Typography, Button, message, Form } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '@/shared/model/hooks';
import { fetchPitches, addPitch, updatePitch, deletePitchLocally } from '@/entities/pitch/model/pitchSlice';
import type { Pitch } from '@/entities/pitch/model/types';
import { PitchesSummaryStats } from './components/PitchesSummaryStats';
import { PitchCard } from './components/PitchCard';
import { MaintenanceScheduleTable } from './components/MaintenanceScheduleTable';
import { AddEditPitchModal } from './components/AddEditPitchModal';

const { Text } = Typography;

// Constants
const MOCK_PRICE = 500000;
const INITIAL_GRASS_HEALTH = 100;
const DEFAULT_GRASS_STATUS = 'Tốt';
const DEFAULT_MAINTENANCE = 'Chưa xếp lịch';
const DEFAULT_IMAGE_URL = 'https://images.unsplash.com/photo-1518605368461-1ee7c5320c2d?q=80&w=600&auto=format&fit=crop';

const AdminPitchesList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { pitches } = useAppSelector((state) => state.pitch);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPitch, setEditingPitch] = useState<Pitch | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    dispatch(fetchPitches());
  }, [dispatch]);

  const handleOpenAdd = () => {
    setEditingPitch(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleOpenEdit = (pitch: Pitch) => {
    setEditingPitch(pitch);
    form.setFieldsValue({
      name: pitch.name,
      type: pitch.type.includes('5') ? '5' : pitch.type.includes('7') ? '7' : '11',
      desc: pitch.desc,
      price: MOCK_PRICE,
    });
    setIsModalOpen(true);
  };

  const handleFormSubmit = (values: { name: string; type: string; desc?: string; price?: number }) => {
    const pitchData = {
      name: values.name,
      type: `Sân ${values.type} người`,
      desc: values.desc || '',
      status: editingPitch ? editingPitch.status : 'active',
      grassHealth: editingPitch ? editingPitch.grassHealth : INITIAL_GRASS_HEALTH,
      grassStatus: editingPitch ? editingPitch.grassStatus : DEFAULT_GRASS_STATUS,
      nextMaintenance: editingPitch ? editingPitch.nextMaintenance : DEFAULT_MAINTENANCE,
      imageUrl: editingPitch ? editingPitch.imageUrl : DEFAULT_IMAGE_URL,
    } as Omit<Pitch, 'id'>;

    if (editingPitch) {
      dispatch(updatePitch({ id: editingPitch.id, updatedData: pitchData }));
    } else {
      dispatch(addPitch(pitchData));
    }

    setIsModalOpen(false);
    form.resetFields();
    setEditingPitch(null);
  };

  const handleDelete = (id: string) => {
    dispatch(deletePitchLocally(id));
    message.success('Đã xóa sân!');
  };

  const activePitches = pitches.filter(p => p.status === 'active').length;
  const maintenancePitches = pitches.filter(p => p.status === 'maintenance').length;
  const totalHealth = pitches.reduce((sum, p) => sum + (p.grassHealth || 0), 0);
  const avgHealth = pitches.length ? Math.round(totalHealth / pitches.length) : 0;

  return (
    <PageContainer
      header={{
        title: (
          <div>
            <div style={{ fontWeight: 800, fontSize: 22, color: '#0f172a' }}>Quản lý hệ thống sân</div>
            <Text style={{ color: '#94a3b8', fontSize: 13 }}>Theo dõi tình trạng, lịch bảo trì và danh sách sân cỏ của bạn</Text>
          </div>
        ),
        extra: [
          <Button key="add" type="primary" icon={<PlusOutlined />} style={{ height: 40, padding: '0 20px', fontWeight: 700 }} onClick={handleOpenAdd}>
            Thêm sân mới
          </Button>
        ]
      }}
    >
      {/* Top Stats */}
      <PitchesSummaryStats
        activePitches={activePitches}
        maintenancePitches={maintenancePitches}
        avgHealth={avgHealth}
      />

      {/* Grid Danh sách sân */}
      <Row gutter={[24, 24]}>
        {pitches.map(p => (
          <Col xs={24} sm={12} lg={8} xl={6} key={p.id}>
            <PitchCard
              pitch={p}
              onEdit={handleOpenEdit}
              onDelete={handleDelete}
            />
          </Col>
        ))}

        {/* Card Thêm sân mới */}
        <Col xs={24} sm={12} lg={8} xl={6}>
          <div
            onClick={handleOpenAdd}
            style={{
              height: '100%', minHeight: 320, borderRadius: 16, border: '2px dashed #cbd5e1',
              backgroundColor: '#f8fafc', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', transition: 'all 0.2s', padding: 24
            }}
            onMouseOver={(e) => e.currentTarget.style.borderColor = '#00a67d'}
            onMouseOut={(e) => e.currentTarget.style.borderColor = '#cbd5e1'}
          >
            <div style={{ width: 48, height: 48, borderRadius: '50%', backgroundColor: '#e2e8f0', color: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, marginBottom: 16 }}>
              <PlusOutlined />
            </div>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#1f2937', marginBottom: 8 }}>Thêm sân mới</div>
            <div style={{ color: '#6b7280', fontSize: 13, textAlign: 'center' }}>Mở rộng hệ thống kinh doanh</div>
          </div>
        </Col>
      </Row>

      {/* Bảng Chi tiết bảo trì */}
      <MaintenanceScheduleTable />

      {/* Modal Thêm/Sửa Sân */}
      <AddEditPitchModal
        isOpen={isModalOpen}
        onCancel={() => { setIsModalOpen(false); form.resetFields(); setEditingPitch(null); }}
        onFinish={handleFormSubmit}
        form={form}
        editingPitch={editingPitch}
      />
    </PageContainer>
  );
};

export default AdminPitchesList;