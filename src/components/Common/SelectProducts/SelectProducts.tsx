import MUIDataTable from "mui-datatables";
import { StyledEngineProvider, ThemeProvider } from "@mui/material/styles";
import { darkTheme } from "src/styles/themes/themeTable";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { useResponsiveColumns } from "src/hooks/useResponsiveColumns";
import { Typography } from "@mui/material";

export const SelectProducts: React.FC<{
  data: Product[],
  onAddProduct: (product: Product) => void,
  onCloseTable: () => void,
  isError: boolean,
}> = ({ data, onAddProduct, onCloseTable, isError }) => {

  const columns = [
    { 
      name: "_id", 
      label: "ID", 
      options: { filter: true, sort: true } 
    },
    { 
      name: "name", 
      label: "Nombre", 
      options: { filter: true, sort: true } 
    },
    { 
      name: "vehicleType", 
      label: "Modelo de Vehículo", 
      options: { filter: true, sort: true } 
    },
    { 
      name: "description", 
      label: "Descripción", 
      options: { filter: true, sort: false },
    },
    { 
      name: "category", 
      label: "Categoría", 
      options: { filter: true, sort: false } 
    },
    { 
      name: "quantity", 
      label: "Cantidad", 
      options: { filter: true, sort: true } 
    },
    { 
      name: "price", 
      label: "Precio", 
      options: { filter: true, sort: true } 
    },
  ];

  const options = {
    responsive: "standard",
    selectableRows: "none",
    pagination: true,
    rowsPerPage: 10,
    rowsPerPageOptions: [5, 10, 20, 50],
    onRowClick: (rowData: any) => {
      const selectedProduct = {
        _id: rowData[0],
        name: rowData[1],
        vehicleType: rowData[2],
        description: rowData[3],
        category: rowData[4],
        quantity: rowData[5],
        price: rowData[6],
      };
      onAddProduct(selectedProduct);
    },
    textLabels: {
      body: {
        noMatch: "AGREGA PRODUCTOS..",
      },
      pagination: {
        rowsPerPage: "Filas por página",
        displayRows: "de",
      },
      toolbar: {
        viewColumns: "Ver Columnas",
        filterTable: "Filtrar Tabla",
        downloadCsv: "Descargar CSV",
        print: "Imprimir",
      },
    },
    customToolbar: () => (
      <IconButton onClick={onCloseTable}>
        <CloseIcon />
      </IconButton>
    ),
  };

  const mobileColumnsToShow = ['name', 'quantity', 'price'];
  const tabletColumnsToShow = ['name', 'vehicleType', 'quantity', 'price'];
  const responsiveColumns = useResponsiveColumns(
    columns,
    mobileColumnsToShow,
    tabletColumnsToShow
  );

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={darkTheme}>
        <div className="w-full max-h-[750px] overflow-y-auto">
          <MUIDataTable 
            title={"Lista de Productos"} 
            data={data} 
            columns={responsiveColumns} 
            options={options} 
          />
        </div>
        {isError && (
          <Typography variant="h4" color="error">
            Hubo un error al cargar la lista de productos. Por favor, intente nuevamente.
          </Typography>
        )}
      </ThemeProvider>
    </StyledEngineProvider>
  );
};
