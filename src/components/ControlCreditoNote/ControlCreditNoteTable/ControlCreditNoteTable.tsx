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
import { NumericFormat } from "react-number-format";
import { useState } from "react";
import { AiOutlineCheck, AiOutlineClose } from "react-icons/ai";

export const ControlCreditNoteTable: React.FC<TableControlCreditNoteProps> = ({
    data,
    searchTerm,
    selectedRange,
    isLoading,
    isError,
    isFetching,
    isSuccess,
    handleView,
    handleDelete,
    handlePrint,
    handleExportPDF,
    }) => {
    
    const filteredData = useDynamicFilter(data, searchTerm, ['description', 'form.num', 'total', '_id']);
    const filteredByDateRange = useDateRangeFilter(filteredData, selectedRange);
    const [confirmDeleteIndex, setConfirmDeleteIndex] = useState<number | null>(null);
    const rows = filteredByDateRange.map(creditNote => ({
        num: creditNote.form.num,
        numInvoice: creditNote.form.numInvoice,
        description: creditNote.description,
        dateCreation: new Date(creditNote.form.dateCreation).toLocaleDateString(),
        total: creditNote.total,
        creditNoteId: creditNote._id, 
        creditNote: creditNote,
    }));

    const columns = [
    {
        name: "num",
        label: "N°",
        options: { filter: false, sort: true },
    },
    {
        name: "numInvoice",
        label: "N° Factura",
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
                const currency = rows[tableMeta.rowIndex].creditNote.form.currency;

                return (
                    <NumericFormat
                        value={value}
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
        name: "options",
        label: "Opciones",
        options: {
        sort: false,
        filter: false,
        setCellHeaderProps: () => ({
            style: { textAlign: 'center' },
        }),
        customBodyRender: (value: any, tableMeta: any) => {
            const creditNote = rows[tableMeta.rowIndex].creditNote;
            const isConfirmingDelete = confirmDeleteIndex === tableMeta.rowIndex;
        
            return (
                <div className="flex gap-x-5 justify-center items-center">
                    {isConfirmingDelete ? (
                        <>
                            <p className="font-semibold">Confirmar Eliminación</p>
                            <div className="flex gap-2">
                                <button
                                    className="bg-red-600/40 text-white rounded-full px-2 py-2 flex items-center hover:bg-red-500"
                                    onClick={() => setConfirmDeleteIndex(null)}
                                >
                                    <AiOutlineClose />
                                </button>
                                
                                <button
                                    className="bg-green-600/40 text-white rounded-full px-2 py-2 flex items-center hover:bg-green-500"
                                    onClick={() => {
                                        setConfirmDeleteIndex(null); 
                                        handleDelete(creditNote._id); // Ejecutar eliminación
                                    }}
                                >
                                    <AiOutlineCheck />
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <ViewButton onClick={() => handleView(creditNote)} />                       
                            <PrintButton onClick={() => handlePrint(creditNote)} />                          
                            <ExportButton onClick={() => handleExportPDF(creditNote)} />                         
                            <DeleteButton onClick={() => setConfirmDeleteIndex(tableMeta.rowIndex)} />
                        </>
                    )}
                </div>
            );
        },
        
        },
    }
      
    ];

    const mobileColumnsToShow = ['num', 'numInvoice', 'dateCreation', 'options'];
    const tabletColumnsToShow = ['num', 'numInvoice', 'description', 'dateCreation', 'options'];
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
            noMatch: "AGREGA NUEVAS NOTAS DE CRÉDITO..",
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
            <p className="text-red-600">Error al cargar notas de credito..</p>
        ) : isSuccess ? (
            <StyledEngineProvider injectFirst>
            <ThemeProvider theme={darkTheme}>
                <MUIDataTable
                title={"Lista de Notas de Crédito"}
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
