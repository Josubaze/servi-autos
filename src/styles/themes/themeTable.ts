import { createTheme } from "@mui/material/styles";

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      paper: '#000000', 
    },
    text: {
      primary: '#ffffff',
      secondary: '#b0b0b0',
    },
  },
  components: {
    MuiIconButton: {
      styleOverrides: {
        root: {
          '&:hover': {
            '& .MuiSvgIcon-root': {
              color: '#4f46e5',
            }
          }
        }
      }
    }
  }
});