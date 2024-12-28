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
    handlePrint,
    handleExportPDF,
    }) => {
    
    const filteredData = useDynamicFilter(data, searchTerm, ['description', 'state', 'form.num', 'total']);
    const filteredByDateRange = useDateRangeFilter(filteredData, selectedRange);
    const rows = filteredByDateRange.map(budget => ({
        num: budget.form.num,
        description: budget.description,
        dateCreation: new Date(budget.form.dateCreation).toLocaleDateString(),
        dateUpdate: budget.form.dateUpdate ? new Date(budget.form.dateUpdate).toLocaleDateString() : "", 
        state: budget.state,
        total: budget.total,
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
                const bgColor = value === "Borrador" ? "bg-gray-600" : value === "Aceptado" ? "bg-green-600" : "bg-red-600";
                return (
                    <div className="flex justify-center"> 
                        <div className={`rounded-full px-4 py-1 text-center inline-block text-sm ${bgColor} w-24`}>
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
            customBodyRender: (value: any, tableMeta: any) => { // Accede al objeto completo
            const budget = rows[tableMeta.rowIndex].budget
            return (
                <div className='flex gap-x-5 justify-center'>
                    <ViewButton onClick={() => handleView(budget)}/>
                    {budget.state !== "Aceptado" && (
                        <UpdateButton onClick={() => handleUpdate(budget._id)} />
                    )}
                    <ExportButton onClick={() => handleExportPDF(budget)} />
                    <PrintButton onClick={() => handlePrint(budget)} />
                    <DeleteButton onClick={() => handleDelete(budget._id)} />
                </div>
            );
            },
        },
        },
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
            <Loading />
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
