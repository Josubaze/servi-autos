import MUIDataTable from "mui-datatables";
import { StyledEngineProvider, ThemeProvider } from "@mui/material/styles";
import { Loading } from 'src/components/Common/Loading';
import { darkTheme } from "src/styles/themes/themeTable";
import { UpdateButton } from "src/components/Common/Buttons/UpdateButton";
import { DeleteButton } from "src/components/Common/Buttons/DeleteButton";
import { useDynamicFilter } from "src/hooks/useProductFilter";
import { useResponsiveColumns } from "src/hooks/useResponsiveColumns";
import { useDateRangeFilter } from "src/hooks/useDateRangeFilter";
import { ExportButton } from "src/components/Common/Buttons/ExportButton";
import { PrintButton } from "src/components/Common/Buttons/PrintButton";
import { ViewButton } from "src/components/Common/Buttons/ViewButton/ViewButton";
import { NumericFormat } from "react-number-format";
import { AiOutlineCheck, AiOutlineClose } from "react-icons/ai";
import { useState } from "react";
import { Chip } from "@nextui-org/react";

export const ControlPurchaseOrderTable: React.FC<TableControlPurchaseOrderProps> = ({
    data,
    searchTerm,
    selectedRange,
    isLoading,
    isError,
    isFetching,
    isSuccess,
    handleView,
    handleDelete,
    handleUpdate,
    handleStateUpdate,
    handlePrint,
    handleExportPDF,
    }) => {
    const [isLoadingUp, setIsLoadingUp] = useState(false);
    const [confirmStateIndex, setConfirmStateIndex] = useState<number | null>(null);
    const [confirmDeleteIndex, setConfirmDeleteIndex] = useState<number | null>(null);
    const filteredData = useDynamicFilter(data, searchTerm, ['description', 'state', 'form.num', 'total']);
    const filteredByDateRange = useDateRangeFilter(filteredData, selectedRange);
    const rows = filteredByDateRange.map(purchaseOrder => ({
        num: purchaseOrder.form.num,
        description: purchaseOrder.description,
        dateCreation: new Date(purchaseOrder.form.dateCreation).toLocaleDateString(),
        dateUpdate: purchaseOrder.form.dateUpdate ? new Date(purchaseOrder.form.dateUpdate).toLocaleDateString() : "", 
        state: purchaseOrder.state,
        total: purchaseOrder.total,
        totalWithIgft: purchaseOrder.totalWithIgft,
        purchaseOrderId: purchaseOrder._id, 
        purchaseOrder: purchaseOrder,
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
        name: "total",
        label: "Monto Total",
        options: { 
            filter: true, 
            sort: true,
            customBodyRender: (value: number, tableMeta: any) => {
                const currency = rows[tableMeta.rowIndex].purchaseOrder.form.currency;
    
                // Selecciona el valor correcto según la moneda
                const total = currency === "$" ? rows[tableMeta.rowIndex].purchaseOrder.totalWithIgft : rows[tableMeta.rowIndex].purchaseOrder.total;
    
                return (
                    <NumericFormat
                        value={total} // Pasa el valor correcto (total o totalWithIgft)
                        displayType="text"
                        thousandSeparator="."
                        decimalSeparator=","
                        fixedDecimalScale={true}
                        decimalScale={2}
                        renderText={(formattedValue) => 
                            (currency === '$' ? <label>{'$ '+formattedValue}</label> : <label>{'Bs '+formattedValue}</label>)
                        }
                    />
                );
            },
        },
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
                style: { textAlign: "center" },
            }),
            customBodyRender: (value: any, tableMeta: any) => {
                const purchaseOrder = rows[tableMeta.rowIndex].purchaseOrder;
                const isConfirmingState = confirmStateIndex === tableMeta.rowIndex; // Verifica si esta fila está en modo confirmación
    
                // Botón para estado "Aprobado" (sin acción)
                if (value === "Recibida") {
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

                if (value === "Borrador") {
                    return (
                        <div className="flex justify-center">
                            <Chip                       
                                color="warning" 
                                className="cursor-pointer hover:bg-orange-400/50" 
                                size="md"
                                variant="flat"
                                isDisabled={isLoadingUp}
                                onClick={() => {
                                    setIsLoadingUp(true);
                                    handleUpdate(purchaseOrder._id);
                                    setTimeout(() => {
                                        setIsLoadingUp(false); 
                                    }, 10000);
                                }}
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
                                        setConfirmStateIndex(null); // Cerrar confirmación
                                        handleStateUpdate(purchaseOrder._id); // Ejecutar acción
                                    }}
                                >
                                    <AiOutlineCheck />
                                </button>
                            </div>
                        </>
                    );
                }
    
                // Botón inicial para estado "Borrador"
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
                const purchaseOrder = rows[tableMeta.rowIndex].purchaseOrder;
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
                                            handleDelete(purchaseOrder._id); // Ejecutar eliminación
                                        }}
                                    >
                                        <AiOutlineCheck />
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                {/* Botón de vista */}
                                <ViewButton onClick={() => handleView(purchaseOrder)} />
            
                                {/* Botón de actualización solo si el estado no es "Aprobado" */}
                                {purchaseOrder.state !== "Recibida" && (
                                    <UpdateButton onClick={() => handleUpdate(purchaseOrder._id)} />
                                )}
            
                                {/* Botón de exportar */}
                                <ExportButton onClick={() => handleExportPDF(purchaseOrder)} />
            
                                {/* Botón de imprimir */}
                                <PrintButton onClick={() => handlePrint(purchaseOrder)} />
            
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
            noMatch: "NO HAY ÓRDENDES DE COMPRA..",
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
            <p className="text-red-600">Error al cargar órdenes de compra..</p>
        ) : isSuccess ? (
            <StyledEngineProvider injectFirst>
            <ThemeProvider theme={darkTheme}>
                <MUIDataTable
                title={"Lista de Órdendes de Compra"}
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
