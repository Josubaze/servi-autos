import { createTheme } from "@mui/material/styles";

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      paper: '#4f46e5', // Color de fondo del contenedor de la tabla(solo head en este caso luego se redefine)
    },
    text: {
      primary: '#ffffff',
      secondary: '#b0b0b0',
    },
  },
  components: {
    MuiTableCell: {
      styleOverrides: {
        head: {
          backgroundColor: '#4f46e5 ', // Color de fondo de las celdas en la fila de encabezado
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#000000', // Color de fondo del contenedor principal
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          '&:hover': {
            '& .MuiSvgIcon-root': {
              color: '#4f46e5',
            },
          },
        },
      },
    },
  },
});
