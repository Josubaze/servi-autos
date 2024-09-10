import { useMediaQuery } from '@mui/material';

interface Column {
  name: string;
  label: string;
  options: {
    display?: boolean;
    [key: string]: any;
  };
}

export const useResponsiveColumns = (
  columns: Column[],
  mobileColumnsToShow: string[] = [],
  tabletColumnsToShow: string[] = []
) => {
  const isMobile = useMediaQuery('(max-width:600px)');
  const isTablet = useMediaQuery('(min-width:601px) and (max-width:960px)');
  
  return columns.map(column => {
    if (isMobile) {
      // In mobile view, show only specified columns
      if (mobileColumnsToShow.includes(column.name)) {
        return {
          ...column,
          options: {
            ...column.options,
            display: true
          }
        };
      }
      return {
        ...column,
        options: {
          ...column.options,
          display: false
        }
      };
    } 
    
    if (isTablet) {
      // In tablet view, show only specified columns
      if (tabletColumnsToShow.includes(column.name)) {
        return {
          ...column,
          options: {
            ...column.options,
            display: true
          }
        };
      }
      return {
        ...column,
        options: {
          ...column.options,
          display: false
        }
      };
    }

    // For desktop, show all columns
    return {
      ...column,
      options: {
        ...column.options,
        display: true
      }
    };
  });
};
