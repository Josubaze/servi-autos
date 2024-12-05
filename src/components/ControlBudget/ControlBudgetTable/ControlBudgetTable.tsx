import MUIDataTable from "mui-datatables";
import { StyledEngineProvider, ThemeProvider } from "@mui/material/styles";
import { Loading } from 'src/components/Common/Loading';
import { darkTheme } from "src/styles/themes/themeTable";
import { UpdateButton } from "src/components/Common/Buttons/UpdateButton";
import { DeleteButton } from "src/components/Common/Buttons/DeleteButton";

export const ControlBudgetTable: React.FC<TableControlBudgetProps> = ({
    data,
    isLoading,
    isError,
    isFetching,
    isSuccess,
    handleDelete,
    handleEdit,
    }) => {
    // Mapea los datos para mostrar solo las columnas necesarias
    const rows = data.map(budget => ({
        n_budget: budget.budgetForm.n_budget,
        description: budget.description,
        dateCreation: new Date(budget.budgetForm.dateCreation).toLocaleDateString(),
        state: budget.state,
        budget: budget, // Incluye el objeto completo como propiedad oculta
    }));

    const columns = [
    {
        name: "n_budget",
        label: "N° Presupuesto",
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
                        <div className={`rounded-full px-4 py-1 text-center w-2/5 text-sm ${bgColor}`}>
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
            const fullBudget = rows[tableMeta.rowIndex].budget; // Accede al objeto completo
            return (
                <div className='flex gap-x-5 justify-center'>
                <UpdateButton onClick={() => handleEdit(fullBudget)} />
                <DeleteButton onClick={() => handleDelete(fullBudget._id)} />
                </div>
            );
            },
        },
        },
    ];

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
            noMatch: "AGREGA PRESUPUESTOS..",
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
            <p className="text-red-600">Error al cargar los presupuestos..</p>
        ) : isSuccess ? (
            <StyledEngineProvider injectFirst>
            <ThemeProvider theme={darkTheme}>
                <MUIDataTable
                title={"Lista de Presupuestos"}
                data={rows}
                columns={columns}
                options={options}
                />
            </ThemeProvider>
            </StyledEngineProvider>
        ) : null}
        </>
    );
    };
