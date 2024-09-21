'use client'

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { ReactNode } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/es';

interface LocalizationMuiProvider {
  children: ReactNode; 
}

export const LocalizationMuiProvider: React.FC<LocalizationMuiProvider> = ({ children }) => {
  dayjs.locale('es');
  return (
    <LocalizationProvider
      dateAdapter={AdapterDayjs}
      adapterLocale="es"
    >
      {children}
    </LocalizationProvider>
  );
};
