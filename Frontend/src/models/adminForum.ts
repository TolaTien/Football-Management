import { useState, useCallback } from 'react';

export default function useAdminForumModel() {
  const [posts, setPosts] = useState([
    { id: 'f1', title: 'Tìm đối giao lưu tối nay sân 7', author: 'Minh Tú FC', date: '10/10/2023', category: 'Giao hữu', status: 'approved' },
    { id: 'f2', title: 'Cần pass lại giờ đá sân A2', author: 'Lê Văn A', date: '09/10/2023', category: 'Chuyển nhượng', status: 'approved' },
    { id: 'f3', title: 'Quảng cáo bán giày đá bóng giá rẻ!!', author: 'Shop Bóng Đá', date: '11/10/2023', category: 'Khác', status: 'pending' },
  ]);

  const updatePostStatus = useCallback((id: string, status: 'approved' | 'rejected') => {
    setPosts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status } : p))
    );
  }, []);

  const deletePost = useCallback((id: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const addPost = useCallback((post: any) => {
    setPosts((prev) => [{ ...post, id: `f${Date.now()}`, date: 'Hôm nay', status: 'approved' }, ...prev]);
  }, []);

  return {
    posts,
    updatePostStatus,
    deletePost,
    addPost,
  };
}
