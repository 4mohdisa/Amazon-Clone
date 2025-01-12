import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import basketReducer from "../slices/basketSlice";
import productsReducer from "../slices/productsSlice";

const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  debug: true, // Enable debug mode
  whitelist: ['basket']
};

const rootReducer = combineReducers({
  basket: basketReducer,
  products: productsReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Add logging middleware
const loggerMiddleware = (store) => (next) => (action) => {
  console.log('Dispatching:', action);
  const result = next(action);
  console.log('Next State:', store.getState());
  return result;
};

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(loggerMiddleware),
});

// Log when persistor is created
const persistor = persistStore(store, null, () => {
  console.log('Rehydration completed');
});

console.log('Initial store state:', store.getState());

export { persistor };