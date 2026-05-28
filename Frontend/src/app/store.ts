import { configureStore } from '@reduxjs/toolkit';
import userReducer from '@/entities/user/model/userSlice';
import pitchReducer from '@/entities/pitch/model/pitchSlice';
import bookingReducer from '@/entities/booking/model/bookingSlice';
import serviceReducer from '@/entities/service-item/model/serviceSlice';
import forumReducer from '@/entities/forum/model/forumSlice';
import statisticReducer from '@/entities/statistic/model/statisticSlice';
import aiReducer from '@/entities/ai/model/aiSlice';


export const store = configureStore({
  reducer: {
    user: userReducer,
    pitch: pitchReducer,
    booking: bookingReducer,
    service: serviceReducer,
    forum: forumReducer,
    statistic: statisticReducer,
    ai: aiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
