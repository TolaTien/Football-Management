import React from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { Card, Table, Typography, Button, Row, Col, Tabs } from 'antd';
import {
  UserOutlined,
  SafetyCertificateOutlined,
  CheckCircleOutlined,
  StopOutlined,
  FilePdfOutlined,
  UserAddOutlined,
  FilterOutlined,
  InfoCircleFilled,
} from '@ant-design/icons';

const { Title, Text } = Typography;

const mockUsers = [
  { id: '1', name: 'Johnathan Doe', email: 'john.doe@arena-manager.com', phone: '+84 123 456 789', role: 'Quản trị', status: 'Hoạt động', avatarUrl: 'https://i.pravatar.cc/150?u=1' },
  { id: '2', name: 'Sarah Rodriguez', email: 'sarah.r@gmail.com', phone: '+84 987 654 321', role: 'Khách hàng', status: 'Hoạt động', avatarUrl: 'https://i.pravatar.cc/150?u=2' },
  { id: '3', name: 'Marcus Knight', email: 'm.knight@academy.com', phone: '+84 444 221 100', role: 'Khách hàng', status: 'Bị chặn', avatarUrl: 'https://i.pravatar.cc/150?u=3' },
];

const columns = [
  { 
    title: 'HỒ SƠ', 
    key: 'profile',
    render: (record: any) => (
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <img src={record.avatarUrl} alt="avatar" style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }} />
        <div>
          <div style={{ fontWeight: 600, color: '#1f2937', fontSize: 14 }}>{record.name}</div>
          <div style={{ color: '#6b7280', fontSize: 12 }}>{record.email}</div>
        </div>
      </div>
    )
  },
  { title: 'SỐ ĐIỆN THOẠI', dataIndex: 'phone', key: 'phone', render: (text: string) => <span style={{ color: '#4b5563' }}>{text}</span> },
  { 
    title: 'VAI TRÒ', 
    dataIndex: 'role', 
    key: 'role',
    render: (text: string) => (
      <span style={{ backgroundColor: '#f3f4f6', color: '#4b5563', padding: '4px 12px', borderRadius: 16, fontSize: 12, fontWeight: 500 }}>
        {text}
      </span>
    )
  },
  {
    title: 'TRẠNG THÁI',
    dataIndex: 'status',
    key: 'status',
    render: (status: string) => (
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600, color: status === 'Hoạt động' ? '#059669' : '#dc2626' }}>
        <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: status === 'Hoạt động' ? '#059669' : '#dc2626' }} />
        {status}
      </div>
    ),
  },
  {
    title: 'THAO TÁC',
    key: 'action',
    render: () => <div style={{ color: '#00a67d', cursor: 'pointer', fontWeight: 500 }}>•••</div>
  }
];

