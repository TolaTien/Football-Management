import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { message } from 'antd';
import { bookingService } from '../api/bookingService';
import { extractErrorMessage } from '@/shared/lib/errorUtils';
import type { Booking, BookingStatus, PaymentStatus } from './types';

const formatLocalDate = (dateStr: string): string => {
  const d = new Date(dateStr);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

const formatLocalTime = (dateStr: string): string => {
  const d = new Date(dateStr);
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
};

const mapPaymentStatus = (status: string): PaymentStatus => {
  if (status === 'paid') return 'paid';
  if (status === 'partial') return 'deposited';
  return 'unpaid';
};

const mapBookingStatus = (status: string): BookingStatus => {
  if (status === 'approved') return 'approved';
  if (status === 'rejected') return 'rejected';
  if (status === 'cancelled') return 'cancelled';
  return 'pending';
};

interface BackendBooking {
  bookId: string;
  startTime: string;
  endTime: string;
  paymentStatus: string;
  status: string;
  userId?: string;
  phone?: string;
  total?: number;
  pitchPriceAtBooking?: number;
  pitchId: string;
  users?: { fullName?: string; phone?: string };
  pitch?: { namePitch?: string };
  cancelrequests?: Array<{ content?: string }>;
  bookingservices?: any[];
  payments?: any[];
}

import { userService } from '@/entities/user/api/userService';

const mapBackendBooking = (
  b: BackendBooking,
  pitchOverride?: { namePitch?: string },
  userMap?: Map<string, string>,
  phoneMap?: Map<string, string>
): Booking => {
  let resolvedName = b.users?.fullName;
  if (!resolvedName) {
    if (b.userId && userMap && userMap.has(b.userId)) {
      resolvedName = userMap.get(b.userId);
    } else if (b.phone) {
      const stdPhone = b.phone.replace(/[\s\-\+]/g, '');
      if (phoneMap && phoneMap.has(stdPhone)) {
        resolvedName = phoneMap.get(stdPhone);
      }
    }
  }

  return {
    id: b.bookId,
    userName: resolvedName ?? `Khách (${b.phone ?? 'Vãng lai'})`,
    phone: b.phone ?? b.users?.phone ?? '',
    pitchId: b.pitchId,
    pitchName: pitchOverride?.namePitch ?? b.pitch?.namePitch ?? `Sân ${b.pitchId}`,
    date: formatLocalDate(b.startTime ?? new Date().toISOString()),
    startTime: formatLocalTime(b.startTime ?? new Date().toISOString()),
    endTime: formatLocalTime(b.endTime ?? new Date().toISOString()),
    status: mapBookingStatus(b.status),
    paymentStatus: mapPaymentStatus(b.paymentStatus),
    price: b.total ?? b.pitchPriceAtBooking ?? 0,
    note: b.cancelrequests?.[0]?.content ?? '',
    source: b.userId ? 'app' : 'phone',
    pitchPriceAtBooking: b.pitchPriceAtBooking ?? 0,
    total: b.total ?? 0,
    bookingservices: b.bookingservices ?? [],
    payments: b.payments ?? [],
  };
};

export const fetchAllBookings = createAsyncThunk(
  'booking/fetchAllBookings',
  async (_, { rejectWithValue }) => {
    try {
      const [pendingRes, pitchesRes, usersRes] = await Promise.all([
        bookingService.getAllRequests(),
        bookingService.getPitchesWithBookings(),
        userService.getAll({ page: 1, limit: 1000 }).catch(() => ({ data: { data: { users: [] } } })),
      ]);

      const backendUsers: any[] = usersRes.data?.data?.users ?? [];
      const userMap = new Map<string, string>();
      const phoneMap = new Map<string, string>();

      backendUsers.forEach((u) => {
        if (u.userId && u.fullName) {
          userMap.set(u.userId, u.fullName);
        }
        if (u.phone && u.fullName) {
          const stdPhone = u.phone.replace(/[\s\-\+]/g, '');
          phoneMap.set(stdPhone, u.fullName);
        }
      });

      const pendingData: BackendBooking[] = pendingRes.data?.data?.booking ?? [];
      const mappedPending = pendingData.map((b) => mapBackendBooking(b, undefined, userMap, phoneMap));

      const pitchesData: Array<{
        pitchId: string;
        namePitch: string;
        booking?: BackendBooking[];
      }> = pitchesRes.data?.data ?? [];

      const mappedApproved: Booking[] = pitchesData.flatMap((p) =>
        (p.booking ?? []).map((b) =>
          mapBackendBooking(b, { namePitch: p.namePitch }, userMap, phoneMap)
        )
      );

      const combined = [...mappedPending, ...mappedApproved];
      const unique = combined.filter(
        (b, idx, self) => idx === self.findIndex((t) => t.id === b.id)
      );
      return unique;
    } catch (error: unknown) {
      return rejectWithValue(extractErrorMessage(error, 'Lỗi tải danh sách lịch đặt'));
    }
  }
);

export const updateBookingStatus = createAsyncThunk(
  'booking/updateBookingStatus',
  async (
    { id, status }: { id: string; status: BookingStatus },
    { dispatch, rejectWithValue }
  ) => {
    try {
      if (status === 'approved') {
        await bookingService.approve(id);
        message.success('Đã phê duyệt yêu cầu đặt sân!');
      } else if (status === 'cancelled' || status === 'rejected') {
        await bookingService.cancel(id);
        message.success('Đã hủy đặt sân thành công!');
      }
      dispatch(fetchAllBookings());
    } catch (error: unknown) {
      const msg = extractErrorMessage(error, 'Không thể cập nhật trạng thái');
      message.error(msg);
      return rejectWithValue(msg);
    }
  }
);

export const updatePaymentStatus = createAsyncThunk(
  'booking/updatePaymentStatus',
  async (
    { id, paymentStatus }: { id: string; paymentStatus: PaymentStatus },
    { dispatch, rejectWithValue }
  ) => {
    try {
      const method = paymentStatus === 'paid' ? 'banking' : 'cash';
      await bookingService.verifyPayment(id, method);
      message.success('Cập nhật trạng thái thanh toán thành công!');
      dispatch(fetchAllBookings());
    } catch (error: unknown) {
      const msg = extractErrorMessage(error, 'Lỗi xác nhận thanh toán');
      message.error(msg);
      return rejectWithValue(msg);
    }
  }
);

export const addManualBooking = createAsyncThunk(
  'booking/addManualBooking',
  async (booking: Omit<Booking, 'id'>, { dispatch, rejectWithValue }) => {
    try {
      const startDateTime = new Date(`${booking.date}T${booking.startTime}:00`);
      const endDateTime = new Date(`${booking.date}T${booking.endTime}:00`);
      await bookingService.createAdminBooking({
        pitchId: booking.pitchId,
        phone: booking.phone ?? '0000000000',
        startTime: startDateTime.toISOString(),
        endTime: endDateTime.toISOString(),
        pitchPriceAtBooking: booking.price,
        service: [],
      });
      message.success('Tạo đặt sân mới thành công!');
      dispatch(fetchAllBookings());
    } catch (error: unknown) {
      const msg = extractErrorMessage(error, 'Lỗi tạo lịch đặt sân');
      message.error(msg);
      return rejectWithValue(msg);
    }
  }
);

export const deleteBookingThunk = createAsyncThunk(
  'booking/deleteBooking',
  async (id: string, { rejectWithValue }) => {
    try {
      await bookingService.cancel(id);
      message.success('Đã xóa lịch đặt!');
      return id;
    } catch (error: unknown) {
      const msg = extractErrorMessage(error, 'Lỗi xóa lịch đặt');
      message.error(msg);
      return rejectWithValue(msg);
    }
  }
);

export const refundBookingThunk = createAsyncThunk(
  'booking/refundBooking',
  async (bookId: string, { dispatch, rejectWithValue }) => {
    try {
      await bookingService.refund(bookId);
      message.success('Hoàn cọc thành công!');
      dispatch(fetchAllBookings());
    } catch (error: unknown) {
      const msg = extractErrorMessage(error, 'Lỗi hoàn tiền cọc');
      message.error(msg);
      return rejectWithValue(msg);
    }
  }
);

interface BookingState {
  bookings: Booking[];
  loading: boolean;
  error: string | null;
}

const initialState: BookingState = {
  bookings: [],
  loading: false,
  error: null,
};

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload;
      })
      .addCase(fetchAllBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteBookingThunk.fulfilled, (state, action) => {
        state.bookings = state.bookings.filter((b) => b.id !== action.payload);
      });
  },
});

export default bookingSlice.reducer;
