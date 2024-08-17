import { configureStore } from '@reduxjs/toolkit';
import counterSlice from './features/couterSlice';
import productSlice  from './features/productSlice';
import loadingSlice  from './features/loadingSlice';

export const store = configureStore({
  reducer: {
    counter: counterSlice,
    products: productSlice,
    loading: loadingSlice,
  },
})

