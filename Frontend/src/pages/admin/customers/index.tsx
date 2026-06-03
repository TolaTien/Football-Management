import React, { useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { Card, Table, Tag, Button, Space, Typography, Popconfirm, Tabs, message, Avatar } from 'antd';
import { StopOutlined, CheckCircleOutlined, UserAddOutlined, EditOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { fetchUsers, addUser, toggleBanUser, updateUser } from '@/entities/user/model/userSlice';
import type { UserItem, UserRole } from '@/entities/user/model/types';
import { AddUserModal, EditUserModal } from '@/features/manage-user';
import { UserStatCards } from '@/widgets/admin-user-stats';

const { Text } = Typography;

const AdminCustomers: React.FC = () => {
  const dispatch = useAppDispatch();
  const { users } = useAppSelector((state) => state.user);
  const [activeTab, setActiveTab] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserItem | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

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

  // Hàm xử lý khi THÊM mới người dùng
  const handleAddUser = (values: { name: string; email: string; phone: string; role: UserRole; password?: string }) => {
    dispatch(addUser({
      name: values.name,
      email: values.email,
      phone: values.phone,
      role: values.role,
      password: values.password,
    }));
    setIsModalOpen(false);
  };

  // Hàm xử lý khi CẬP NHẬT thông tin người dùng
  const handleEditUser = (values: { name: string; email: string; phone: string; role: UserRole; password?: string }) => {
    if (selectedUser) {
      dispatch(updateUser({
        userId: selectedUser.id,
        userData: values
      })).then(() => {
        message.success('Cập nhật thông tin người dùng thành công!');
      });
    }
    setIsEditModalOpen(false);
    setSelectedUser(null);
  };


  const columns = [
    {
      title: 'HỒ SƠ',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: UserItem) => {
        // Tạo ảnh hoạt hình dự phòng dựa trên email của user giống trang client
        const displayAvatar = record.avt || `https://api.dicebear.com/7.x/avataaars/svg?seed=${record.email || 'default'}`;

        return (
          <div className="flex items-center gap-3">
            <Avatar
              src={displayAvatar}
              alt={text}
              size={40}
              className="shadow-sm border border-slate-100 bg-slate-50"
            />
            <div className="flex flex-col">
              <Text className="font-semibold text-slate-800">{text}</Text>
              <Text type="secondary" className="text-xs">{record.email}</Text>
            </div>
          </div>
        );
      }
    },


    {
      title: 'SỐ ĐIỆN THOẠI',
      dataIndex: 'phone',
      key: 'phone',
      render: (text: string) => <Text className="text-slate-650">{text}</Text>
    },
    {
      title: 'VAI TRÒ',
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => (
        <Tag color={role === 'Quản trị' ? 'blue' : 'default'} className="rounded-full px-3 py-0.5 border-none font-semibold">
          {role}
        </Tag>
      )
    },
    {
      title: 'TRẠNG THÁI',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <div className={`flex items-center gap-1.5 font-semibold text-xs ${status === 'active' ? 'text-emerald-600' : 'text-red-600'}`}>
          <div className={`w-2 h-2 rounded-full ${status === 'active' ? 'bg-emerald-605' : 'bg-red-500'}`} />
          {status === 'active' ? 'Hoạt động' : 'Bị chặn'}
        </div>
      )
    },
    {
      title: 'THAO TÁC',
      key: 'action',
      render: (_: unknown, record: UserItem) => (
        <Space size="middle">
          {/* Nút chỉnh sửa mới thêm */}
          <Button
            type="text"
            icon={<EditOutlined className="text-emerald-600" />}
            onClick={() => {
              setSelectedUser(record);
              setIsEditModalOpen(true);
            }}
          >
            Sửa
          </Button>
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
            <div className="font-extrabold text-2xl text-slate-800 tracking-tight">Quản lý Người dùng</div>
            <Text className="text-slate-400 text-xs mt-1 block">Quản lý phân quyền, theo dõi hoạt động và cấu hình truy cập</Text>
          </div>
        ),
        extra: [
          <Button key="export" className="rounded-xl h-10 px-5 font-bold border-slate-300 hover:border-emerald-500 hover:text-emerald-600 transition-colors shadow-sm">Xuất PDF</Button>,
          <Button key="add" type="primary" icon={<UserAddOutlined />} className="h-10 px-5 font-bold rounded-xl bg-emerald-600 border-emerald-600 hover:bg-emerald-700 hover:border-emerald-700 shadow-md shadow-emerald-600/10 flex items-center" onClick={() => setIsModalOpen(true)}>
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

      <Card bordered={false} bodyStyle={{ padding: 0 }} className="rounded-2xl border border-slate-200 shadow-sm p-6 bg-white">
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            { key: 'all', label: 'Tất cả người dùng' },
            { key: 'admin', label: 'Quản trị viên' },
            { key: 'customer', label: 'Khách hàng' }
          ]}
          className="border-b border-slate-100 mb-0"
        />
        <div className="pt-4">
          <Table
            columns={columns}
            dataSource={filteredUsers}
            rowKey="id"
            pagination={{ pageSize: 5, className: 'px-2 py-3' }}
            className="admin-table border-none"
          />
        </div>
      </Card>

      <AddUserModal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onConfirm={handleAddUser}
      />
      <EditUserModal
        open={isEditModalOpen}
        user={selectedUser}
        onCancel={() => {
          setIsEditModalOpen(false);
          setSelectedUser(null);
        }}
        onConfirm={handleEditUser}
      />

    </PageContainer>
  );
};

export default AdminCustomers;