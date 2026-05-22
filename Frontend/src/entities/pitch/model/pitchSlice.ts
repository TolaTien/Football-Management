import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PitchState {
  list: any[];
  loading: boolean;
  error: string | null;
}

const initialState: PitchState = {
  list: [],
  loading: false,
  error: null,
};

const pitchSlice = createSlice({
  name: 'pitch',
  initialState,
  reducers: {
    setPitchList: (state, action: PayloadAction<any[]>) => {
      state.list = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { setPitchList, setLoading } = pitchSlice.actions;
export default pitchSlice.reducer;
