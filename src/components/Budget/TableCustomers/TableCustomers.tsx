import MUIDataTable from "mui-datatables";
import { StyledEngineProvider, ThemeProvider } from "@mui/material/styles";
import { darkTheme } from "src/styles/themes/themeTable";
import { Loading } from 'src/components/Common/Loading';
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

export const TableCustomers: React.FC<{
  data: Customer[],
  isLoading: boolean,
  isError: boolean,
  isFetching: boolean,
  isSuccess: boolean,
  onSelectCustomer: (customer: Customer) => void
  onCloseTable: () => void,
}> = ({
  data,
  isLoading,
  isError,
  isFetching,
  isSuccess,
  onSelectCustomer,
  onCloseTable
}) => {

  const columns = [
    { 
      name: "_id", 
      label: "ID", 
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
      name: "city",
      label: "Ciudad", 
      options: { filter: true, sort: false }
    },
    { 
      name: "state", 
      label: "Estado", 
      options: { filter: true, sort: false }
    }
  ];

  const rows = data.map(customer => ({
    _id: customer._id,
    name: customer.name,
    email: customer.email,
    phone: customer.phone,
    city: customer.address.city, 
    state: customer.address.state 
  }));

  const options = {
    responsive: "standard",
    pagination: true,
    selectableRows: "none",
    download: false, 
    print: false, 
    customToolbar: () => {
        return (
            <IconButton onClick={onCloseTable}>
                <CloseIcon />
            </IconButton>
        )
    },
    rowsPerPage: 10,
    rowsPerPageOptions: [5, 10, 20],
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
        name: rowData[1],
        email: rowData[2],
        phone: rowData[3],
        address: {
          city: rowData[4],
          state: rowData[5],
        },
      };
      // Guardar el cliente seleccionado en el estado local
      onSelectCustomer(selectedCustomer);
    },
    setRowProps: () => ({
        style: { cursor: 'pointer' }
    }),
    tableBodyHeight: '600px'
  };

  return (
    <>
      {isLoading || isFetching ? (
        <Loading color="#3730a3" size={80} justify="center" pt={12} />
      ) : isError ? (
        <p className="text-red-600">Error al cargar los clientes.</p>
      ) : isSuccess ? (
        <StyledEngineProvider injectFirst>
          <ThemeProvider theme={darkTheme}>
            <MUIDataTable
              title={"Lista de Clientes"}
              data={rows}
              columns={columns}
              options={options}
            />
          </ThemeProvider>
        </StyledEngineProvider>
      ) : null}
    </>
  );
};