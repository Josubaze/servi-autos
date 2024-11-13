import MUIDataTable from "mui-datatables";
import { StyledEngineProvider, ThemeProvider } from "@mui/material/styles";
import { Loading } from 'src/components/Common/Loading';
import { useDynamicFilter } from "src/hooks/useProductFilter";
import { useResponsiveColumns } from "src/hooks/useResponsiveColumns";
import { darkTheme } from "src/styles/themes/themeTable";
import { DeleteButton } from "src/components/Common/Buttons/DeleteButton";
import { UpdateButton } from "src/components/Common/Buttons/UpdateButton";

export const ProvidersTable: React.FC<TableProviderProps> = ({
  data,
  searchTerm,
  isLoading,
  isError,
  isFetching,
  isSuccess,
  handleDelete,
  handleEdit,
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
      name: "contactName", 
      label: "Nombre de Contacto", 
      options: { filter: true, sort: true },
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
    {
      name: "options", 
      label: "Opciones",
      options: {
        sort: false,
        filter: false,
        setCellHeaderProps: () => ({
          style: {
            textAlign: 'right',
          },
        }),
        customBodyRender: (value: any, tableMeta: any) => {
          const rowData = tableMeta.rowData;
          const provider = { 
            _id: rowData[0],
            name: rowData[1],
            contactName: rowData[2],
            email: rowData[3],
            phone: rowData[4],
            address: rowData[5],
          };
          return (
            <div className='flex py-2 gap-5 justify-end'>
              <UpdateButton onClick={() => handleEdit(provider)}/>
              <DeleteButton onClick={() => handleDelete(provider._id)}/>
            </div>
          );
        },
      },
    }
  ];

  const mobileColumnsToShow = ['name', 'phone', 'options'];
  const tabletColumnsToShow = ['name', 'contactName', 'email', 'phone', 'options'];
  const responsiveColumns = useResponsiveColumns(
    columns,
    mobileColumnsToShow,
    tabletColumnsToShow,
    false
  );

  const filteredData = useDynamicFilter(data, searchTerm, ['_id', 'name', 'contactName', 'email']);
  const rows = filteredData.map(provider => ({
    _id: provider._id,
    name: provider.name,
    contactName: provider.contactName,
    email: provider.email,
    phone: provider.phone,
    address: provider.address,
  }));

  const options = {
    responsive: "standard",
    pagination: true,
    search: false,
    selectableRows: "none",
    rowsPerPage: 10,
    rowsPerPageOptions: [5, 10, 20, 50],
    textLabels: {
      body: {
        noMatch: "AGREGA PROVEEDORES..",
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
  };

  return (
    <>
      {isLoading || isFetching ? (
        <Loading color="#3730a3" size={100} justify="center" pt={32} />
      ) : isError ? (
        <p className="text-red-600">Error al cargar los proveedores..</p>
      ) : isSuccess ? (
        <StyledEngineProvider injectFirst>
          <ThemeProvider theme={darkTheme}>
            <MUIDataTable
              title={"Lista de Proveedores"}
              data={rows}
              columns={responsiveColumns}
              options={options}
            />
          </ThemeProvider>
        </StyledEngineProvider>
      ) : null}
    </>
  );
};
