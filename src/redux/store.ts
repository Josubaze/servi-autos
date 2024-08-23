import { configureStore } from '@reduxjs/toolkit';
import counterSlice from './features/couterSlice';
import productSlice  from './features/productSlice';
import loadingSlice  from './features/loadingSlice';
import { productsApi } from './services/productsApi';

export const makeStore = () => {
  return configureStore({
    reducer: {
      counter: counterSlice,
      products: productSlice,
      loading: loadingSlice,
      [productsApi.reducerPath]: productsApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(productsApi.middleware),
  })
}

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']

