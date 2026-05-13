import React, { useState } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { Row, Col, Card, Table, Tag, Button, Space, Typography, Popconfirm, message, Tabs, Modal, Form, Input, Select, Switch } from 'antd';
import {
  StopOutlined, CheckCircleOutlined, UserAddOutlined, TeamOutlined,
  SafetyCertificateOutlined, UserOutlined, WarningOutlined,
  MailOutlined, PhoneOutlined, IdcardOutlined, LockOutlined,
} from '@ant-design/icons';
import { useModel } from '@umijs/max';

const { Title, Text } = Typography;

const AdminCustomers: React.FC = () => {
  const { users, toggleBanStatus, addUser } = useModel('adminUsers');
  const [activeTab, setActiveTab] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [form] = Form.useForm();

  const totalUsers = users.length;
  const adminCount = users.filter(u => u.role === 'Quản trị').length;
  const activeCount = users.filter(u => u.status === 'active').length;
  const bannedCount = users.filter(u => u.status === 'banned').length;

  const filteredUsers = users.filter(u => {
    if (activeTab === 'admin') return u.role === 'Quản trị';
    if (activeTab === 'customer') return u.role === 'Khách hàng';
    return true;
  });

  const handleAddUser = (values: any) => {
    addUser({
      name: values.name,
      email: values.email,
      phone: values.phone,
      role: values.role,
    });
    message.success('Thêm người dùng thành công!');
    setIsModalOpen(false);
    form.resetFields();
    setIsActive(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
    setIsActive(true);
  };

  const columns = [
    {
      title: 'HỒ SƠ',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: any) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg, #059669, #00a67d)',
            color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: 16,
          }}>
            {text.substring(0, 1)}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <Text strong style={{ color: '#1f2937' }}>{text}</Text>
            <Text type="secondary" style={{ fontSize: 12 }}>{record.email}</Text>
          </div>
        </div>
      )
    },
    {
      title: 'SỐ ĐIỆN THOẠI',
      dataIndex: 'phone',
      key: 'phone',
      render: (text: string) => <Text style={{ color: '#4b5563' }}>{text}</Text>
    },
    {
      title: 'VAI TRÒ',
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => (
        <Tag color={role === 'Quản trị' ? 'blue' : 'default'} style={{ borderRadius: 12, padding: '2px 10px' }}>
          {role}
        </Tag>
      )
    },
    {
      title: 'TRẠNG THÁI',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: status === 'active' ? '#059669' : '#dc2626', fontWeight: 600 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: status === 'active' ? '#059669' : '#dc2626' }} />
          {status === 'active' ? 'Hoạt động' : 'Bị chặn'}
        </div>
      )
    },
    {
      title: 'THAO TÁC',
      key: 'action',
      render: (_: any, record: any) => (
        <Space size="middle">
          <Popconfirm
            title={record.status === 'active' ? "Chặn người dùng này?" : "Bỏ chặn người dùng này?"}
            onConfirm={() => {
              toggleBanStatus(record.id);
              message.success(record.status === 'active' ? 'Đã chặn người dùng' : 'Đã bỏ chặn người dùng');
            }}
            okText="Đồng ý"
            cancelText="Hủy"
          >
            <Button danger={record.status === 'active'} type="text" icon={record.status === 'active' ? <StopOutlined /> : <CheckCircleOutlined />}>
              {record.status === 'active' ? 'Khóa' : 'Mở khóa'}
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  // ─── Nội dung form bên phải ───────────────────────────────────────────────
  const formContent = (
    <Form form={form} layout="vertical" onFinish={handleAddUser} style={{ padding: '32px 32px 8px' }}>
      {/* Hàng 1: Họ tên + SĐT */}
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="name"
            label={
              <span style={{ fontWeight: 600, color: '#374151', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
                <IdcardOutlined style={{ color: '#059669' }} /> Họ và tên
              </span>
            }
            rules={[{ required: true, message: 'Vui lòng nhập tên' }]}
          >
            <Input
              placeholder="Nguyễn Văn An"
              size="large"
              style={{ borderRadius: 10, borderColor: '#d1d5db' }}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="phone"
            label={
              <span style={{ fontWeight: 600, color: '#374151', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
                <PhoneOutlined style={{ color: '#059669' }} /> Số điện thoại
              </span>
            }
            rules={[{ required: true, message: 'Vui lòng nhập SĐT' }]}
          >
            <Input
              placeholder="0901 234 567"
              size="large"
              style={{ borderRadius: 10, borderColor: '#d1d5db' }}
            />
          </Form.Item>
        </Col>
      </Row>

      {/* Email */}
      <Form.Item
        name="email"
        label={
          <span style={{ fontWeight: 600, color: '#374151', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
            <MailOutlined style={{ color: '#059669' }} /> Địa chỉ Email
          </span>
        }
        rules={[{ required: true, type: 'email', message: 'Vui lòng nhập email hợp lệ' }]}
      >
        <Input
          placeholder="example@turfmanager.vn"
          size="large"
          style={{ borderRadius: 10, borderColor: '#d1d5db' }}
        />
      </Form.Item>

      {/* Vai trò + Trạng thái */}
      <Row gutter={16} align="bottom">
        <Col span={14}>
          <Form.Item
            name="role"
            initialValue="Khách hàng"
            label={
              <span style={{ fontWeight: 600, color: '#374151', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
                <UserOutlined style={{ color: '#059669' }} /> Vai trò
              </span>
            }
          >
            <Select size="large" style={{ borderRadius: 10 }}>
              <Select.Option value="Khách hàng">Khách hàng</Select.Option>
              <Select.Option value="Quản trị">Quản trị viên</Select.Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={10}>
          <Form.Item
            label={
              <span style={{ fontWeight: 600, color: '#374151', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
                <CheckCircleOutlined style={{ color: '#059669' }} /> Trạng thái
              </span>
            }
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingBottom: 2 }}>
              <Switch
                checked={isActive}
                onChange={setIsActive}
                style={{ backgroundColor: isActive ? '#059669' : '#d1d5db' }}
              />
              <Text style={{ fontWeight: 600, color: isActive ? '#059669' : '#6b7280', fontSize: 14 }}>
                {isActive ? 'Đang hoạt động' : 'Không hoạt động'}
              </Text>
            </div>
          </Form.Item>
        </Col>
      </Row>

      {/* Mật khẩu */}
      <Form.Item
        name="password"
        label={
          <span style={{ fontWeight: 600, color: '#374151', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
            <LockOutlined style={{ color: '#059669' }} /> Mật khẩu mặc định
          </span>
        }
      >
        <Input.Password
          placeholder="Để trống để tự động tạo"
          size="large"
          style={{ borderRadius: 10, borderColor: '#d1d5db' }}
        />
      </Form.Item>

      {/* Footer */}
      <div style={{
        marginTop: 8, paddingTop: 20,
        borderTop: '1px solid #f3f4f6',
        display: 'flex', justifyContent: 'flex-end', gap: 12,
      }}>
        <Button
          size="large"
          onClick={handleCancel}
          style={{ borderRadius: 10, height: 44, padding: '0 24px', fontWeight: 600, color: '#374151', borderColor: '#d1d5db' }}
        >
          Hủy bỏ
        </Button>
        <Button
          type="primary"
          htmlType="submit"
          size="large"
          icon={<UserAddOutlined />}
          style={{
            backgroundColor: '#059669', borderColor: '#059669',
            borderRadius: 10, height: 44, padding: '0 28px', fontWeight: 700,
            boxShadow: '0 4px 12px rgba(5,150,105,0.3)',
          }}
        >
          Lưu thay đổi
        </Button>
      </div>
    </Form>
  );

  return (
    <PageContainer
      header={{
        title: (
          <div>
            <div style={{ fontWeight: 800, fontSize: 22, color: '#0f172a' }}>Quản lý Người dùng</div>
            <Text style={{ color: '#94a3b8', fontSize: 13 }}>Quản lý phân quyền, theo dõi hoạt động và cấu hình truy cập</Text>
          </div>
        ),
        extra: [
          <Button key="export" style={{ borderRadius: 10, height: 40, fontWeight: 600 }}>Xuất PDF</Button>,
          <Button key="add" type="primary" icon={<UserAddOutlined />} style={{ height: 40, padding: '0 20px', fontWeight: 700 }} onClick={() => setIsModalOpen(true)}>
            Thêm người dùng
          </Button>
        ]
      }}
    >
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <div style={{ background: 'linear-gradient(135deg, #059669 0%, #047857 100%)', borderRadius: 16, padding: '20px 22px', color: 'white', boxShadow: '0 4px 20px rgba(5,150,105,0.25)', position: 'relative', overflow: 'hidden' }} className="admin-stat-card">
            <div style={{ position: 'absolute', right: -12, bottom: -12, width: 80, height: 80, borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.08)' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <TeamOutlined style={{ fontSize: 20, color: '#fff' }} />
              </div>
              <div style={{ background: 'rgba(255,255,255,0.15)', padding: '3px 8px', borderRadius: 8, fontWeight: 700, fontSize: 11, color: '#a7f3d0' }}>+12% ↗</div>
            </div>
            <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Tổng người dùng</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: '#fff' }}>{totalUsers.toLocaleString()}</div>
          </div>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <div style={{ background: 'white', borderRadius: 16, padding: '20px 22px', border: '1px solid #e2e8f0', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', position: 'relative', overflow: 'hidden' }} className="admin-stat-card">
            <div style={{ position: 'absolute', right: -12, bottom: -12, width: 80, height: 80, borderRadius: '50%', backgroundColor: '#e0e7ff18' }} />
            <div style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: '#e0e7ff', color: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
              <SafetyCertificateOutlined style={{ fontSize: 20 }} />
            </div>
            <div style={{ color: '#64748b', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Quản trị viên</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: '#0f172a' }}>{adminCount}</div>
          </div>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <div style={{ background: 'white', borderRadius: 16, padding: '20px 22px', border: '1px solid #e2e8f0', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', position: 'relative', overflow: 'hidden' }} className="admin-stat-card">
            <div style={{ position: 'absolute', right: -12, bottom: -12, width: 80, height: 80, borderRadius: '50%', backgroundColor: '#dcfce718' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: '#dcfce7', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <UserOutlined style={{ fontSize: 20 }} />
              </div>
              <div style={{ background: '#dcfce7', padding: '3px 8px', borderRadius: 8, fontWeight: 700, fontSize: 11, color: '#15803d' }}>98% ↗</div>
            </div>
            <div style={{ color: '#64748b', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Đang hoạt động</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: '#0f172a' }}>{activeCount.toLocaleString()}</div>
          </div>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <div style={{ background: 'white', borderRadius: 16, padding: '20px 22px', border: '1px solid #e2e8f0', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', position: 'relative', overflow: 'hidden' }} className="admin-stat-card">
            <div style={{ position: 'absolute', right: -12, bottom: -12, width: 80, height: 80, borderRadius: '50%', backgroundColor: '#fee2e218' }} />
            <div style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: '#fee2e2', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
              <WarningOutlined style={{ fontSize: 20 }} />
            </div>
            <div style={{ color: '#64748b', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Bị chặn</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: '#dc2626' }}>{bannedCount}</div>
          </div>
        </Col>
      </Row>

      <Card bordered={false} bodyStyle={{ padding: '16px 24px', borderRadius: 12, boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            { key: 'all', label: 'Tất cả người dùng' },
            { key: 'admin', label: 'Quản trị viên' },
            { key: 'customer', label: 'Khách hàng' }
          ]}
          tabBarStyle={{ marginBottom: 0, borderBottom: '1px solid #f0f0f0' }}
        />
        <div style={{ paddingTop: 16 }}>
          <Table
            columns={columns}
            dataSource={filteredUsers}
            rowKey="id"
            pagination={{ pageSize: 5 }}
            className="custom-table"
          />
        </div>
      </Card>

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

      {/* ── Modal Thêm người dùng – thiết kế 2 panel ── */}
      <Modal
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        width={700}
        style={{ top: 60 }}
        styles={{ body: { padding: 0 } }}
        closeIcon={
          <span style={{ fontSize: 18, color: '#9ca3af', lineHeight: 1 }}>✕</span>
        }
      >
        <div style={{ display: 'flex', borderRadius: 12, overflow: 'hidden', minHeight: 500 }}>
          {/* Panel trái – xanh lá */}
          <div style={{
            width: 200, minWidth: 200,
            background: 'linear-gradient(160deg, #059669 0%, #047857 100%)',
            padding: '36px 24px',
            display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
          }}>
            <div>
              <div style={{
                width: 48, height: 48, borderRadius: 12,
                backgroundColor: 'rgba(255,255,255,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 20,
              }}>
                <UserAddOutlined style={{ fontSize: 24, color: '#fff' }} />
              </div>
              <div style={{ color: '#fff', fontSize: 18, fontWeight: 800, lineHeight: 1.3, marginBottom: 12 }}>
                Thông tin người dùng
              </div>
              <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: 13, lineHeight: 1.6 }}>
                Vui lòng điền đầy đủ các thông tin bên dưới để cập nhật hệ thống.
              </div>
            </div>
            <div style={{
              padding: '12px 14px',
              backgroundColor: 'rgba(255,255,255,0.12)',
              borderRadius: 10, border: '1px solid rgba(255,255,255,0.15)',
            }}>
              <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11, marginBottom: 4 }}>ℹ️ Lưu ý</div>
              <div style={{ color: '#fff', fontSize: 12, lineHeight: 1.5 }}>
                Quản trị viên mới yêu cầu xác minh hai bước.
              </div>
            </div>
          </div>

          {/* Panel phải – form */}
          <div style={{ flex: 1, backgroundColor: '#fff' }}>
            {formContent}
          </div>
        </div>
      </Modal>

    </PageContainer>
  );
};

export default AdminCustomers;
