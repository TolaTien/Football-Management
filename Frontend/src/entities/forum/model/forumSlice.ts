import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { ForumPost, ForumPostStatus, CreateForumPostDto } from './types';

const INITIAL_POSTS: ForumPost[] = [
  {
    id: 'f1',
    title: 'Tìm đối giao lưu tối nay sân 7',
    author: 'Minh Tú FC',
    date: '10/10/2023',
    category: 'Giao hữu',
    status: 'approved',
    content: 'Sân 7 người, khu vực quận 1, tối nay 19h-21h. Liên hệ ngay!',
  },
  {
    id: 'f2',
    title: 'Cần pass lại giờ đá sân A2',
    author: 'Lê Văn A',
    date: '09/10/2023',
    category: 'Chuyển nhượng',
    status: 'approved',
    content: 'Do bận việc đột xuất, cần pass lại slot sân A2 tối 9/10 từ 20h-22h.',
  },
  {
    id: 'f3',
    title: 'Quảng cáo bán giày đá bóng giá rẻ!!',
    author: 'Shop Bóng Đá',
    date: '11/10/2023',
    category: 'Khác',
    status: 'pending',
    content: 'Thanh lý kho giày đá bóng chính hãng, đủ size, giá từ 200k.',
  },
];

interface ForumState {
  posts: ForumPost[];
  loading: boolean;
}

const initialState: ForumState = {
  posts: INITIAL_POSTS,
  loading: false,
};

const forumSlice = createSlice({
  name: 'forum',
  initialState,
  reducers: {
    updatePostStatus: (state, action: PayloadAction<{ id: string; status: ForumPostStatus }>) => {
      const { id, status } = action.payload;
      state.posts = state.posts.map((p) => (p.id === id ? { ...p, status } : p));
    },
    deletePost: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      state.posts = state.posts.filter((p) => p.id !== id);
    },
    addPost: (state, action: PayloadAction<CreateForumPostDto>) => {
      const newPost: ForumPost = {
        ...action.payload,
        id: `f${Date.now()}`,
        date: 'Hôm nay',
        status: 'approved',
      };
      state.posts = [newPost, ...state.posts];
    },
  },
});

export const { updatePostStatus, deletePost, addPost } = forumSlice.actions;
export default forumSlice.reducer;
