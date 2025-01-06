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
    
    const filteredData = useDynamicFilter(data, searchTerm, ['description', 'form.num', 'total']);
    const filteredByDateRange = useDateRangeFilter(filteredData, selectedRange);
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
        label: "N° Nota de Crédito",
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
            return (
            <div className='flex gap-x-5 justify-center'>
                <ViewButton onClick={() => handleView(creditNote)} />
                <ExportButton onClick={() => handleExportPDF(creditNote)} />
                <PrintButton onClick={() => handlePrint(creditNote)} />
                <DeleteButton onClick={() => handleDelete(creditNote._id)} />
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
            <Loading />
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
