import { createTheme, ThemeProvider } from '@mui/material/styles';

export const TextFieldTheme = createTheme({
  palette: {
    mode: 'dark', // Activa el modo oscuro en todos los componentes de MUI
    primary: {
      main: '#ffffff', // Blanco para elementos primarios
    },
    text: {
      primary: '#ffffff', // Texto principal en blanco
    },
  },
});
