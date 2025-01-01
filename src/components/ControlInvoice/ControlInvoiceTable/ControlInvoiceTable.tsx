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

export const ControlInvoiceTable: React.FC<TableControlInvoiceProps> = ({
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
    handlePrint,
    handleExportPDF,
    }) => {
    
    const filteredData = useDynamicFilter(data, searchTerm, ['description', 'state', 'form.num', 'total']);
    const filteredByDateRange = useDateRangeFilter(filteredData, selectedRange);
    const rows = filteredByDateRange.map(invoice => ({
        num: invoice.form.num,
        description: invoice.description,
        dateCreation: new Date(invoice.form.dateCreation).toLocaleDateString(),
        dateUpdate: invoice.form.dateUpdate ? new Date(invoice.form.dateUpdate).toLocaleDateString() : "", 
        state: invoice.state,
        total: invoice.total,
        invoiceId: invoice._id, 
        invoice: invoice,
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
                const currency = rows[tableMeta.rowIndex].invoice.form.currency;

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
            customBodyRender: (value: string) => {
                const bgColor = 
                    value === "Borrador" ? "bg-gray-600" : 
                    value === "Pagada" ? "bg-green-600" : 
                    value === "Pendiente" ? "bg-yellow-400/85" : 
                    "bg-red-600";
            
                return (
                    <div className="flex justify-center"> 
                        <div 
                            className={`rounded-full px-4 py-1 text-center inline-block text-sm ${bgColor} w-24`}
                        >
                            {value}
                        </div>     
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
            style: { textAlign: 'center' },
        }),
        customBodyRender: (value: any, tableMeta: any) => {
            const invoice = rows[tableMeta.rowIndex].invoice;
            return (
            <div className='flex gap-x-5 justify-center'>
                <ViewButton onClick={() => handleView(invoice)} />
                {invoice.state !== "Pagada" && (
                <UpdateButton onClick={() => handleUpdate(invoice._id)} />
                )}
                <ExportButton onClick={() => handleExportPDF(invoice)} />
                <PrintButton onClick={() => handlePrint(invoice)} />
                <DeleteButton onClick={() => handleDelete(invoice._id)} />
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
            noMatch: "AGREGA NUEVAS FACTURAS..",
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
            <p className="text-red-600">Error al cargar facturas..</p>
        ) : isSuccess ? (
            <StyledEngineProvider injectFirst>
            <ThemeProvider theme={darkTheme}>
                <MUIDataTable
                title={"Lista de Facturas"}
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
