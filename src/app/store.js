import { configureStore } from "@reduxjs/toolkit";
import basketReducer from "../slices/basketSlice";
import productsReducer from "../slices/productsSlice";

export const store = configureStore({
  reducer: {
    basket: basketReducer,
    products: productsReducer,
  },
});
