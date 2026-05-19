import { useState, useCallback } from 'react';

export default function useAdminUsersModel() {
  const [users, setUsers] = useState([
    { id: '1', name: 'Johnathan Doe', email: 'john.doe@arena-manager.com', phone: '+84 123 456 789', role: 'Quản trị', status: 'active', bookingsCount: 12, lastBooking: '2023-10-24' },
    { id: '2', name: 'Sarah Rodriguez', email: 'sarah.r@gmail.com', phone: '+84 987 654 321', role: 'Khách hàng', status: 'active', bookingsCount: 5, lastBooking: '2023-10-20' },
    { id: '3', name: 'Marcus Knight', email: 'm.knight@academy.com', phone: '+84 444 221 100', role: 'Khách hàng', status: 'banned', bookingsCount: 2, lastBooking: '2023-09-15' },
    { id: '4', name: 'Phạm Quang Dũng', email: 'dung.pq@gmail.com', phone: '+84 909 888 777', role: 'Khách hàng', status: 'active', bookingsCount: 24, lastBooking: '2023-10-25' },
  ]);

  const toggleBanStatus = useCallback((id: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === id) {
          return { ...u, status: u.status === 'active' ? 'banned' : 'active' };
        }
        return u;
      })
    );
  }, []);

  const addUser = useCallback((user: any) => {
    setUsers((prev) => [{ ...user, id: `u${Date.now()}`, status: 'active', bookingsCount: 0, lastBooking: '-' }, ...prev]);
  }, []);

  const deleteUser = useCallback((id: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
  }, []);

  return {
    users,
    toggleBanStatus,
    addUser,
    deleteUser,
  };
}
