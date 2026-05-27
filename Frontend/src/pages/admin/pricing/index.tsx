import React, { useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { Row, Col, Typography, Button, message, Form } from 'antd';
import { HistoryOutlined, SaveOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '@/shared/model/hooks';
import { fetchPitches, syncPriceConfigThunk } from '@/entities/pitch/model/pitchSlice';
import type { PriceRule } from '@/entities/pitch/model/types';
import type { Dayjs } from 'dayjs';
import { PitchSelector } from './components/PitchSelector';
import { PricingRulesList } from './components/PricingRulesList';
import { WeeklyCalendarPreview } from './components/WeeklyCalendarPreview';
import { AddPriceRuleModal } from './components/AddPriceRuleModal';

const { Title, Text } = Typography;

const AdminPitches: React.FC = () => {
  const dispatch = useAppDispatch();
  const { pitches, prices } = useAppSelector((state) => state.pitch);
  const [activePitch, setActivePitch] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPrice, setEditingPrice] = useState<{ id: string, val: number } | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    dispatch(fetchPitches());
  }, [dispatch]);

  useEffect(() => {
    if (!activePitch && pitches.length > 0) {
      setActivePitch(pitches[0].id);
    }
  }, [pitches, activePitch]);

  const currentPrices = prices.filter(p => p.pitchId === activePitch);

  const handleSavePrice = (id: string) => {
    if (editingPrice && editingPrice.id === id) {
      let targetPitchId = '';
      const updatedPrices = prices.map((p) => {
        if (p.id === id) {
          targetPitchId = p.pitchId;
          return { ...p, price: editingPrice.val };
        }
        return p;
      });
      if (targetPitchId) {
        dispatch(syncPriceConfigThunk({ pitchId: targetPitchId, updatedPrices }));
      }
      setEditingPrice(null);
      message.success('Đã cập nhật giá!');
    }
  };

  const handleAddRule = (values: { startTime: Dayjs; endTime: Dayjs; price: number; type: string }) => {
    const timeRange = `${values.startTime.format('HH:mm')} - ${values.endTime.format('HH:mm')}`;
    const newRule: PriceRule = {
      id: `pr_${Date.now()}`,
      pitchId: activePitch,
      timeRange: timeRange,
      price: values.price,
      type: values.type,
      status: 'active',
      icon: 'sun'
    };
    const updatedPrices = [...prices, newRule];
    dispatch(syncPriceConfigThunk({ pitchId: activePitch, updatedPrices }));
    message.success('Đã thêm khung giờ mới!');
    setIsModalOpen(false);
    form.resetFields();
  };

  const handleDeletePriceRule = (id: string) => {
    let targetPitchId = '';
    const updatedPrices = prices.filter((p) => {
      if (p.id === id) {
        targetPitchId = p.pitchId;
        return false;
      }
      return true;
    });
    if (targetPitchId) {
      dispatch(syncPriceConfigThunk({ pitchId: targetPitchId, updatedPrices }));
      message.success('Đã xóa khung giờ!');
    }
  };

  return (
    <PageContainer
      header={{
        title: <Title level={2} style={{ margin: 0, fontWeight: 700 }}>Cấu hình Bảng giá Sân</Title>,
        subTitle: <Text style={{ color: '#6b7280' }}>Quản lý các quy tắc giá theo giờ và điều chỉnh giờ cao điểm.</Text>,
        extra: [
          <Button
            key="save"
            type="primary"
            icon={<SaveOutlined />}
            style={{ backgroundColor: '#00a67d', borderRadius: 8, fontWeight: 600 }}
            onClick={() => message.success('Đã lưu toàn bộ thay đổi cấu hình giá thành công!')}
          >
            Lưu tất cả thay đổi
          </Button>
        ]

      }}
    >
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={8}>
          <PitchSelector
            pitches={pitches}
            activePitch={activePitch}
            onSelectPitch={setActivePitch}
          />
        </Col>

        <Col xs={24} lg={16}>
          <PricingRulesList
            prices={currentPrices}
            editingPrice={editingPrice}
            setEditingPrice={setEditingPrice}
            onSavePrice={handleSavePrice}
            onDeletePriceRule={handleDeletePriceRule}
            onOpenAddModal={() => setIsModalOpen(true)}
          />

          <WeeklyCalendarPreview onOpenAddModal={() => setIsModalOpen(true)} />
        </Col>
      </Row>

      <AddPriceRuleModal
        isOpen={isModalOpen}
        onCancel={() => { setIsModalOpen(false); form.resetFields(); }}
        onFinish={handleAddRule}
        form={form}
      />
    </PageContainer>
  );
};

export default AdminPitches;