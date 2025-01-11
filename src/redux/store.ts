import { configureStore } from '@reduxjs/toolkit';
import counterSlice from './features/couterSlice';
import loadingSlice  from './features/loadingSlice';
import { productsApi } from './services/productsApi';
import { usersApi } from './services/usersApi';
import { customersApi } from './services/customersApi';
import { providersApi } from './services/providersApi';
import customerFormSlice from './features/customerFormSlice';
import { servicesApi } from './services/servicesApi';
import { companyApi } from './services/company.Api';
import companySlice  from './features/companySlice';
import { budgetsApi } from './services/budgets.Api';
import { invoicesApi } from './services/invoices.Api';
import { creditNotesApi } from './services/creditNotes.Api';
import { marketApi } from './services/market.Api';

export const makeStore = () => {
  return configureStore({
    reducer: {
      counter: counterSlice,
      loading: loadingSlice,
      customerForm: customerFormSlice,
      company: companySlice,
      [productsApi.reducerPath]: productsApi.reducer,
      [usersApi.reducerPath]: usersApi.reducer,
      [customersApi.reducerPath]: customersApi.reducer,
      [providersApi.reducerPath]: providersApi.reducer,
      [servicesApi.reducerPath]: servicesApi.reducer,
      [companyApi.reducerPath]: companyApi.reducer,
      [budgetsApi.reducerPath]: budgetsApi.reducer,
      [invoicesApi.reducerPath]: invoicesApi.reducer,
      [creditNotesApi.reducerPath]: creditNotesApi.reducer,
      [marketApi.reducerPath]: marketApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware()
        .concat(productsApi.middleware)
        .concat(usersApi.middleware)
        .concat(customersApi.middleware)
        .concat(providersApi.middleware)
        .concat(servicesApi.middleware)
        .concat(companyApi.middleware)
        .concat(budgetsApi.middleware)
        .concat(invoicesApi.middleware)
        .concat(creditNotesApi.middleware)
        .concat(marketApi.middleware)
  });
}

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']