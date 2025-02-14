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

export const ControlBudgetTable: React.FC<TableControlBudgetProps> = ({
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
    const [confirmStateIndex, setConfirmStateIndex] = useState<number | null>(null);
    const filteredData = useDynamicFilter(data, searchTerm, ['description', 'state', 'form.num', 'total', '_id']);
    const filteredByDateRange = useDateRangeFilter(filteredData, selectedRange);
    const rows = filteredByDateRange.map(budget => ({
        num: budget.form.num,
        description: budget.description,
        dateCreation: new Date(budget.form.dateCreation).toLocaleDateString(),
        dateUpdate: budget.form.dateUpdate ? new Date(budget.form.dateUpdate).toLocaleDateString() : "", 
        state: budget.state,
        total: budget.total,
        totalWithIgft: budget.totalWithIgft,
        budgetId: budget._id, 
        budget: budget,
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
                const currency = rows[tableMeta.rowIndex].budget.form.currency;
    
                // Selecciona el valor correcto según la moneda
                const total = currency === "$" ? rows[tableMeta.rowIndex].budget.totalWithIgft : rows[tableMeta.rowIndex].budget.total;
    
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
                const budget = rows[tableMeta.rowIndex].budget;
                const isConfirmingState = confirmStateIndex === tableMeta.rowIndex; // Verifica si esta fila está en modo confirmación
    
                // Botón para estado "Aprobado" (sin acción)
                if (value === "Aprobado") {
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
                                        setConfirmStateIndex(null); // Cerrar confirmación
                                        handleStateUpdate(budget._id); // Ejecutar acción
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
                const budget = rows[tableMeta.rowIndex].budget; 
                return (
                    <div className="flex gap-x-5 justify-center items-center">                    
                        {/* Botón de vista */}
                        <ViewButton onClick={() => handleView(budget)} />
    
                        {/* Botón de actualización solo si el estado no es "Aprobado" */}
                        {budget.state !== "Aprobado" && (
                            <UpdateButton onClick={() => handleUpdate(budget._id)} />
                        )}
    
                        {/* Botón de exportar */}
                        <ExportButton onClick={() => handleExportPDF(budget)} />
    
                        {/* Botón de imprimir */}
                        <PrintButton onClick={() => handlePrint(budget)} />
    
                        {/* Botón de eliminar */}
                        <DeleteButton onClick={() => handleDelete(budget._id)} />
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
            noMatch: "AGREGA NUEVOS PRESUPUESTOS..",
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
            <p className="text-red-600">Error al cargar presupuestos..</p>
        ) : isSuccess ? (
            <StyledEngineProvider injectFirst>
            <ThemeProvider theme={darkTheme}>
                <MUIDataTable
                title={"Lista de Presupuestos"}
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
