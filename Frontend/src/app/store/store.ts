import { configureStore } from '@reduxjs/toolkit';
import { userReducer } from '@/entities/user';
import { pitchReducer } from '@/entities/pitch';
import aiChatReducer from '@/entities/ai-chat/model/aiSlice';
import { notificationReducer } from '@/entities/notification';

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

