import MUIDataTable from "mui-datatables";
import { StyledEngineProvider, ThemeProvider } from "@mui/material/styles";
import { darkThemeSolid } from "src/styles/themes/themeTable";
import { Loading } from 'src/components/Common/Loading';
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { useResponsiveColumns } from "src/hooks/useResponsiveColumns";

export const SelectProviders: React.FC<{
  data: Provider[],
  isLoading: boolean,
  isError: boolean,
  isFetching: boolean,
  isSuccess: boolean,
  onSelectProvider: (provider: Provider) => void
  onCloseTable: () => void,
}> = ({
  data,
  isLoading,
  isError,
  isFetching,
  isSuccess,
  onSelectProvider,
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
      name: "contactName", 
      label: "Nombre de contacto", 
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
  tabletColumnsToShow
  );

  const rows = data.map(provider => ({
    _id: provider._id,
    id_card: provider.id_card, 
    name: provider.name,
    contactName: provider.contactName,
    email: provider.email,
    phone: provider.phone,
    address: provider.address 
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
    rowsPerPageOptions: [5, 10, 20,30, 50],
    textLabels: {
      body: {
        noMatch: "No se encontraron proveedores.",
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
      const selectedProvider = {
        _id: rowData[0],
        id_card: rowData[1],
        name: rowData[2],
        contactName: rowData[3],
        email: rowData[4],
        phone: rowData[5],
        address: rowData[6],
      };
      // Guardar el provider seleccionado en el estado local
      onSelectProvider(selectedProvider);
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
        <p className="text-red-600">Error al cargar los proveedores.</p>
      ) : isSuccess ? (
        <StyledEngineProvider injectFirst>
          <ThemeProvider theme={darkThemeSolid}>
          <div className="w-full max-h-[750px] overflow-y-auto">
            <MUIDataTable
              title={"Lista de Proveedores"}
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