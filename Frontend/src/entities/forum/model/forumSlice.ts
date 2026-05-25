import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { message } from 'antd';
import { forumService } from '../api/forumService';
import { extractErrorMessage } from '@/shared/lib/errorUtils';
import type { ForumPost, ForumPostStatus } from './types';

export const fetchForumPosts = createAsyncThunk(
  'forum/fetchPosts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await forumService.getAllPosts();
      // Backend returns: { items: [...] }
      const backendData = response.data?.items ?? [];
      return backendData.map((p: any) => ({
        id: p.postId,
        title: p.description?.substring(0, 40) || 'Thảo luận',
        content: p.description || '',
        author: p.users?.fullName || 'Thành viên',
        date: new Date(p.createdAt).toLocaleDateString('vi-VN'),
        category: 'Giao hữu',
        status: (p.status === 'open' ? 'approved' : 'rejected') as ForumPostStatus,
      }));
    } catch (error: any) {
      return rejectWithValue(extractErrorMessage(error, 'Lỗi lấy bài viết diễn đàn'));
    }
  }
);

export const addForumPost = createAsyncThunk(
  'forum/addPost',
  async (content: string, { dispatch, rejectWithValue }) => {
    try {
      await forumService.createPost({ description: content });
      message.success('Đăng bài mới thành công!');
      dispatch(fetchForumPosts());
    } catch (error: any) {
      const msg = extractErrorMessage(error, 'Lỗi đăng bài viết');
      message.error(msg);
      return rejectWithValue(msg);
    }
  }
);

export const removeForumPost = createAsyncThunk(
  'forum/deletePost',
  async (postId: string, { dispatch, rejectWithValue }) => {
    try {
      await forumService.deletePost(postId);
      message.success('Đã xóa bài viết khỏi diễn đàn!');
      dispatch(fetchForumPosts());
    } catch (error: any) {
      const msg = extractErrorMessage(error, 'Lỗi xóa bài viết');
      message.error(msg);
      return rejectWithValue(msg);
    }
  }
);

interface ForumState {
  posts: ForumPost[];
  loading: boolean;
}

const initialState: ForumState = {
  posts: [],
  loading: false,
};

const forumSlice = createSlice({
  name: 'forum',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchForumPosts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchForumPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload;
      })
      .addCase(fetchForumPosts.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default forumSlice.reducer;
