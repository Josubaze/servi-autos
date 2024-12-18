import MUIDataTable from "mui-datatables";
import { StyledEngineProvider, ThemeProvider } from "@mui/material/styles";
import { Loading } from 'src/components/Common/Loading';
import { darkTheme } from "src/styles/themes/themeTable";
import { useDynamicFilter } from "src/hooks/useProductFilter";
import { useResponsiveColumns } from "src/hooks/useResponsiveColumns";
import { useDateRangeFilter } from "src/hooks/useDateRangeFilter";
import { toast } from "react-toastify";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

export const SelectBudget: React.FC<{
  data: Budget[]; 
  isLoading: boolean; 
  isError: boolean; 
  isSuccess: boolean;
  isFetching: boolean;
  onSelectBudget: (budget: Budget) => void,
  onCloseTable: () => void,
}> = ({
  data,
  isLoading,
  isError,
  isSuccess,
  isFetching,
  onSelectBudget,
  onCloseTable
  }) => {

    //const filteredData = useDynamicFilter(data, searchTerm, ['description', 'state', 'budgetForm.n_budget']);
    const rows = data.map(budget => ({
        n_budget: budget.budgetForm.n_budget,
        description: budget.description,
        dateCreation: new Date(budget.budgetForm.dateCreation).toLocaleDateString(),
        dateUpdate: budget.budgetForm.dateUpdate ? new Date(budget.budgetForm.dateUpdate).toLocaleDateString() : "", 
        state: budget.state,
        budgetId: budget._id, 
        budget: budget,
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
                        <div className={`rounded-full px-4 py-1 text-center inline-block text-sm ${bgColor}`}>
                            {value}
                        </div>     
                    </div>
                );
            },
        },
    },
    ];

    const mobileColumnsToShow = ['n_budget', 'dateCreation', 'state'];
    const tabletColumnsToShow = ['n_budget', 'dateCreation', 'dateUpdate', 'state'];
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
        download: false, 
        print: false, 
        customToolbar: () => {
          return (
              <IconButton onClick={onCloseTable}>
                  <CloseIcon />
              </IconButton>
          )
        },
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
        onRowClick: (rowData: any, rowMeta: any) => {
          const selectedRowIndex = rowMeta.dataIndex; // Obtiene el índice de la fila seleccionada
          const selectedBudget = rows[selectedRowIndex].budget; // Accede a la propiedad oculta 'budget'
        
          onSelectBudget(selectedBudget);
        },
        setRowProps: () => ({
          style: { cursor: 'pointer' }
        }),
    };

    return (
        <>
        {isLoading || isFetching ? (
            <Loading />
        ) : isError ? (
            toast.error('Error al cargar los Presupuestos')
        ) : isSuccess ? (
            <StyledEngineProvider injectFirst>
            <ThemeProvider theme={darkTheme}>
                <div className="w-full max-h-[750px] overflow-y-auto">
                  <MUIDataTable
                  title={"Lista de Presupuestos"}
                  data={rows}
                  columns={responsiveColumns}
                  options={options}
                  />
                </div>
            </ThemeProvider>
            </StyledEngineProvider>
        ) : null}
        </>
    );
    };
