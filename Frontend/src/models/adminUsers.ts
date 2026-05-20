import { useState, useCallback, useEffect } from 'react';
import api from '@/services/api';
import { message } from 'antd';

export interface UserItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'Quản trị' | 'Khách hàng';
  status: 'active' | 'banned';
}

export default function useAdminUsersModel() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(false);

  // Lấy danh sách bị chặn từ localStorage
  const getBannedUserIds = (): string[] => {
    try {
      const banned = localStorage.getItem('banned_user_ids');
      return banned ? JSON.parse(banned) : [];
    } catch {
      return [];
    }
  };

  // Tải danh sách người dùng từ BE
  const fetchUsers = useCallback(async (page = 1, limit = 100, search = '') => {
    setLoading(true);
    try {
      const response = await api.get(`/admin/users`, {
        params: { page, limit, search }
      });
      const backendUsers = response.data?.data?.users || [];
      const bannedIds = getBannedUserIds();

      const mappedUsers: UserItem[] = backendUsers.map((u: any) => ({
        id: u.userId,
        name: u.fullName,
        email: u.email,
        phone: u.phone || '—',
        role: u.role === 'admin' ? 'Quản trị' : 'Khách hàng',
        status: bannedIds.includes(u.userId) ? 'banned' : 'active'
      }));

      setUsers(mappedUsers);
    } catch (error) {
      console.error("Lỗi tải người dùng:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Thêm người dùng mới
  const addUser = useCallback(async (userData: any) => {
    try {
      // Map vai trò và họ tên
      const backendRole = userData.role === 'Quản trị' ? 'admin' : 'user';
      const defaultPassword = userData.password || '123456'; // Mật khẩu mặc định

      await api.post('/admin/users', {
        email: userData.email,
        fullName: userData.name,
        phone: userData.phone,
        role: backendRole,
        password: defaultPassword
      });

      message.success('Thêm người dùng mới thành công!');
      fetchUsers();
    } catch (error: any) {
      console.error("Lỗi thêm người dùng:", error);
      message.error(error.response?.data?.message || 'Lỗi thêm người dùng');
    }
  }, [fetchUsers]);

  // Cập nhật người dùng
  const updateUser = useCallback(async (userId: string, userData: any) => {
    try {
      const backendRole = userData.role ? (userData.role === 'Quản trị' ? 'admin' : 'user') : undefined;
      await api.put(`/admin/users/${userId}`, {
        email: userData.email,
        fullName: userData.name,
        phone: userData.phone,
        role: backendRole,
        password: userData.password
      });
      fetchUsers();
    } catch (error: any) {
      console.error("Lỗi cập nhật người dùng:", error);
      message.error(error.response?.data?.message || 'Lỗi cập nhật người dùng');
    }
  }, [fetchUsers]);

  // Xóa người dùng
  const deleteUser = useCallback(async (userId: string) => {
    try {
      await api.delete(`/admin/users/${userId}`);
      message.success('Xóa người dùng thành công!');
      fetchUsers();
    } catch (error: any) {
      console.error("Lỗi xóa người dùng:", error);
      message.error(error.response?.data?.message || 'Lỗi xóa người dùng');
    }
  }, [fetchUsers]);

  // Chặn / Bỏ chặn người dùng bằng localStorage
  const toggleBanStatus = useCallback((userId: string) => {
    const bannedIds = getBannedUserIds();
    let newBannedIds: string[];

    if (bannedIds.includes(userId)) {
      newBannedIds = bannedIds.filter(id => id !== userId);
    } else {
      newBannedIds = [...bannedIds, userId];
    }

    localStorage.setItem('banned_user_ids', JSON.stringify(newBannedIds));

    // Cập nhật local state ngay lập tức để đồng bộ UI
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        return {
          ...u,
          status: u.status === 'active' ? 'banned' : 'active'
        };
      }
      return u;
    }));
  }, []);

  return {
    users,
    loading,
    fetchUsers,
    addUser,
    updateUser,
    deleteUser,
    toggleBanStatus
  };
}
