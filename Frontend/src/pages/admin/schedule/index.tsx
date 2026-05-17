import React, { useState } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { Row, Col, Card, Typography, Button, Space, Select, DatePicker } from 'antd';
import {
  CalendarOutlined, FilterOutlined, PlusOutlined, AreaChartOutlined, MoneyCollectOutlined, FieldTimeOutlined, CheckCircleOutlined
} from '@ant-design/icons';
import { useModel } from '@umijs/max';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

const AdminScheduleGrid: React.FC = () => {
  const { bookings } = useModel('adminBookings');
  const { pitches } = useModel('adminPitches');

  // Hardcode time slots for demo: 06:00 to 10:00
  const timeSlots = ['06:00', '07:00', '08:00', '09:00', '10:00'];
  
  // Calculate stats
  const totalBookings = bookings.length;
  const occupancyRate = 78.5; // Demo percentage
  const expectedRevenue = bookings.reduce((sum, b) => sum + (b.price || 0), 0);
  const unpaidBookings = bookings.filter(b => b.status === 'pending').length; // Map pending to unpaid

  return (
    <PageContainer
      header={{
        title: <Title level={2} style={{ margin: 0, fontWeight: 700, color: '#00a67d' }}>Lịch đặt sân chi tiết</Title>,
        subTitle: (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 12px', backgroundColor: '#f3f4f6', borderRadius: 16, marginTop: 8 }}>
            <CalendarOutlined style={{ color: '#4b5563' }} />
            <Text style={{ color: '#4b5563', fontWeight: 600 }}>Thứ Ba, 24 Tháng 10, 2023</Text>
          </div>
        ),
        extra: [
          <Button key="add" type="primary" icon={<PlusOutlined />} style={{ backgroundColor: '#00a67d', borderRadius: 8, fontWeight: 600, padding: '0 20px', height: 40 }}>
            Đặt sân mới
          </Button>
        ]
      }}
    >
      {/* Top Filter Bar */}
      <Card bordered={false} bodyStyle={{ padding: '16px 24px', borderRadius: 12, border: '1px solid #e5e7eb', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }} style={{ marginBottom: 24 }}>
        <Row gutter={24} align="bottom">
          <Col span={6}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#4b5563', marginBottom: 8 }}>Ngày xem lịch</div>
            <DatePicker defaultValue={dayjs('2023-10-24')} style={{ width: '100%', height: 40, borderRadius: 8 }} format="DD/MM/YYYY" />
          </Col>
          <Col span={6}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#4b5563', marginBottom: 8 }}>Chọn khu vực sân</div>
            <Select defaultValue="all" style={{ width: '100%', height: 40 }} options={[{ value: 'all', label: 'Tất cả các sân' }]} />
          </Col>
          <Col span={6}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#4b5563', marginBottom: 8 }}>Trạng thái thanh toán</div>
            <Select defaultValue="all" style={{ width: '100%', height: 40 }} options={[{ value: 'all', label: 'Tất cả trạng thái' }]} />
          </Col>
          <Col span={6}>
            <Button icon={<FilterOutlined />} style={{ width: '100%', height: 40, borderRadius: 8, backgroundColor: '#e0e7ff', color: '#4f46e5', border: 'none', fontWeight: 600 }}>
              Lọc kết quả
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Grid Timeline */}
      <Card bordered={false} bodyStyle={{ padding: 0 }} style={{ borderRadius: 12, border: '1px solid #e5e7eb', overflow: 'hidden', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24, padding: '16px 24px', borderBottom: '1px solid #e5e7eb', backgroundColor: '#f9fafb' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600, color: '#4b5563' }}><div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#10b981' }} /> Đã cọc</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600, color: '#4b5563' }}><div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#f87171' }} /> Chưa thanh toán</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600, color: '#4b5563' }}><div style={{ width: 12, height: 12, borderRadius: '50%', border: '2px solid #9ca3af', backgroundColor: 'transparent' }} /> Trống</div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <div style={{ minWidth: 800 }}>
            {/* Headers */}
            <div style={{ display: 'flex', borderBottom: '1px solid #e5e7eb', backgroundColor: '#e0e7ff' }}>
              <div style={{ width: 160, padding: 16, borderRight: '1px solid #c7d2fe', fontWeight: 800, color: '#3730a3', fontSize: 13 }}>SÂN /<br/>GIỜ</div>
              {timeSlots.map(t => (
                <div key={t} style={{ flex: 1, padding: 16, borderRight: '1px solid #c7d2fe', textAlign: 'center', fontWeight: 600, color: '#1f2937' }}>{t}</div>
              ))}
            </div>

            {/* Rows */}
            {/* Sân A1 */}
            <div style={{ display: 'flex', borderBottom: '1px solid #e5e7eb', position: 'relative', height: 80 }}>
              <div style={{ width: 160, padding: 16, borderRight: '1px solid #e5e7eb', backgroundColor: '#f9fafb' }}>
                <div style={{ fontWeight: 800, color: '#1f2937', fontSize: 15 }}>Sân A1</div>
                <div style={{ fontSize: 10, fontWeight: 700, color: '#059669', textTransform: 'uppercase' }}>Sân 5 người</div>
              </div>
              <div style={{ flex: 1, borderRight: '1px solid #e5e7eb' }} />
              <div style={{ flex: 1, borderRight: '1px solid #e5e7eb' }} />
              <div style={{ flex: 1, borderRight: '1px solid #e5e7eb' }} />
              <div style={{ flex: 1, borderRight: '1px solid #e5e7eb' }} />
              <div style={{ flex: 1, borderRight: '1px solid #e5e7eb' }} />
              
              {/* Event Block (08:00 -> 09:30, approx left: 160+2*flex, width: 1.5*flex) */}
              <div style={{ position: 'absolute', left: 'calc(160px + 40% + 4px)', top: 4, height: 72, width: 'calc(30% - 8px)', backgroundColor: '#10b981', borderRadius: 6, padding: '8px 12px', color: 'white', overflow: 'hidden' }}>
                <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 2 }}>Nguyễn Văn A</div>
                <div style={{ fontSize: 11, display: 'flex', alignItems: 'center', gap: 4 }}><div style={{ width: 12, height: 12, borderRadius: '50%', border: '2px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><CheckCircleOutlined style={{ fontSize: 8 }}/></div> Đã cọc</div>
              </div>
            </div>

            {/* Sân A2 */}
            <div style={{ display: 'flex', borderBottom: '1px solid #e5e7eb', position: 'relative', height: 80 }}>
              <div style={{ width: 160, padding: 16, borderRight: '1px solid #e5e7eb', backgroundColor: '#f9fafb' }}>
                <div style={{ fontWeight: 800, color: '#1f2937', fontSize: 15 }}>Sân A2</div>
                <div style={{ fontSize: 10, fontWeight: 700, color: '#059669', textTransform: 'uppercase' }}>Sân 5 người</div>
              </div>
              <div style={{ flex: 1, borderRight: '1px solid #e5e7eb' }} />
              <div style={{ flex: 1, borderRight: '1px solid #e5e7eb' }} />
              <div style={{ flex: 1, borderRight: '1px solid #e5e7eb' }} />
              <div style={{ flex: 1, borderRight: '1px solid #e5e7eb' }} />
              <div style={{ flex: 1, borderRight: '1px solid #e5e7eb' }} />
              
              {/* Event Block (10:00 -> ..., approx left: 160+4*flex, width: 1*flex) */}
              <div style={{ position: 'absolute', left: 'calc(160px + 80% + 4px)', top: 4, height: 72, width: 'calc(20% - 8px)', backgroundColor: '#059669', borderRadius: 6, padding: '8px 12px', color: 'white', overflow: 'hidden' }}>
                <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 2, whiteSpace: 'nowrap' }}>CLB Phóng Viên</div>
                <div style={{ fontSize: 11, display: 'flex', alignItems: 'center', gap: 4, whiteSpace: 'nowrap' }}><div style={{ width: 12, height: 12, borderRadius: '50%', border: '2px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><CheckCircleOutlined style={{ fontSize: 8 }}/></div> Đã cọc (Đã TT 50%)</div>
              </div>
            </div>

            {/* Sân B1 */}
            <div style={{ display: 'flex', borderBottom: '1px solid #e5e7eb', position: 'relative', height: 80 }}>
              <div style={{ width: 160, padding: 16, borderRight: '1px solid #e5e7eb', backgroundColor: '#f9fafb' }}>
                <div style={{ fontWeight: 800, color: '#1f2937', fontSize: 15 }}>Sân B1</div>
                <div style={{ fontSize: 10, fontWeight: 700, color: '#1d4ed8', textTransform: 'uppercase' }}>Sân 7 người</div>
              </div>
              <div style={{ flex: 1, borderRight: '1px solid #e5e7eb' }} />
              <div style={{ flex: 1, borderRight: '1px solid #e5e7eb' }} />
              <div style={{ flex: 1, borderRight: '1px solid #e5e7eb' }} />
              <div style={{ flex: 1, borderRight: '1px solid #e5e7eb' }} />
              <div style={{ flex: 1, borderRight: '1px solid #e5e7eb' }} />
              
              {/* Event Block (07:00 -> 09:00, approx left: 160+1*flex, width: 2*flex) */}
              <div style={{ position: 'absolute', left: 'calc(160px + 20% + 4px)', top: 4, height: 72, width: 'calc(40% - 8px)', backgroundColor: '#f87171', borderRadius: 6, padding: '8px 12px', color: 'white', overflow: 'hidden', boxShadow: 'inset 4px 0 0 #b91c1c' }}>
                <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 2 }}>FC Đoàn Kết</div>
                <div style={{ fontSize: 11, display: 'flex', alignItems: 'center', gap: 4 }}>❗ Đặt chỗ qua app</div>
              </div>
            </div>

            {/* Sân B2 */}
            <div style={{ display: 'flex', position: 'relative', height: 80 }}>
              <div style={{ width: 160, padding: 16, borderRight: '1px solid #e5e7eb', backgroundColor: '#f9fafb' }}>
                <div style={{ fontWeight: 800, color: '#1f2937', fontSize: 15 }}>Sân B2</div>
                <div style={{ fontSize: 10, fontWeight: 700, color: '#1d4ed8', textTransform: 'uppercase' }}>Sân 7 người</div>
              </div>
              <div style={{ flex: 1, borderRight: '1px solid #e5e7eb' }} />
              <div style={{ flex: 1, borderRight: '1px solid #e5e7eb' }} />
              <div style={{ flex: 1, borderRight: '1px solid #e5e7eb' }} />
              <div style={{ flex: 1, borderRight: '1px solid #e5e7eb' }} />
              <div style={{ flex: 1, borderRight: '1px solid #e5e7eb' }} />
            </div>

          </div>
        </div>
      </Card>

      {/* Bottom Stats */}
      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} bodyStyle={{ padding: 20, borderRadius: 12, border: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', gap: 16, boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', backgroundColor: '#059669', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
              <CalendarOutlined />
            </div>
            <div>
              <div style={{ color: '#4b5563', fontSize: 12, fontWeight: 600 }}>Tổng lượt đặt hôm nay</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: '#1f2937' }}>24 lượt</div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} bodyStyle={{ padding: 20, borderRadius: 12, border: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', gap: 16, boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', backgroundColor: '#e0e7ff', color: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
              <AreaChartOutlined />
            </div>
            <div>
              <div style={{ color: '#4b5563', fontSize: 12, fontWeight: 600 }}>Tỷ lệ lấp đầy</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: '#1f2937' }}>{occupancyRate}%</div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} bodyStyle={{ padding: 20, borderRadius: 12, border: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', gap: 16, boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', backgroundColor: '#fee2e2', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
              <MoneyCollectOutlined />
            </div>
            <div>
              <div style={{ color: '#4b5563', fontSize: 12, fontWeight: 600 }}>Doanh thu dự kiến</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: '#1f2937' }}>{(8400000).toLocaleString()} VNĐ</div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} bodyStyle={{ padding: 20, borderRadius: 12, border: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', gap: 16, boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', backgroundColor: '#f3f4f6', color: '#4b5563', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
              <FieldTimeOutlined />
            </div>
            <div>
              <div style={{ color: '#4b5563', fontSize: 12, fontWeight: 600 }}>Lượt chưa thanh toán</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: '#dc2626' }}>05 lượt</div>
            </div>
          </Card>
        </Col>
      </Row>

    </PageContainer>
  );
};

export default AdminScheduleGrid;
