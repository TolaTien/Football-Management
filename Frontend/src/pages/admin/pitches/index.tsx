import React, { useState } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { Row, Col, Card, Typography, Button, Input, Space, Divider, Progress } from 'antd';
import {
  SaveOutlined,
  HistoryOutlined,
  PlusOutlined,
  FilterOutlined,
  CheckCircleOutlined,
  SunOutlined,
  FireOutlined,
  MoonOutlined,
  EditOutlined,
  DeleteOutlined,
  BulbFilled,
  RightOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

const AdminPitches: React.FC = () => {
  const [activePitch, setActivePitch] = useState('A1');

  const pitches = [
    { id: 'A1', name: 'Sân 5 - A1', desc: 'Sân tập chính' },
    { id: 'A2', name: 'Sân 5 - A2', desc: 'Sân phụ' },
    { id: 'B1', name: 'Sân 7 - B1', desc: 'Sân vận động chính Phía Đông' },
  ];

  return (
    <PageContainer
      header={{
        title: <Title level={2} style={{ margin: 0, fontWeight: 700 }}>Cấu hình Bảng giá Sân</Title>,
        subTitle: <Text style={{ color: '#6b7280', fontSize: 14 }}>Quản lý các quy tắc giá theo giờ và điều chỉnh giờ cao điểm.</Text>,
        extra: [
          <Button key="history" icon={<HistoryOutlined />} size="large" style={{ borderRadius: 8, backgroundColor: '#dbeafe', color: '#1d4ed8', border: 'none', fontWeight: 500 }}>
            Xem nhật ký thay đổi
          </Button>,
          <Button key="save" type="primary" icon={<SaveOutlined />} size="large" style={{ backgroundColor: '#00a67d', borderRadius: 8, fontWeight: 500 }}>
            Lưu tất cả thay đổi
          </Button>,
        ],
      }}
    >
      <Row gutter={[24, 24]}>
        {/* Left Column */}
        <Col xs={24} lg={8}>
          <Card className="card-arena" bordered={false} bodyStyle={{ padding: 24 }}>
            <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ color: '#00a67d' }}>⚽</div> Chọn sân
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {pitches.map(p => (
                <div 
                  key={p.id}
                  onClick={() => setActivePitch(p.id)}
                  style={{
                    padding: 16,
                    borderRadius: 12,
                    border: activePitch === p.id ? '2px solid #00a67d' : '1px solid #e5e7eb',
                    backgroundColor: activePitch === p.id ? '#f0fdf4' : '#ffffff',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, color: '#1f2937', fontSize: 15 }}>{p.name}</div>
                    <div style={{ color: '#6b7280', fontSize: 13 }}>{p.desc}</div>
                  </div>
                  {activePitch === p.id ? <CheckCircleOutlined style={{ color: '#00a67d', fontSize: 18 }} /> : <RightOutlined style={{ color: '#9ca3af' }} />}
                </div>
              ))}
            </div>

            <div style={{ marginTop: 24, padding: 16, backgroundColor: '#f9fafb', borderRadius: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <Text style={{ fontWeight: 600, color: '#4b5563', fontSize: 12 }}>TÌNH TRẠNG SÂN</Text>
                <Text style={{ fontWeight: 700, color: '#059669', fontSize: 12 }}>RẤT TỐT</Text>
              </div>
              <Progress percent={85} strokeColor="#00a67d" showInfo={false} />
            </div>
          </Card>

          <Card className="card-arena" bordered={false} style={{ marginTop: 24, backgroundColor: '#1e293b', border: 'none' }} bodyStyle={{ padding: 24 }}>
            <div style={{ color: '#f8fafc', fontSize: 16, fontWeight: 600, marginBottom: 4 }}>Phân tích doanh thu</div>
            <div style={{ color: '#cbd5e1', fontSize: 13, marginBottom: 24 }}>30 ngày qua cho Sân 5 - A1</div>
            
            <div style={{ color: '#ffffff', fontSize: 36, fontWeight: 700, marginBottom: 8 }}>48.2M VNĐ</div>
            <div style={{ color: '#34d399', fontSize: 14, fontWeight: 500 }}>↗ +12.4% so với tháng trước</div>
          </Card>
        </Col>

        {/* Right Column */}
        <Col xs={24} lg={16}>
          <Card className="card-arena" bordered={false} bodyStyle={{ padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <div className="card-title" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ color: '#00a67d' }}>🕒</div> Quy tắc giá theo giờ
              </div>
              <Space>
                <Button icon={<FilterOutlined />} size="large" style={{ borderRadius: 8 }} />
                <Button type="primary" icon={<PlusOutlined />} size="large" style={{ backgroundColor: '#4b5563', borderRadius: 8, fontWeight: 500 }}>
                  Thêm khung giờ
                </Button>
              </Space>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1.5fr 1fr', padding: '0 16px 12px', borderBottom: '1px solid #e5e7eb', color: '#6b7280', fontWeight: 600, fontSize: 13 }}>
              <div>Khung giờ</div>
              <div>Đơn giá (VNĐ/h)</div>
              <div>Trạng thái</div>
              <div style={{ textAlign: 'right' }}>Thao tác</div>
            </div>

            {/* Row 1 */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1.5fr 1fr', padding: '20px 16px', borderBottom: '1px solid #e5e7eb', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <div style={{ width: 40, height: 40, borderRadius: 8, backgroundColor: '#e0f2fe', color: '#0ea5e9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
                  <SunOutlined />
                </div>
                <div>
                  <div style={{ fontWeight: 600, color: '#1f2937' }}>06:00 - 16:00</div>
                  <div style={{ color: '#6b7280', fontSize: 12 }}>Giờ thấp điểm (Sáng/Chiều)</div>
                </div>
              </div>
              <div>
                <Input defaultValue="300,000" suffix="VNĐ" style={{ width: 140, borderRadius: 8, fontWeight: 600 }} />
              </div>
              <div>
                <span className="status-tag status-success">Đang hoạt động</span>
              </div>
              <div style={{ textAlign: 'right', display: 'flex', justifyContent: 'flex-end', gap: 16, color: '#6b7280', fontSize: 16 }}>
                <EditOutlined style={{ cursor: 'pointer' }} />
                <DeleteOutlined style={{ cursor: 'pointer' }} />
              </div>
            </div>

            {/* Row 2 */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1.5fr 1fr', padding: '20px 16px', borderBottom: '1px solid #e5e7eb', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <div style={{ width: 40, height: 40, borderRadius: 8, backgroundColor: '#fee2e2', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
                  <FireOutlined />
                </div>
                <div>
                  <div style={{ fontWeight: 600, color: '#1f2937' }}>16:00 - 22:00</div>
                  <div style={{ color: '#6b7280', fontSize: 12 }}>Giờ cao điểm (Tối)</div>
                </div>
              </div>
              <div>
                <Input defaultValue="500,000" suffix="VNĐ" style={{ width: 140, borderRadius: 8, fontWeight: 600 }} />
              </div>
              <div>
                <span className="status-tag status-success">Đang hoạt động</span>
              </div>
              <div style={{ textAlign: 'right', display: 'flex', justifyContent: 'flex-end', gap: 16, color: '#6b7280', fontSize: 16 }}>
                <EditOutlined style={{ cursor: 'pointer' }} />
                <DeleteOutlined style={{ cursor: 'pointer' }} />
              </div>
            </div>

            {/* Row 3 */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1.5fr 1fr', padding: '20px 16px', borderBottom: '1px solid #e5e7eb', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <div style={{ width: 40, height: 40, borderRadius: 8, backgroundColor: '#f3f4f6', color: '#4b5563', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
                  <MoonOutlined />
                </div>
                <div>
                  <div style={{ fontWeight: 600, color: '#1f2937' }}>22:00 - 01:00</div>
                  <div style={{ color: '#6b7280', fontSize: 12 }}>Khuya (Premium)</div>
                </div>
              </div>
              <div>
                <Input defaultValue="450,000" suffix="VNĐ" style={{ width: 140, borderRadius: 8, fontWeight: 600 }} />
              </div>
              <div>
                <span className="status-tag status-error">Bảo trì</span>
              </div>
              <div style={{ textAlign: 'right', display: 'flex', justifyContent: 'flex-end', gap: 16, color: '#6b7280', fontSize: 16 }}>
                <EditOutlined style={{ cursor: 'pointer' }} />
                <DeleteOutlined style={{ cursor: 'pointer' }} />
              </div>
            </div>

            {/* Info Box */}
            <div style={{ marginTop: 24, padding: 16, backgroundColor: '#f0fdf4', borderRadius: 12, display: 'flex', gap: 16 }}>
              <BulbFilled style={{ color: '#00a67d', fontSize: 24 }} />
              <div>
                <div style={{ color: '#1f2937', fontWeight: 600, marginBottom: 4, fontSize: 14 }}>Mẹo: Tự động phát hiện giờ cao điểm</div>
                <div style={{ color: '#4b5563', fontSize: 13, lineHeight: 1.5 }}>Hệ thống nhận thấy mật độ đặt sân cao nhất diễn ra từ 18:00 đến 20:00. Cân nhắc áp dụng thêm 10% phí cho các khung giờ này để tối ưu doanh thu.</div>
              </div>
            </div>
          </Card>

          <Card className="card-arena" bordered={false} style={{ marginTop: 24 }} bodyStyle={{ padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <div className="card-title" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ color: '#00a67d' }}>📅</div> Xem trước lịch tuần
              </div>
              <div style={{ display: 'flex', gap: 16, fontSize: 13, color: '#4b5563' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#10b981' }} /> Đã đặt</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#e5e7eb' }} /> Còn trống</div>
              </div>
            </div>

            <div style={{ display: 'flex', height: 120, border: '1px solid #e5e7eb', borderRadius: 8, overflow: 'hidden' }}>
              <div style={{ width: 60, borderRight: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '10px 0', fontSize: 10, color: '#9ca3af', textAlign: 'center' }}>
                <div>06:00</div>
                <div>12:00</div>
                <div>18:00</div>
                <div>00:00</div>
              </div>
              <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(14, 1fr)', gridTemplateRows: 'repeat(4, 1fr)', gap: 2, padding: 8, backgroundColor: '#f9fafb' }}>
                {Array.from({ length: 56 }).map((_, i) => (
                  <div key={i} style={{ 
                    backgroundColor: Math.random() > 0.4 ? '#10b981' : '#e5e7eb',
                    borderRadius: 2
                  }} />
                ))}
              </div>
            </div>
            {/* Adding plus button bottom right as in mockup */}
            <Button type="primary" shape="circle" icon={<PlusOutlined />} size="large" style={{ position: 'absolute', right: -16, top: 200, width: 48, height: 48, backgroundColor: '#00a67d' }} />
          </Card>
        </Col>
      </Row>
    </PageContainer>
  );
};

export default AdminPitches;
