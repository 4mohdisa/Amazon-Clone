import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  loading: false,
  error: null,
  lastFetched: null,
};

export const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setProducts: (state, action) => {
      state.items = action.payload;
      state.lastFetched = Date.now();
      state.loading = false;
      state.error = null;
    },
    setLoading: (state) => {
      state.loading = true;
    },
    setError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { setProducts, setLoading, setError } = productsSlice.actions;

// Selectors
export const selectProducts = (state) => state.products.items;
export const selectProductsLoading = (state) => state.products.loading;
export const selectProductsError = (state) => state.products.error;
export const selectLastFetched = (state) => state.products.lastFetched;

export default productsSlice.reducer;
