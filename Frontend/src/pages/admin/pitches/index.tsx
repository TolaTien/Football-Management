import React, { useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { Row, Col, Typography, Button, Form } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '@/shared/model/hooks';
import { fetchPitches, addPitch, updatePitch, deletePitchThunk } from '@/entities/pitch/model/pitchSlice';
import type { Pitch } from '@/entities/pitch/model/types';
import { PitchCard } from '@/entities/pitch';
import { AddEditPitchModal } from '@/features/manage-pitch';
import { PitchesSummaryStats } from '@/widgets/AdminPitchesStats';
import { PriceConfigDrawer } from '@/features/manage-pricing';

const { Text } = Typography;

const MOCK_PRICE = 500000;
const INITIAL_GRASS_HEALTH = 100;
const DEFAULT_GRASS_STATUS = 'Tốt';
const DEFAULT_MAINTENANCE = 'Chưa xếp lịch';

const AdminPitchesList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { pitches } = useAppSelector((state) => state.pitch);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPitch, setEditingPitch] = useState<Pitch | null>(null);
  const [selectedPitchForPrice, setSelectedPitchForPrice] = useState<Pitch | null>(null);
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
    dispatch(deletePitchThunk(id));
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
            <div className="font-extrabold text-2xl text-slate-800 tracking-tight">Quản lý hệ thống sân</div>
            <Text className="text-slate-400 text-xs">Theo dõi tình trạng, lịch bảo trì và danh sách sân cỏ của bạn</Text>
          </div>
        ),
        extra: [
          <Button 
            key="add" 
            type="primary" 
            icon={<PlusOutlined />} 
            className="h-10 px-5 font-bold rounded-xl bg-emerald-600 border-emerald-600 hover:bg-emerald-700 hover:border-emerald-700 shadow-md shadow-emerald-600/10" 
            onClick={handleOpenAdd}
          >
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
              onConfigurePrice={(pitch) => setSelectedPitchForPrice(pitch)}
            />
          </Col>
        ))}

        {/* Card Thêm sân mới */}
        <Col xs={24} sm={12} lg={8} xl={6}>
          <div
            onClick={handleOpenAdd}
            className="h-full min-h-[320px] rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 flex flex-col items-center justify-center cursor-pointer transition-all duration-200 p-6 hover:border-emerald-500 hover:bg-emerald-50/30 group"
          >
            <div className="w-12 h-12 rounded-full bg-slate-200 text-slate-800 flex items-center justify-center text-xl mb-4 transition-colors group-hover:bg-emerald-100 group-hover:text-emerald-700">
              <PlusOutlined />
            </div>
            <div className="text-lg font-bold text-slate-800 mb-2 transition-colors group-hover:text-emerald-700">Thêm sân mới</div>
            <div className="text-slate-400 text-xs text-center">Mở rộng hệ thống kinh doanh</div>
          </div>
        </Col>
      </Row>

      {/* Modal Thêm/Sửa Sân */}
      <AddEditPitchModal
        isOpen={isModalOpen}
        onCancel={() => { setIsModalOpen(false); form.resetFields(); setEditingPitch(null); }}
        onFinish={handleFormSubmit}
        form={form}
        editingPitch={editingPitch}
      />

      {/* Price Configuration Drawer */}
      <PriceConfigDrawer
        pitch={selectedPitchForPrice}
        onClose={() => setSelectedPitchForPrice(null)}
      />
    </PageContainer>
  );
};

export default AdminPitchesList;