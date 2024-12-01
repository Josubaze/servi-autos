import { createTheme, ThemeProvider } from '@mui/material/styles';

export const TextFieldTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#ffffff', // Blanco para elementos primarios
    },
    text: {
      primary: '#ffffff', // Texto principal en blanco
      disabled: '#b0b0b0', // Cambia el color para los textos deshabilitados
    },
  },

});
