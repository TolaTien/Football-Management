import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { message } from 'antd';
import { serviceItemService } from '../api/serviceItemService';
import { extractErrorMessage } from '@/shared/lib/errorUtils';
import type { ServiceItem, ServiceType, ServiceStockStatus } from './types';

const LOW_STOCK_THRESHOLD = 10;

const detectType = (name: string): ServiceType => {
  const n = name.toLowerCase();
  if (n.includes('nước') || n.includes('revive') || n.includes('aquafina') ||
      n.includes('redbull') || n.includes('sting') || n.includes('coca') ||
      n.includes('bò cụng')) return 'drink';
  if (n.includes('áo') || n.includes('bóng') || n.includes('giày') || n.includes('găng'))
    return 'equipment';
  if (n.includes('bánh') || n.includes('kẹo') || n.includes('mì') || n.includes('phở'))
    return 'food';
  return 'other';
};

const computeStockStatus = (stock: number): ServiceStockStatus => {
  if (stock === 0) return 'out_of_stock';
  if (stock < LOW_STOCK_THRESHOLD) return 'low_stock';
  return 'in_stock';
};

interface BackendServiceItem {
  serviceId: string;
  nameProduct: string;
  price: number;
  totalQuantity: number;
  borrowed: number;
  returned: number;
}

const mapBackendServiceItem = (srv: BackendServiceItem): ServiceItem => {
  const stock = Math.max(0, (srv.totalQuantity ?? 0) - (srv.borrowed ?? 0) + (srv.returned ?? 0));
  let name = srv.nameProduct || '';
  let type: ServiceType = detectType(name);
  
  const match = name.match(/^\[(drink|equipment|food|other)\]\s*(.*)$/);
  if (match) {
    type = match[1] as ServiceType;
    name = match[2];
  }

  return {
    id: srv.serviceId,
    name: name,
    price: srv.price ?? 0,
    stock,
    type,
    status: computeStockStatus(stock),
    totalQuantity: srv.totalQuantity ?? 0,
    borrowed: srv.borrowed ?? 0,
    returned: srv.returned ?? 0,
  };
};

export const fetchServices = createAsyncThunk(
  'service/fetchServices',
  async (_, { rejectWithValue }) => {
    try {
      const response = await serviceItemService.getAll();
      const backendData: BackendServiceItem[] = response.data ?? [];
      return backendData.map(mapBackendServiceItem);
    } catch (error: unknown) {
      return rejectWithValue(extractErrorMessage(error, 'Lỗi tải danh sách sản phẩm/dịch vụ'));
    }
  }
);

export const addService = createAsyncThunk(
  'service/addService',
  async (
    data: { name: string; type: string; price: number },
    { dispatch, rejectWithValue }
  ) => {
    try {
      await serviceItemService.create({
        nameProduct: `[${data.type}] ${data.name}`,
        price: data.price,
        totalQuantity: 50,
        borrowed: 0,
        returned: 0,
      });
      message.success('Đã thêm dịch vụ thành công!');
      dispatch(fetchServices());
    } catch (error: unknown) {
      const msg = extractErrorMessage(error, 'Lỗi thêm sản phẩm/dịch vụ');
      message.error(msg);
      return rejectWithValue(msg);
    }
  }
);

export const updateStock = createAsyncThunk(
  'service/updateStock',
  async (
    { id, qty }: { id: string; qty: number },
    { getState, dispatch, rejectWithValue }
  ) => {
    try {
      const state = getState() as { service: { services: ServiceItem[] } };
      const current = state.service.services.find((s) => s.id === id);
      if (!current) throw new Error('Không tìm thấy dịch vụ');

      const newStock = Math.max(0, current.stock + qty);
      const newTotalQuantity = newStock + current.borrowed - current.returned;
      // Trả lại tên với type gốc nếu có
      await serviceItemService.update(id, {
        nameProduct: `[${current.type}] ${current.name}`,
        price: current.price,
        totalQuantity: newTotalQuantity,
        borrowed: current.borrowed,
        returned: current.returned,
      });
      message.success('Cập nhật số lượng tồn kho thành công!');
      dispatch(fetchServices());
    } catch (error: unknown) {
      const msg = extractErrorMessage(error, 'Lỗi cập nhật số lượng tồn kho');
      message.error(msg);
      return rejectWithValue(msg);
    }
  }
);

export const updateService = createAsyncThunk(
  'service/updateService',
  async (
    { id, name, type, price }: { id: string; name: string; type: string; price: number },
    { getState, dispatch, rejectWithValue }
  ) => {
    try {
      const state = getState() as { service: { services: ServiceItem[] } };
      const current = state.service.services.find((s) => s.id === id);
      if (!current) throw new Error('Không tìm thấy dịch vụ');

      await serviceItemService.update(id, {
        nameProduct: `[${type}] ${name}`,
        price: price,
        totalQuantity: current.totalQuantity,
        borrowed: current.borrowed,
        returned: current.returned,
      });
      message.success('Cập nhật thông tin sản phẩm thành công!');
      dispatch(fetchServices());
    } catch (error: unknown) {
      const msg = extractErrorMessage(error, 'Lỗi cập nhật sản phẩm');
      message.error(msg);
      return rejectWithValue(msg);
    }
  }
);
export const deleteService = createAsyncThunk(
  'service/deleteService',
  async (id: string, { dispatch, rejectWithValue }) => {
    try {
      await serviceItemService.remove(id);
      message.success('Đã xóa dịch vụ thành công!');
      dispatch(fetchServices());
    } catch (error: unknown) {
      const msg = extractErrorMessage(error, 'Không thể xóa dịch vụ này');
      message.error(msg);
      return rejectWithValue(msg);
    }
  }
);

interface ServiceState {
  services: ServiceItem[];
  loading: boolean;
  error: string | null;
}

const initialState: ServiceState = {
  services: [],
  loading: false,
  error: null,
};

const serviceSlice = createSlice({
  name: 'service',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchServices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchServices.fulfilled, (state, action) => {
        state.loading = false;
        state.services = action.payload;
      })
      .addCase(fetchServices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default serviceSlice.reducer;
