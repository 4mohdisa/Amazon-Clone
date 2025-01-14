import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  orders: [],
  loading: false,
  error: null,
  lastFetched: null
};

export const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setOrders: (state, action) => {
      state.orders = action.payload;
      state.lastFetched = new Date().toISOString();
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    addOrder: (state, action) => {
      state.orders.unshift(action.payload);
    },
    updateOrder: (state, action) => {
      const index = state.orders.findIndex(order => order.id === action.payload.id);
      if (index !== -1) {
        state.orders[index] = { ...state.orders[index], ...action.payload };
      }
    },
    clearOrders: (state) => {
      state.orders = [];
      state.lastFetched = null;
    }
  },
});

export const { 
  setOrders, 
  setLoading, 
  setError, 
  addOrder, 
  updateOrder, 
  clearOrders 
} = ordersSlice.actions;

// Selectors
export const selectOrders = (state) => state.orders.orders;
export const selectOrdersLoading = (state) => state.orders.loading;
export const selectOrdersError = (state) => state.orders.error;
export const selectLastFetched = (state) => state.orders.lastFetched;

export default ordersSlice.reducer;
