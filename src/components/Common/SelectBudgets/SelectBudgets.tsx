import MUIDataTable from "mui-datatables";
import { StyledEngineProvider, ThemeProvider } from "@mui/material/styles";
import { Loading } from 'src/components/Common/Loading';
import { darkThemeSolid } from "src/styles/themes/themeTable";
import { useResponsiveColumns } from "src/hooks/useResponsiveColumns";
import { toast } from "react-toastify";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { Chip } from "@nextui-org/react";

export const SelectBudgets: React.FC<{
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
    const rows = data
    .filter(budget => budget.state === "Aprobado") // Filtrar los que no sean "Borrador"
    .map(budget => ({
        n_budget: budget.form.num,
        description: budget.description,
        dateCreation: new Date(budget.form.dateCreation).toLocaleDateString(),
        dateUpdate: budget.form.dateUpdate ? new Date(budget.form.dateUpdate).toLocaleDateString() : "", 
        state: budget.state,
        budgetId: budget._id, 
        budget: budget,
        createdBy: budget.form.emailWorker,
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
        name: "createdBy",
        label: "Creado por",
        options: { filter: true, sort: true },
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
                const bgColor = value === "Borrador" ? "success" : value === "Aprobado" ? "default" : "warning";
                return (
                    <div className="flex justify-center"> 
                        <Chip 
                            color={bgColor}
                            size="md"
                            variant="flat"
                            >
                                {value}
                        </Chip>   
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
            <div className="flex justify-center items-center h-[500px]">
                <Loading />
            </div>
        ) : isError ? (
            toast.error('Error al cargar los Presupuestos')
        ) : isSuccess ? (
            <StyledEngineProvider injectFirst>
            <ThemeProvider theme={darkThemeSolid}>
                <div className="w-full max-h-[750px] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
                >
                  <MUIDataTable
                  title={"Lista de Presupuestos Aprobados"}
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
