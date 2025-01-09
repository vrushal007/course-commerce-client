import { createSlice } from '@reduxjs/toolkit';

const toastSlice = createSlice({
  name: 'toastSlice',
  initialState: {
    open: false,
    message: '',
    variant: 'default'
  },
  reducers: {
    setToast: (state, action) => {
      state.open = action.payload.open;
      state.message = action.payload.message;
      state.variant = action.payload.variant;
    }
  }
});

export const { setToast } = toastSlice.actions;

export default toastSlice.reducer;
