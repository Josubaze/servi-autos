"use client";

import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/es'; 
import { ReactNode } from 'react';

interface LocalizationMuiProvider {
  children: ReactNode; // Define el tipo de children
}

export const LocalizationMuiProvider: React.FC<LocalizationMuiProvider> = ({ children }) => {
  dayjs.locale('es');

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      {children}
    </LocalizationProvider>
  );
};
