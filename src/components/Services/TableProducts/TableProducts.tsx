import MUIDataTable from "mui-datatables";
import { StyledEngineProvider, ThemeProvider } from "@mui/material/styles";
import { darkTheme } from "src/styles/themes/themeTable";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

export const TableProducts: React.FC<{
  data: Product[],
  onSelectProduct: (product: Product) => void,
  onCloseTable: () => void,
}> = ({ data, onSelectProduct, onCloseTable }) => {

  const columns = [
    { name: "name", label: "Producto" },
    { name: "vehicle_type", label: "Tipo" },
    { name: "description", label: "Descripción" },
    { name: "category", label: "Categoría" },
    { name: "quantity", label: "Cantidad" },
    { name: "price", label: "Precio" },
  ];

  const options = {
    selectableRows: "none",
    onRowClick: (rowData: any) => {
      const selectedProduct = {
        _id: rowData[0],
        name: rowData[1],
        vehicle_type: rowData[2],
        description: rowData[3],
        category: rowData[4],
        quantity: rowData[5],
        price: rowData[6],
      };
      onSelectProduct(selectedProduct);
    },
    customToolbar: () => (
      <IconButton onClick={onCloseTable}>
        <CloseIcon />
      </IconButton>
    ),
  };

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={darkTheme}>
        <MUIDataTable
          title={"Lista de Productos"}
          data={data}
          columns={columns}
          options={options}
        />
      </ThemeProvider>
    </StyledEngineProvider>
  );
};
