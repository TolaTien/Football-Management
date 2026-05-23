import { configureStore } from '@reduxjs/toolkit';
import userReducer from '@/entities/user/model/userSlice';
import pitchReducer from '@/entities/pitch/model/pitchSlice';
import aiChatReducer from '@/entities/ai-chat/model/aiSlice';
import notificationReducer from '@/entities/notification/model/notificationSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    pitch: pitchReducer,
    aiChat: aiChatReducer,
    notification: notificationReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

