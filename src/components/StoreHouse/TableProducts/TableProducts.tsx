
import MUIDataTable from "mui-datatables";
import { StyledEngineProvider, ThemeProvider } from "@mui/material/styles";
import { Loading } from 'src/components/Common/Loading';
import { useDynamicFilter } from "src/hooks/useProductFilter";
import { useResponsiveColumns } from "src/hooks/useResponsiveColumns";
import { darkTheme } from "src/styles/themes/themeTable";
import { UpdateButton } from "src/components/Common/Buttons/UpdateButton";
import { DeleteButton } from "src/components/Common/Buttons/DeleteButton";
import { useSession } from "next-auth/react";

export const TableProducts: React.FC<TableProductProps> = ({
  data,
  searchTerm,
  isLoading,
  isError,
  isFetching,
  isSuccess,
  handleDelete,
  handleEdit,
}) => {
  const { data: session } = useSession(); 
  const isLider = session?.user.role === 'lider';
  const columns = [
    { 
      name: "id", 
      label: "ID", 
      options: { filter: false, sort: true } 
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
      name: "minStock", 
      label: "Stock Mínimo", 
      options: { filter: true, sort: true } 
    },
    { 
      name: "price", 
      label: "Precio", 
      options: { filter: true, sort: true } 
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
          const product = {
            _id: rowData[0],
            name: rowData[1],
            vehicleType: rowData[2],
            description: rowData[3],
            category: rowData[4],
            quantity: rowData[5],
            minStock:rowData[6],
            price: rowData[7],         
          };      
          return (
            <div className='flex gap-x-5 justify-center'>
              <UpdateButton onClick={() => handleEdit(product)}></UpdateButton>
              <DeleteButton onClick={() => handleDelete(product._id)}></DeleteButton>
            </div>
          );
        },
      },
    }
  ];

  const mobileColumnsToShow = ['name', 'quantity', 'price', 'options'];
  const tabletColumnsToShow = ['id', 'name', 'vehicleType', 'quantity', 'price', 'options'];
  const responsiveColumns = useResponsiveColumns(
    columns,
    mobileColumnsToShow,
    tabletColumnsToShow,
    ...(isLider ? [true, false, false] : [])
  );

  const filteredData = useDynamicFilter(data, searchTerm, ['_id', 'name', 'category', 'vehicleType']);
  const rows = filteredData.map(product => ({
    id: product._id,
    name: product.name,
    vehicleType: product.vehicleType,
    description: product.description,
    category: product.category,
    quantity: product.quantity,
    minStock: product.minStock,
    price: product.price,
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
  };

  return (
    <>
      {isLoading || isFetching ? (
        <div className="flex justify-center items-center h-[500px]">
          <Loading />
        </div>
      ) : isError ? (
        <p className="text-red-600 text-center mt-10">Error al cargar los productos..</p>
      ) : isSuccess ? (
        <StyledEngineProvider injectFirst>
          <ThemeProvider theme={darkTheme}>
            <MUIDataTable
              title={"Lista de Productos"}
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
