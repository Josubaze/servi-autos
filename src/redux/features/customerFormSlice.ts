// redux/features/customerFormSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';


interface CustomerFormState {
  formData: Omit<Customer, '_id'> | null;
  isFormComplete: boolean;
}

const initialState: CustomerFormState = {
  formData: null,
  isFormComplete: false,
};

export const customerFormSlice = createSlice({
  name: 'customerForm',
  initialState,
  reducers: {
    setCustomerForm: (state, action: PayloadAction<Omit<Customer, '_id'> | null>) => {
      state.formData = action.payload;
      state.isFormComplete = !!action.payload;
    },
    resetCustomerForm: (state) => {
      state.formData = null;
      state.isFormComplete = false;
    },
  },
});

export const { setCustomerForm, resetCustomerForm } = customerFormSlice.actions;

export default customerFormSlice.reducer;
