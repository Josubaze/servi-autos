import { useMediaQuery } from '@mui/material';
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

export const useResponsiveColumns = (columns: any[]) => {
  const isMobile = useMediaQuery('(max-width:600px)');
  const isTablet = useMediaQuery('(min-width:601px) and (max-width:960px)');
  const isDesktop = useMediaQuery('(min-width:961px)');

  return columns.map(column => {
    if (isMobile && (column.name === "category" || column.name === "id" || column.name === "description")) {
      return {
        ...column,
        options: {
          ...column.options,
          display: false
        }
      };
    } else if (isTablet && (column.name === "category" || column.name === "description")) {
      return {
        ...column,
        options: {
          ...column.options,
          display: false
        }
      };
    } else if (isDesktop) {
      return {
        ...column,
        options: {
          ...column.options,
          display: true
        }
      };
    }
    return column;
  });
};
