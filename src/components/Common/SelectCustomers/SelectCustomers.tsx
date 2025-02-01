import MUIDataTable from "mui-datatables";
import { StyledEngineProvider, Theme, ThemeProvider } from "@mui/material/styles";
import { darkThemeSolid } from "src/styles/themes/themeTable";
import { Loading } from 'src/components/Common/Loading';
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { useResponsiveColumns } from "src/hooks/useResponsiveColumns";

export const SelectCustomers: React.FC<{
  data: Customer[],
  isLoading: boolean,
  isError: boolean,
  isFetching: boolean,
  isSuccess: boolean,
  theme?: Theme,
  rowsPerPage?: number,
  onSelectCustomer?: (customer: Customer) => void
  onCloseTable?: () => void,
}> = ({
  data,
  isLoading,
  isError,
  isFetching,
  isSuccess,
  theme,
  rowsPerPage,
  onSelectCustomer,
  onCloseTable
}) => {

  const columns = [
    { 
      name: "_id", 
      label: "ID", 
      options: { 
        filter: false, 
        sort: true,
      } 
    },
    { 
      name: "id_card", 
      label: "Cédula o RIF", 
      options: { filter: false, sort: true } 
    },
    { 
      name: "name", 
      label: "Nombre", 
      options: { filter: true, sort: true } 
    },
    { 
      name: "email", 
      label: "Correo Electrónico", 
      options: { filter: true, sort: true },
    },
    { 
      name: "phone", 
      label: "Teléfono", 
      options: { filter: true, sort: false } 
    },
    { 
      name: "address", 
      label: "Dirección",  
      options: { filter: true, sort: false }
    },
  ];

  const mobileColumnsToShow = ['name', 'phone', 'email'];
  const tabletColumnsToShow = ['name', 'email', 'phone', 'address'];
  const responsiveColumns = useResponsiveColumns(
  columns,
  mobileColumnsToShow,
  tabletColumnsToShow,
  false
  );

  const rows = data.map(customer => ({
    _id: customer._id,
    id_card: customer.id_card, 
    name: customer.name,
    email: customer.email,
    phone: customer.phone,
    address: customer.address 
  }));

  const options = {
    responsive: "standard",
    pagination: true,
    selectableRows: "none",
    download: false, 
    print: false, 
    customToolbar: onSelectCustomer
        ? () => (
            <IconButton onClick={onCloseTable}>
              <CloseIcon />
            </IconButton>
          )
        : undefined,
    rowsPerPage: rowsPerPage || 10,
    rowsPerPageOptions: [5, 10, 20,30, 50],
    textLabels: {
      body: {
        noMatch: "No se encontraron clientes.",
      },
      pagination: {
        rowsPerPage: "Filas por página",
        displayRows: "de",
      },
      toolbar: {
        viewColumns: "Ver Columnas",
        filterTable: "Filtrar Tabla",
        search: "Buscar"
      },
    },
    onRowClick: (rowData: any) => {
      const selectedCustomer = {
        _id: rowData[0],
        id_card: rowData[1],
        name: rowData[2],
        email: rowData[3],
        phone: rowData[4],
        address: rowData[5],
      };
      if(onSelectCustomer){
        onSelectCustomer(selectedCustomer);
      }
    },
    setRowProps: () => ({
        style: { cursor: 'pointer' }
    }),
  };

  return (
    <>
      {isLoading || isFetching ? (
        <div className="flex justify-center items-center h-[500px]">
          <Loading />
        </div>
      ) : isError ? (
        <p className="text-red-600">Error al cargar los clientes.</p>
      ) : isSuccess ? (
        <StyledEngineProvider injectFirst>
          <ThemeProvider theme={theme || darkThemeSolid}>
          <div className="w-full max-h-[750px] overflow-y-auto">
            <MUIDataTable
              title={"Lista de Clientes"}
              data={rows}
              columns={responsiveColumns}
              options={options}
            />
          </div>
          </ThemeProvider>
        </StyledEngineProvider>
      ) : null}
    </>
  );
};