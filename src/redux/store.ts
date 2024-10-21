import { configureStore } from '@reduxjs/toolkit';
import counterSlice from './features/couterSlice';
import loadingSlice  from './features/loadingSlice';
import { productsApi } from './services/productsApi';
import { usersApi } from './services/usersApi';
import { customersApi } from './services/customersApi';
import { providersApi } from './services/providersApi';
import customerFormSlice from './features/customerFormSlice';
import { servicesApi } from './services/servicesApi';

export const makeStore = () => {
  return configureStore({
    reducer: {
      counter: counterSlice,
      loading: loadingSlice,
      customerForm: customerFormSlice,
      [productsApi.reducerPath]: productsApi.reducer,
      [usersApi.reducerPath]: usersApi.reducer,
      [customersApi.reducerPath]: customersApi.reducer,
      [providersApi.reducerPath]: providersApi.reducer,
      [servicesApi.reducerPath]: servicesApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware()
        .concat(productsApi.middleware)
        .concat(usersApi.middleware)
        .concat(customersApi.middleware)
        .concat(providersApi.middleware)
        .concat(servicesApi.middleware),
  });
}

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']

