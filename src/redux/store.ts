import { configureStore } from '@reduxjs/toolkit';
import counterSlice from './features/couterSlice';
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
import { executionOrdersApi } from './services/executionOrders.Api';
import { reportsApi } from './services/reports.Api';
import { purchaseOrdersApi } from './services/purchaseOrders.Api';
import { recoverPasswordApi } from './services/recoverPassword.Api';

export const makeStore = () => {
  return configureStore({
    reducer: {
      counter: counterSlice,
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
      [executionOrdersApi.reducerPath]: executionOrdersApi.reducer,
      [reportsApi.reducerPath]: reportsApi.reducer,
      [purchaseOrdersApi.reducerPath]: purchaseOrdersApi.reducer,
      [recoverPasswordApi.reducerPath]: recoverPasswordApi.reducer,
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
        .concat(executionOrdersApi.middleware)
        .concat(reportsApi.middleware)
        .concat(purchaseOrdersApi.middleware)
        .concat(recoverPasswordApi.middleware)
  });
}

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']