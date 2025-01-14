import { configureStore } from "@reduxjs/toolkit";
import basketReducer from "../slices/basketSlice";
import productsReducer from "../slices/productsSlice";
import ordersReducer from "../slices/ordersSlice";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from 'redux';

const rootReducer = combineReducers({
  basket: basketReducer,
  products: productsReducer,
  orders: ordersReducer,
});

const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  blacklist: ['products'], // Don't persist products state
  timeout: 2000, // Increase timeout for slower connections
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

// Initialize persistor
export const persistor = persistStore(store, null, () => {
  console.log('Rehydration completed');
});

// Log initial state
console.log('Initial store state:', store.getState());