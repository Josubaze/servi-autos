import { createTheme } from "@mui/material/styles";

export const darkTheme = createTheme({
  palette: {
    text: {
      primary: '#ffffff',
      secondary: '#b0b0b0',
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          paddingLeft: '16px',
          paddingRight: '16px',
          borderRadius: '16px', 
          backgroundColor: 'rgba(105, 113, 119, 0.2)',
          boxShadow: 'none',         
          opacity: 1,                
          filter: 'none',              
          backgroundImage: 'none',       
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: 'rgba(105, 113, 119, 0.3) !important', // Color más claro al pasar el mouse
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          padding: "4px",
          borderBottom: "none", 
        },
        head: {
          backgroundColor: 'rgba(105, 113, 119, 0.3) !important',
        }
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: '#fff', // Color inicial del ícono
          transition: 'transform 0.3s ease-in-out, background-color 0.3s ease-in-out',
          '&:hover': {
            backgroundColor: 'rgba(156, 163, 175, 0.2)', 
            transform: 'scale(1.1)', 
            '& .MuiSvgIcon-root': {
              color: '#6366f1', 
            },
          },
        },
      },
    },   
    MuiTablePagination: {
      styleOverrides: {
        selectIcon: {
          color: "#fff", 
        },
      },
    },
    MuiSvgIcon: {
      styleOverrides: {
        root: {
          color: '#fff',
          '&.Mui-disabled': {
            color: '#9ca3af', 
          },
        },
      },
    },
  },
});


export const darkThemeSolid = createTheme({
  palette: {
    text: {
      primary: '#ffffff',
      secondary: '#b0b0b0',
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          paddingLeft: '16px',
          paddingRight: '16px',
          borderRadius: '16px', 
          backgroundColor: '#101010',
          boxShadow: 'none',         
          opacity: 1,                
          filter: 'none',              
          backgroundImage: 'none',       
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: '#252525 !important',
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          padding: "4px",
          borderBottom: "none", 
        },
        head: {
          backgroundColor: '#161616 !important',
        }
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: '#fff', // Color inicial del ícono
          transition: 'transform 0.3s ease-in-out, background-color 0.3s ease-in-out',
          '&:hover': {
            backgroundColor: 'rgba(156, 163, 175, 0.2)', 
            transform: 'scale(1.1)', 
            '& .MuiSvgIcon-root': {
              color: '#6366f1', 
            },
          },
        },
      },
    },   
    MuiTablePagination: {
      styleOverrides: {
        selectIcon: {
          color: "#fff", 
        },
      },
    },
    MuiSvgIcon: {
      styleOverrides: {
        root: {
          color: '#fff',
          '&.Mui-disabled': {
            color: '#9ca3af', 
          },
        },
      },
    },
  },
});
