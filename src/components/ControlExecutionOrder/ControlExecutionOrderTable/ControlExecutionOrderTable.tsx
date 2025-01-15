import MUIDataTable from "mui-datatables";
import { StyledEngineProvider, ThemeProvider } from "@mui/material/styles";
import { Loading } from 'src/components/Common/Loading';
import { darkTheme } from "src/styles/themes/themeTable";
import { DeleteButton } from "src/components/Common/Buttons/DeleteButton";
import { useDynamicFilter } from "src/hooks/useProductFilter";
import { useResponsiveColumns } from "src/hooks/useResponsiveColumns";
import { useDateRangeFilter } from "src/hooks/useDateRangeFilter";
import { ExportButton } from "src/components/Common/Buttons/ExportButton";
import { PrintButton } from "src/components/Common/Buttons/PrintButton";
import { ViewButton } from "src/components/Common/Buttons/ViewButton/ViewButton";
import { useState } from "react";
import { AiOutlineCheck, AiOutlineClose } from "react-icons/ai";
import { Chip } from "@nextui-org/react";


export const ControlExecutionOrderTable: React.FC<TableControlExecutionOrderProps> = ({
    data,
    searchTerm,
    selectedRange,
    isLoading,
    isError,
    isFetching,
    isSuccess,
    handleView,
    handleDelete,
    handleStateUpdate,
    handlePrint,
    handleExportPDF,
    }) => {
    const [confirmStateIndex, setConfirmStateIndex] = useState<number | null>(null);
    const [confirmDeleteIndex, setConfirmDeleteIndex] = useState<number | null>(null);
    const filteredData = useDynamicFilter(data, searchTerm, ['description', 'state', 'form.num', 'total']);
    const filteredByDateRange = useDateRangeFilter(filteredData, selectedRange);
    const rows = filteredByDateRange.map(executionOrder => ({
        num: executionOrder.form.num,
        description: executionOrder.description,
        dateCreation: new Date(executionOrder.form.dateCreation).toLocaleDateString(),
        dateUpdate: executionOrder.form.dateUpdate ? new Date(executionOrder.form.dateUpdate).toLocaleDateString() : "", 
        state: executionOrder.state,
        executionOrderId: executionOrder._id, 
        executionOrder: executionOrder,
    }));

    const columns = [
    {
        name: "num",
        label: "N°",
        options: { filter: false, sort: true },
    },
    {
        name: "description",
        label: "Descripción",
        options: { filter: true, sort: true },
    },
    {
        name: "dateCreation",
        label: "Fecha de Creación",
        options: { 
            filter: false, 
            sort: false ,
            setCellHeaderProps: () => ({
                style: { textAlign: 'center' },
            }),
            customBodyRender: (value: string) => {
                return (
                    <div className="flex justify-center">
                        {value}
                    </div>
                )
            },
        },
    },
    {
        name: "dateUpdate",
        label: "Fecha de Actualización",
        options: { 
            filter: false, 
            sort: false ,
            setCellHeaderProps: () => ({
                style: { textAlign: 'center' },
            }),
            customBodyRender: (value: string) => {
                return (
                    <div className="flex justify-center">
                        {value}
                    </div>
                )
            },
        },
    },
    {
        name: "state",
        label: "Estado",
        options: {
            filter: true,
            sort: false,
            setCellHeaderProps: () => ({
                style: { textAlign: 'center' },
            }),
            customBodyRender: (value: any, tableMeta: any) => {             
                const executionOrder = rows[tableMeta.rowIndex].executionOrder;
                const isConfirmingState = confirmStateIndex === tableMeta.rowIndex; // Verifica si esta fila está en modo confirmación
    
                if (value === "Finalizado") {
                    return (
                        <div className="flex justify-center">
                            <Chip 
                                color="default"
                                size="md"
                                variant="flat"
                                >
                                    {value}
                            </Chip>
                        </div>
                    );
                }
    
                // Modo de confirmación con íconos solo para la fila seleccionada
                if (isConfirmingState) {
                    return (
                        <>
                            <p className="text-center mb-1 font-semibold">Confirmar Cambio</p>
                            <div className="flex justify-center gap-2">
                                <button
                                    className="rounded-full bg-red-600/40 px-2 py-2 text-white text-sm flex items-center hover:bg-red-500"
                                    onClick={() => setConfirmStateIndex(null)} // Cancelar confirmación
                                >
                                    <AiOutlineClose />
                                </button>
                                <button
                                    className="rounded-full bg-green-600/40 px-2 py-2 text-white text-sm flex items-center hover:bg-green-500"
                                    onClick={() => {
                                        setConfirmStateIndex(null);
                                        value === "En proceso" && handleStateUpdate(executionOrder._id);  
                                    }}
                                >
                                    <AiOutlineCheck />
                                </button>
                            </div>
                        </>
                    );
                }
    
                // Si no está en confirmación, muestra el botón normal
                return (
                    <div className="flex justify-center"> 
                        <Chip 
                            color="success"
                            className="cursor-pointer hover:bg-green-500/50" 
                            size="md"
                            variant="flat"
                            onClick={() => setConfirmStateIndex(tableMeta.rowIndex)}
                            >
                                {value}
                        </Chip>
                    </div>
                );
            },
        },
    },
    {
        name: "options",
        label: "Opciones",
        options: {
            sort: false,
            filter: false,
            setCellHeaderProps: () => ({
                style: { textAlign: "center" },
            }),
            customBodyRender: (value: any, tableMeta: any) => {
                const executionOrder = rows[tableMeta.rowIndex].executionOrder;
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
                                            setConfirmDeleteIndex(null); 
                                            handleDelete(executionOrder._id); // Ejecutar eliminación
                                        }}
                                    >
                                        <AiOutlineCheck />
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                {/* Botón de vista */}
                                <ViewButton onClick={() => handleView(executionOrder)} />
                
                                {/* Botón de exportar */}
                                <ExportButton onClick={() => handleExportPDF(executionOrder)} />
                
                                {/* Botón de imprimir */}
                                <PrintButton onClick={() => handlePrint(executionOrder)} />
                
                                {/* Botón de eliminar */}
                                <DeleteButton onClick={() => setConfirmDeleteIndex(tableMeta.rowIndex)} />
                            </>
                        )}
                    </div>
                );
            },
        },
    }
    ];

    const mobileColumnsToShow = ['num', 'dateCreation', 'state', 'options'];
    const tabletColumnsToShow = ['num', 'dateCreation', 'dateUpdate', 'state', 'options'];
    const responsiveColumns = useResponsiveColumns(
      columns,
      mobileColumnsToShow,
      tabletColumnsToShow,
    );

    // Opciones de la tabla
    const options = {
        responsive: "standard",
        pagination: true,
        search: false,
        selectableRows: "none",
        rowsPerPage: 10,
        rowsPerPageOptions: [5, 10, 20, 50],
        textLabels: {
            body: {
                noMatch: "NO HAY ORDENES DE EJECUCIÓN CREADAS..",
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
            <p className="text-red-600">Error al cargar las ordenes..</p>
        ) : isSuccess ? (
            <StyledEngineProvider injectFirst>
            <ThemeProvider theme={darkTheme}>
                <MUIDataTable
                title={"Lista de Ordenes de Ejecución"}
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
