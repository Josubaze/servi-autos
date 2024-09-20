import { createTheme } from "@mui/material/styles";
import type {} from '@mui/x-date-pickers/themeAugmentation';

export const dateTheme = createTheme({
  palette: {
    mode: 'dark', 
    primary: {
      main: '#4c51bf', 
    },
    text: {
      primary: '#f7fafc', 
    },
  },
  components: {
    MuiFormControl: {
      styleOverrides: {
        root: {
          margin: '8px 0', 
          width: '100%',
        },
      },
    },
    MuiDateCalendar: {
        styleOverrides: {
          root: {
            borderRadius: '12px',
            backgroundColor: '#1F2937', // Cambia este valor al color que desees
          },
        },
    },
    MuiPickersDay: {  
      styleOverrides: {
        root: {
          color: '#f7fafc', // Texto gray-100
          backgroundColor: '#4b5563', // Fondo oscuro
          '&:hover': {
            backgroundColor: '#4338ca', // Hover indigo-600
          },
          '&.Mui-selected': {
            backgroundColor: '#4338ca', // Indigo-600 seleccionado
            color: '#f7fafc', // Texto seleccionado gray-100
          },
        },
      },
    },
    MuiTextField: {
        styleOverrides: {
          root: {
            margin: '0',
            '& .MuiOutlinedInput-root': {
              borderRadius: '12px',
              height: '32px',
              padding: '0 12px',
              '& .MuiOutlinedInput-notchedOutline': {
                border: '2px solid #6b7280', 
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#9ca3af', 
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#4338ca', 
              },
              backgroundColor: '#1F2937', // bg-gray-800
              color: '#f7fafc', // color del texto
            },
            '& .MuiOutlinedInput-input': {
                padding: '0', // Ajusta el padding a 0
                textAlign: 'right', // Alinear texto a la derecha
            },
          },
        },
    },
  },
});
