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
import { CreditNoteButton } from "src/components/Common/Buttons/CreditNoteButton";
import { useState } from "react";
import { AiOutlineCheck, AiOutlineClose } from "react-icons/ai";
import { Chip } from "@nextui-org/react";

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
    handleUpload,
    handleStateUpdate,
    handlePrint,
    handleExportPDF,
    }) => {
    const [isLoadingUp, setIsLoadingUp] = useState(false); 
    const [confirmStateIndex, setConfirmStateIndex] = useState<number | null>(null);
    const filteredData = useDynamicFilter(data, searchTerm, ['description', 'state', 'form.num', 'total', '_id']);
    const filteredByDateRange = useDateRangeFilter(filteredData, selectedRange);
    const rows = filteredByDateRange.map(invoice => ({
        num: invoice.form.num,
        description: invoice.description,
        dateCreation: new Date(invoice.form.dateCreation).toLocaleDateString(),
        dateUpdate: invoice.form.dateUpdate ? new Date(invoice.form.dateUpdate).toLocaleDateString() : "", 
        state: invoice.state,
        createdBy: invoice.form.emailWorker,
        total: invoice.total,
        totalWithIgft: invoice.totalWithIgft,
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
    
                // Selecciona el valor correcto según la moneda
                const total = currency === "$" ? rows[tableMeta.rowIndex].invoice.totalWithIgft : rows[tableMeta.rowIndex].invoice.total;
    
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
                const invoice = rows[tableMeta.rowIndex].invoice;
                if (value === "Pagada") {
                    // Si el estado es "Pagada", solo se muestra un div sin acción
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

                if (value === "Borrador") {
                    return (
                        <div className="flex justify-center">
                            <Chip                       
                                color="warning" 
                                className="cursor-pointer hover:bg-orange-400/50" 
                                size="md"
                                variant="flat"
                                isDisabled={isLoadingUp}
                                onClick={() => {
                                    setIsLoadingUp(true);
                                    handleUpdate(invoice._id);
                                    setTimeout(() => {
                                        setIsLoadingUp(false); 
                                    }, 10000);
                                }}
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
                                value === "Pendiente" && handleStateUpdate(invoice._id); // Cambiar estado a "Pagada"
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
                const invoice = rows[tableMeta.rowIndex].invoice;
                return (
                    <div className="flex gap-x-5 justify-center items-center">                    
                        {/* Botón de vista */}
                        <ViewButton onClick={() => handleView(invoice)} />
        
                        {/* Botón de actualización solo si el estado es "Borrador" */}
                        {invoice.state === "Borrador" ? (
                            <UpdateButton onClick={() => handleUpdate(invoice._id)} />
                        ) : (
                            <CreditNoteButton onClick={() => handleUpload(invoice._id)} />
                        )}
        
                        {/* Botón de exportar */}
                        <ExportButton onClick={() => handleExportPDF(invoice)} />
        
                        {/* Botón de imprimir */}
                        <PrintButton onClick={() => handlePrint(invoice)} />
        
                        {/* Botón de eliminar */}
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
            <div className="flex justify-center items-center h-[500px]">
                <Loading />
            </div>
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
