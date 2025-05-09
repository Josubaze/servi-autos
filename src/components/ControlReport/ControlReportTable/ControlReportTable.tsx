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
import { useState } from "react";
import { AiOutlineCheck, AiOutlineClose } from "react-icons/ai";
import { Chip } from "@nextui-org/react";
import { UpdateButton } from "src/components/Common/Buttons/UpdateButton";


export const ControlReportTable: React.FC<ControlReportTableProps> = ({
    data,
    searchTerm,
    selectedRange,
    isLoading,
    isError,
    isFetching,
    isSuccess,
    handleUpdate,
    handleView,
    handleDelete,
    handleStateUpdate,
    handlePrint,
    handleExportPDF,
    }) => {
    const [confirmStateIndex, setConfirmStateIndex] = useState<number | null>(null);
    const filteredData = useDynamicFilter(data, searchTerm, ['description', 'state', 'form.num', '_id']);
    const filteredByDateRange = useDateRangeFilter(filteredData, selectedRange);
    const rows = filteredByDateRange.map(report => ({
        num: report.form.num,
        description: report.description,
        dateCreation: new Date(report.form.dateCreation).toLocaleDateString(),
        dateUpdate: report.form.dateUpdate ? new Date(report.form.dateUpdate).toLocaleDateString() : "", 
        createdBy: report.form.emailWorker,
        state: report.state,
        reportId: report._id, 
        report: report,
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
            customBodyRender: (value: any, tableMeta: any) => {             
                const report = rows[tableMeta.rowIndex].report;
    
                if (value === "Presupuestado") {
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

                return (
                    <div className="flex justify-center"> 
                        <Chip 
                            color="success"
                            className="cursor-pointer hover:bg-green-500/50" 
                            size="md"
                            variant="flat"
                            onClick={() => {
                                value === "Sin Presupuestar" && handleStateUpdate(report._id);  
                            }}
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
                const report = rows[tableMeta.rowIndex].report;
                return (
                    <div className="flex gap-x-5 justify-center items-center">  
                        {/* Botón de vista */}
                        <ViewButton onClick={() => handleView(report)} />

                        {/* Botón de actulizar */} 
                        {
                            report.state !== "Presupuestado" &&
                            <UpdateButton onClick={() => handleUpdate(report._id)}/> 
                        } 
        
                        {/* Botón de exportar */}
                        <ExportButton onClick={() => handleExportPDF(report)} />
        
                        {/* Botón de imprimir */}
                        <PrintButton onClick={() => handlePrint(report)} />
        
                        {/* Botón de eliminar */}
                        <DeleteButton onClick={() => handleDelete(report._id)} />
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
                noMatch: "NO HAY INFORMENES CREADAS..",
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
            <p className="text-red-600">Error al cargar los Informes..</p>
        ) : isSuccess ? (
            <StyledEngineProvider injectFirst>
            <ThemeProvider theme={darkTheme}>
                <MUIDataTable
                title={"Lista de Informes"}
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
