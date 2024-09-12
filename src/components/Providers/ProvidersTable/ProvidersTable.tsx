import MUIDataTable from "mui-datatables";
import { StyledEngineProvider, ThemeProvider } from "@mui/material/styles";
import Tooltip from '@mui/material/Tooltip';
import { IoPencil } from "react-icons/io5";
import { MdDelete } from "react-icons/md";
import { Loading } from 'src/components/Common/Loading';
import { useDynamicFilter } from "src/hooks/useProductFilter";
import { useResponsiveColumns } from "src/hooks/useResponsiveColumns";
import { darkTheme } from "src/styles/themes/themeTable";

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
      name: "address.city",
      label: "Ciudad", 
      options: { filter: true, sort: false }
    },
    { 
      name: "address.state", 
      label: "Estado", 
      options: { filter: true, sort: false }
    },
    {
      name: "Acciones",
      label: "Opciones",
      options: {
        sort: false,
        filter: false,
        customBodyRender: (value: any, tableMeta: any) => {
          const rowData = tableMeta.rowData;
          const provider = { // extraer data para el edit
            _id: rowData[0],
            name: rowData[1],
            contactName: rowData[2],
            email: rowData[3],
            phone: rowData[4],
            address: {
              city: rowData[5],
              state: rowData[6],
            },
          };
          return (
            <div className='flex py-2 gap-5'>
              <Tooltip title="Editar proveedor">
                <span>
                  <IoPencil className="cursor-pointer text-2xl text-gray-600 hover:text-indigo-600 transition ease-in-out delay-150 rounded hover:-translate-y-1 hover:scale-110 duration-300" 
                  onClick={() => handleEdit(provider)}
                  />
                </span>
              </Tooltip>
              <Tooltip title="Eliminar proveedor">
                <span>
                  <MdDelete
                  className="cursor-pointer text-2xl text-gray-600 hover:text-indigo-600 transition ease-in-out delay-150 rounded hover:-translate-y-1 hover:scale-110 duration-300"
                  onClick={() => handleDelete(provider._id)}
                  />
                </span>
              </Tooltip>
            </div>
          );
        },
      },
    }
  ];

  const mobileColumnsToShow = ['name', 'phone', 'email'];
  const tabletColumnsToShow = ['name', 'contactName', 'email', 'phone', 'address.city', 'address.state'];
  const responsiveColumns = useResponsiveColumns(
    columns,
    mobileColumnsToShow,
    tabletColumnsToShow
  );

  const filteredData = useDynamicFilter(data, searchTerm, ['_id', 'name', 'contactName', 'email']);
  const rows = filteredData.map(provider => ({
    _id: provider._id,
    name: provider.name,
    contactName: provider.contactName,
    email: provider.email,
    phone: provider.phone,
    address: {
      city: provider.address.city,
      state: provider.address.state
    }
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