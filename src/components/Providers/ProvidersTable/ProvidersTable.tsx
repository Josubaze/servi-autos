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
      name: "id_card", 
      label: "Cédula | RIF", 
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
            textAlign: 'center',
          },
        }),
        customBodyRender: (value: any, tableMeta: any) => {
          const rowData = tableMeta.rowData;
          const provider = { 
            _id: rowData[0],
            id_card: rowData[1],
            name: rowData[2],
            contactName: rowData[3],
            email: rowData[4],
            phone: rowData[5],
            address: rowData[6],
          };
          return (
            <div className='flex gap-x-5 justify-center'>
              <UpdateButton onClick={() => handleEdit(provider)}/>
              <DeleteButton onClick={() => handleDelete(provider._id)}/>
            </div>
          );
        },
      },
    }
  ];

  const mobileColumnsToShow = ['name', 'phone', 'options'];
  const tabletColumnsToShow = ['id_card','name', 'contactName', 'phone', 'options'];
  const responsiveColumns = useResponsiveColumns(
    columns,
    mobileColumnsToShow,
    tabletColumnsToShow,
    false
  );

  const filteredData = useDynamicFilter(data, searchTerm, ['id_card','_id', 'name', 'contactName', 'email', 'address']);
  const rows = filteredData.map(provider => ({
    _id: provider._id,
    id_card: provider.id_card,
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
        <div className="flex justify-center items-center h-[500px]">
          <Loading />
        </div>
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
