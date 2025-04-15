import MUIDataTable from "mui-datatables";
import { StyledEngineProvider, ThemeProvider } from "@mui/material/styles";
import { Loading } from 'src/components/Common/Loading';
import { darkThemeSolid } from "src/styles/themes/themeTable";
import { useResponsiveColumns } from "src/hooks/useResponsiveColumns";
import { toast } from "react-toastify";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { Chip } from "@nextui-org/react";
import { useSession } from "next-auth/react";

export const SelectReports: React.FC<{
  data: ReportWork[]; 
  isLoading: boolean; 
  isError: boolean; 
  isSuccess: boolean;
  isFetching: boolean;
  onSelectReport: (report: ReportWork) => void,
  onCloseTable: () => void,
  filterBySinPresupuestar?: boolean;
}> = ({
  data,
  isLoading,
  isError,
  isSuccess,
  isFetching,
  onSelectReport,
  onCloseTable,
  filterBySinPresupuestar
  }) => {
    const filteredData = filterBySinPresupuestar
    ? data.filter(report => report.state === "Sin Presupuestar")
    : data;

    const rows = filteredData.map(report => ({
        num: report.form.num,
        description: report.description,
        dateCreation: new Date(report.form.dateCreation).toLocaleDateString(),
        dateUpdate: report.form.dateUpdate
        ? new Date(report.form.dateUpdate).toLocaleDateString()
        : "", 
        state: report.state,
        createdBy: report.form.emailWorker,
        reportId: report._id, 
        report: report,
    }));
    

    const columns = [
    {
        name: "num",
        label: "N° Informe",
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
                const bgColor = value === "Presupuestado" ? "default" : value === "Sin Presupuestar" ? "success" : "danger";
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

    const mobileColumnsToShow = ['num', 'dateCreation', 'state'];
    const tabletColumnsToShow = ['num', 'dateCreation', 'dateUpdate', 'state'];
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
            noMatch: "NO HAY INFORMES CREADOS..",
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
          const selectedRowIndex = rowMeta.dataIndex;
          const selectedReport = rows[selectedRowIndex].report; 
        
          onSelectReport(selectedReport);
        },
        setRowProps: () => ({
          style: { cursor: 'pointer' }
        }),
    };

    const title = filterBySinPresupuestar
    ? "Lista de Informes sin Presupuestar"
    : "Lista de Informes";

    return (
        <>
        {isLoading || isFetching ? (
            <div className="flex justify-center items-center h-[500px]">
                <Loading />
            </div>
        ) : isError ? (
            toast.error('Error al cargar los Informes')
        ) : isSuccess ? (
            <StyledEngineProvider injectFirst>
            <ThemeProvider theme={darkThemeSolid}>
                <div className="w-full max-h-[750px] overflow-y-auto"
                    onClick={(e) => e.stopPropagation()}
                >
                  <MUIDataTable
                  title={title}
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
