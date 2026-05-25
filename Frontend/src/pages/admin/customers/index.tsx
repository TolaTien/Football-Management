import React, { useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { Card, Table, Tag, Button, Space, Typography, Popconfirm, message, Tabs } from 'antd';
import { StopOutlined, CheckCircleOutlined, UserAddOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '@/shared/model/hooks';
import { fetchUsers, addUser, toggleBanUser } from '@/entities/user/model/userSlice';
import type { UserItem, UserRole } from '@/entities/user/model/types';
import AddUserModal from './components/AddUserModal';
import { UserStatCards } from './components/UserStatCards';
import { ActivityLogCard } from './components/ActivityLogCard';

const { Text } = Typography;

const AdminCustomers: React.FC = () => {
  const dispatch = useAppDispatch();
  const { users } = useAppSelector((state) => state.user);
  const [activeTab, setActiveTab] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const totalUsers = users.length;
  const adminCount = users.filter(u => u.role === 'Quản trị').length;
  const activeCount = users.filter(u => u.status === 'active').length;
  const bannedCount = users.filter(u => u.status === 'banned').length;

  const filteredUsers = users.filter(u => {
    if (activeTab === 'admin') return u.role === 'Quản trị';
    if (activeTab === 'customer') return u.role === 'Khách hàng';
    return true;
  });

  const handleAddUser = (values: { name: string; email: string; phone: string; role: UserRole; password?: string }) => {
    dispatch(addUser({
      name: values.name,
      email: values.email,
      phone: values.phone,
      role: values.role,
    }));
    setIsModalOpen(false);
  };

  const columns = [
    {
      title: 'HỒ SƠ',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: UserItem) => (
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
      render: (_: unknown, record: UserItem) => (
        <Space size="middle">
          <Popconfirm
            title={record.status === 'active' ? "Chặn người dùng này?" : "Bỏ chặn người dùng này?"}
            onConfirm={() => {
              dispatch(toggleBanUser({ userId: record.id, status: record.status }));
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
      <UserStatCards
        totalUsers={totalUsers}
        adminCount={adminCount}
        activeCount={activeCount}
        bannedCount={bannedCount}
      />

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

      <ActivityLogCard />

      <AddUserModal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onConfirm={handleAddUser}
      />
    </PageContainer>
  );
};

export default AdminCustomers;