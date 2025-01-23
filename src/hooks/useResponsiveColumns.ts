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
  tabletColumnsToShow: string[] = [],
  showIdColumn: boolean = true, // Valor por defecto: true
  showPriceColumn: boolean = true // Valor por defecto: true
) => {
  const isMobile = useMediaQuery('(max-width:600px)');
  const isTablet = useMediaQuery('(min-width:601px) and (max-width:960px)');

  return columns.map(column => {
    if (column.name === "_id") {
      return {
        ...column,
        options: {
          ...column.options,
          display: showIdColumn, // Mostrar/ocultar la columna "_id"
        },
      };
    }

    if (column.name === "price") {
      return {
        ...column,
        options: {
          ...column.options,
          display: showPriceColumn, // Mostrar/ocultar la columna "price"
        },
      };
    }

    if (isMobile) {
      // En vista móvil, mostrar solo las columnas especificadas
      if (mobileColumnsToShow.includes(column.name)) {
        return {
          ...column,
          options: {
            ...column.options,
            display: true,
          },
        };
      }
      return {
        ...column,
        options: {
          ...column.options,
          display: false,
        },
      };
    }

    if (isTablet) {
      // En vista tablet, mostrar solo las columnas especificadas
      if (tabletColumnsToShow.includes(column.name)) {
        return {
          ...column,
          options: {
            ...column.options,
            display: true,
          },
        };
      }
      return {
        ...column,
        options: {
          ...column.options,
          display: false,
        },
      };
    }

    // Para escritorio, mostrar todas las columnas
    return {
      ...column,
      options: {
        ...column.options,
        display: true,
      },
    };
  });
};
