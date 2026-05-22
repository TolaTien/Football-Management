import { configureStore } from '@reduxjs/toolkit';
import userReducer from '@/entities/user/model/userSlice';
import pitchReducer from '@/entities/pitch/model/pitchSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    pitch: pitchReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
