import React from 'react';
import { Row, Col, Card, Typography } from 'antd';
import { StopOutlined } from '@ant-design/icons';

const { Text } = Typography;

export const ActivityLogCard: React.FC = () => {
  return (
    <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
      <Col xs={24} lg={12}>
        <div style={{ padding: 24, backgroundColor: '#ecfdf5', borderRadius: 12, border: '1px solid #a7f3d0', display: 'flex', gap: 16 }}>
          <div style={{ width: 40, height: 40, backgroundColor: '#059669', color: 'white', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
            i
          </div>
          <div>
            <div style={{ color: '#065f46', fontWeight: 700, marginBottom: 8, fontSize: 15 }}>Chính sách Quản lý Vai trò</div>
            <div style={{ color: '#047857', fontSize: 14, lineHeight: 1.5 }}>
              Lưu ý rằng việc thêm Quản trị viên mới yêu cầu xác minh hai bước. Tất cả thay đổi trạng thái (Chặn/Bỏ chặn) đều được ghi lại trong nhật ký hệ thống để tuân thủ bảo mật.
            </div>
          </div>
        </div>
      </Col>
      <Col xs={24} lg={12}>
        <Card bordered={false} bodyStyle={{ padding: 24, borderRadius: 12, border: '1px solid #f3f4f6' }}>
          <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Hoạt động gần đây</div>
          <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', backgroundColor: '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4f46e5', fontWeight: 600 }}>JD</div>
            <div>
              <div style={{ fontSize: 14 }}><Text strong>John D.</Text> đã thêm Khách hàng mới</div>
              <div style={{ fontSize: 12, color: 'gray' }}>2 phút trước</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', backgroundColor: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#dc2626' }}>
              <StopOutlined />
            </div>
            <div>
              <div style={{ fontSize: 14 }}><Text strong>Anita L.</Text> đã chặn người dùng Marcus K.</div>
              <div style={{ fontSize: 12, color: 'gray' }}>15 phút trước</div>
            </div>
          </div>
        </Card>
      </Col>
    </Row>
  );
};
