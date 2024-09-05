
import MUIDataTable from "mui-datatables";
import { StyledEngineProvider, ThemeProvider } from "@mui/material/styles";
import Tooltip from '@mui/material/Tooltip';
import { IoPencil } from "react-icons/io5";
import { MdDelete } from "react-icons/md";
import { darkTheme, useResponsiveColumns } from './style';
import { Loading } from 'src/components/Common/Loading';
import { useProductFilter } from "src/hooks/useProductFilter";

interface TableProductProps {
  data: Product[];
  searchTerm: string;
  isLoading: boolean;
  isError: boolean;
  isFetching: boolean;
  isSuccess: boolean;
  handleDelete: (productId: string) => void;
  handleEdit: (product: any) => void;
}

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
    
    {
      name: "Acciones",
      label: "Opciones",
      options: {
        sort: false,
        filter: false,
        customBodyRender: (value: any, tableMeta: any) => {
          const rowData = tableMeta.rowData;
          const product = {
            _id: rowData[0],
            name: rowData[1],
            description: rowData[2],
            category: rowData[3],
            quantity: rowData[4],
            price: rowData[5],
            
          };      
          return (
            <div className='flex py-2 gap-5'>
              <Tooltip title="Editar producto">
                <span>
                  <IoPencil className="cursor-pointer text-2xl text-gray-600 hover:text-indigo-600 transition ease-in-out delay-150 rounded hover:-translate-y-1 hover:scale-110 duration-300" 
                  onClick={() => handleEdit(product)}
                  />
                </span>
              </Tooltip>
              <Tooltip title="Eliminar producto">
                <span>
                  <MdDelete
                  className="cursor-pointer text-2xl text-gray-600 hover:text-indigo-600 transition ease-in-out delay-150 rounded hover:-translate-y-1 hover:scale-110 duration-300"
                  onClick={() => handleDelete(product._id)}
                  />
                </span>
              </Tooltip>
            </div>
          );
        },
      },
    }
  ];
  
  const responsiveColumns = useResponsiveColumns(columns);
  const filteredData = useProductFilter(data, searchTerm);
  const rows = filteredData.map(product => ({
    id: product._id,
    name: product.name,
    description: product.description,
    category: product.category,
    quantity: product.quantity,
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
        <Loading color="#3730a3" size={100} justify="center" pt={32} />
      ) : isError ? (
        <p className="text-red-600">Error al cargar los productos..</p>
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
