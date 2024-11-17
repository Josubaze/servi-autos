import { createTheme } from "@mui/material/styles";

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      paper: '#4f46e5',
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
          backgroundColor: '#4f46e5', // Fondo de la cabecera de la tabla
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#161616',  
          boxShadow: 'none',         
          opacity: 1,                
          filter: 'none',              
          backgroundImage: 'none',    
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          '&:hover': {
            '& .MuiSvgIcon-root': {
              color: '#4f46e5', // Color al pasar el cursor
            },
          },
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#111827', // Fondo global
        },
      },
    },
  },
});