const AdminCustomers: React.FC = () => {
  return (
    <PageContainer
      header={{
        title: <Title level={2} style={{ margin: 0, fontWeight: 700 }}>Quản lý người dùng</Title>,
        subTitle: <Text style={{ color: '#6b7280', fontSize: 14, display: 'block', marginTop: 4 }}>Quản lý phân quyền, theo dõi hoạt động và cấu hình truy cập cho nhân viên và khách hàng.</Text>,
        extra: [
          <Button key="pdf" icon={<FilePdfOutlined />} size="large" style={{ borderRadius: 8 }}>Xuất PDF</Button>,
          <Button key="add" type="primary" icon={<UserAddOutlined />} size="large" style={{ backgroundColor: '#00a67d', borderRadius: 8 }}>Thêm người dùng mới</Button>,
        ],
      }}
    >
      {/* Top 4 Stat Cards */}
      <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card className="card-arena" bordered={false} bodyStyle={{ padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <div className="stat-icon-wrapper" style={{ background: '#d1fae5', color: '#059669' }}>
                <UserOutlined />
              </div>
              <Text style={{ color: '#059669', fontWeight: 600 }}>+12% ↗</Text>
            </div>
            <Text style={{ color: '#6b7280', fontSize: 13, fontWeight: 500 }}>Tổng người dùng</Text>
            <Title level={3} style={{ margin: '4px 0 0', fontWeight: 700, fontSize: 32 }}>1,284</Title>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="card-arena" bordered={false} bodyStyle={{ padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <div className="stat-icon-wrapper" style={{ background: '#e0e7ff', color: '#4f46e5' }}>
                <SafetyCertificateOutlined />
              </div>
            </div>
            <Text style={{ color: '#6b7280', fontSize: 13, fontWeight: 500 }}>Quản trị viên</Text>
            <Title level={3} style={{ margin: '4px 0 0', fontWeight: 700, fontSize: 32 }}>24</Title>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="card-arena" bordered={false} bodyStyle={{ padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <div className="stat-icon-wrapper" style={{ background: '#d1fae5', color: '#059669' }}>
                <CheckCircleOutlined />
              </div>
            </div>
            <Text style={{ color: '#6b7280', fontSize: 13, fontWeight: 500 }}>Đang hoạt động</Text>
            <Title level={3} style={{ margin: '4px 0 0', fontWeight: 700, fontSize: 32 }}>1,210</Title>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="card-arena" bordered={false} bodyStyle={{ padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <div className="stat-icon-wrapper" style={{ background: '#fee2e2', color: '#dc2626' }}>
                <StopOutlined />
              </div>
            </div>
            <Text style={{ color: '#6b7280', fontSize: 13, fontWeight: 500 }}>Bị chặn</Text>
            <Title level={3} style={{ margin: '4px 0 0', fontWeight: 700, fontSize: 32 }}>12</Title>
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]}>
        {/* Main Users Table */}
        <Col xs={24} lg={16}>
          <Card className="card-arena" bordered={false} bodyStyle={{ padding: '0' }}>
            <Tabs 
              defaultActiveKey="1" 
              tabBarExtraContent={<Button type="text" icon={<FilterOutlined />}>Bộ lọc nâng cao</Button>}
              style={{ padding: '0 24px' }}
              items={[
                { label: 'Tất cả người dùng', key: '1' },
                { label: 'Quản trị viên', key: '2' },
                { label: 'Khách hàng', key: '3' },
              ]}
            />
            <Table 
              columns={columns} 
              dataSource={mockUsers} 
              pagination={{ 
                total: 1284,
                showTotal: (total, range) => `Đang hiển thị ${range[0]}-${range[1]} trong số ${total} người dùng`,
                style: { padding: '16px 24px', margin: 0, backgroundColor: '#f9fafb', borderBottomLeftRadius: 12, borderBottomRightRadius: 12 }
              }} 
            />
          </Card>

          {/* Info Box */}
          <div style={{ marginTop: 24, padding: 24, backgroundColor: '#ecfdf5', borderRadius: 12, display: 'flex', gap: 16, border: '1px solid #a7f3d0' }}>
            <InfoCircleFilled style={{ color: '#00a67d', fontSize: 24, marginTop: 4 }} />
            <div>
              <div style={{ color: '#047857', fontWeight: 600, marginBottom: 4, fontSize: 16 }}>Chính sách Quản lý Vai trò</div>
              <div style={{ color: '#065f46', fontSize: 14, lineHeight: 1.6 }}>Lưu ý rằng việc thêm Quản trị viên mới yêu cầu xác minh hai bước. Tất cả thay đổi trạng thái (Chặn/Bỏ chặn) đều được ghi lại trong nhật ký hệ thống để tuân thủ bảo mật.</div>
            </div>
          </div>
        </Col>

        {/* Right Sidebar */}
        <Col xs={24} lg={8}>
          <Card className="card-arena" bordered={false} bodyStyle={{ padding: 24 }}>
            <div className="card-title">Hoạt động gần đây</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <div style={{ display: 'flex', gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', backgroundColor: '#e0e7ff', color: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <UserOutlined />
                </div>
                <div>
                  <div style={{ fontSize: 14, color: '#1f2937' }}><span style={{ fontWeight: 600 }}>John D.</span> đã thêm Khách hàng mới 2 phút trước</div>
                  <div style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>vài giây trước</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', backgroundColor: '#fee2e2', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <StopOutlined />
                </div>
                <div>
                  <div style={{ fontSize: 14, color: '#1f2937' }}><span style={{ fontWeight: 600 }}>Anita L.</span> đã chặn người dùng Marcus K.</div>
                  <div style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>15 phút trước</div>
                </div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </PageContainer>
  );
};

export default AdminCustomers;
