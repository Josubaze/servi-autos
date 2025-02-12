import MUIDataTable from "mui-datatables";
import { StyledEngineProvider, ThemeProvider } from "@mui/material/styles";
import { Loading } from 'src/components/Common/Loading';
import { useDynamicFilter } from "src/hooks/useProductFilter";
import { useResponsiveColumns } from "src/hooks/useResponsiveColumns";
import { darkTheme } from "src/styles/themes/themeTable";
import { UpdateButton } from "src/components/Common/Buttons/UpdateButton";
import { DeleteButton } from "src/components/Common/Buttons/DeleteButton";
import { useState } from "react";
import { AiOutlineCheck, AiOutlineClose } from "react-icons/ai";

export const CustomersTable: React.FC<TableCustomerProps> = ({
  data,
  searchTerm,
  isLoading,
  isError,
  isFetching,
  isSuccess,
  handleDelete,
  handleEdit,
}) => {
   const [confirmDeleteIndex, setConfirmDeleteIndex] = useState<number | null>(null);
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
      label: "Cédula | RIF", 
      options: { filter: false, sort: true} 
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
            const customer = {
                _id: rowData[0],
                id_card: rowData[1],
                name: rowData[2],
                email: rowData[3],
                phone: rowData[4],
                address: rowData[5],
            };
        
            const isConfirmingDelete = confirmDeleteIndex === tableMeta.rowIndex;
        
            return (
                <div className="flex gap-x-5 justify-center items-center">
                    {isConfirmingDelete ? (
                        <>
                            <p className="font-semibold">Confirmar Eliminación</p>
                            <div className="flex gap-2">
                                <button
                                    className="bg-red-600/40 text-white rounded-full px-2 py-2 flex items-center hover:bg-red-500"
                                    onClick={() => setConfirmDeleteIndex(null)} // Cancelar confirmación
                                >
                                    <AiOutlineClose />
                                </button>
                                <button
                                    className="bg-green-600/40 text-white rounded-full px-2 py-2 flex items-center hover:bg-green-500"
                                    onClick={() => {
                                        setConfirmDeleteIndex(null); // Cerrar confirmación
                                        handleDelete(customer._id); // Ejecutar eliminación
                                    }}
                                >
                                    <AiOutlineCheck />
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <UpdateButton onClick={() => handleEdit(customer)} />
                            <DeleteButton onClick={() => setConfirmDeleteIndex(tableMeta.rowIndex)} />
                        </>
                    )}
                </div>
            );
        },
      
      },
    }
  ];

    const mobileColumnsToShow = ['id_card', 'phone', 'options'];
    const tabletColumnsToShow = ['id_card', 'name', 'email', 'phone', 'options'];
    const responsiveColumns = useResponsiveColumns(
    columns,
    mobileColumnsToShow,
    tabletColumnsToShow,
    false,   
    );

    const filteredData = useDynamicFilter(data, searchTerm, ['id_card', 'name', 'email']);
    const rows = filteredData.map(customer => ({
      _id: customer._id,
      id_card: customer.id_card,
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
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
        noMatch: "AGREGA CLIENTES..",
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
        <p className="text-red-600">Error al cargar los clientes..</p>
      ) : isSuccess ? (
        <StyledEngineProvider injectFirst>
          <ThemeProvider theme={darkTheme}>
            <MUIDataTable
              title={"Lista de Clientes"}
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
