import MUIDataTable from "mui-datatables";
import { StyledEngineProvider, ThemeProvider } from "@mui/material/styles";
import { Loading } from 'src/components/Common/Loading';
import { darkThemeSolid } from "src/styles/themes/themeTable";
import { useResponsiveColumns } from "src/hooks/useResponsiveColumns";
import { toast } from "react-toastify";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { Chip } from "@nextui-org/react";

export const SelectInvoices: React.FC<{
  data: Invoice[]; 
  isLoading: boolean; 
  isError: boolean; 
  isSuccess: boolean;
  isFetching: boolean;
  onSelectInvoice: (invoice: Invoice) => void,
  onCloseTable: () => void,
}> = ({
  data,
  isLoading,
  isError,
  isSuccess,
  isFetching,
  onSelectInvoice,
  onCloseTable
  }) => {

    const rows = data
    .filter(invoice => invoice.state !== "Borrador") // Excluir facturas con estado "Borrador"
    .map(invoice => ({
        num: invoice.form.num,
        description: invoice.description,
        dateCreation: new Date(invoice.form.dateCreation).toLocaleDateString(),
        dateUpdate: invoice.form.dateUpdate ? new Date(invoice.form.dateUpdate).toLocaleDateString() : "", 
        state: invoice.state,
        invoiceId: invoice._id, 
        invoice: invoice,
    }));

    const columns = [
    {
        name: "num",
        label: "N° Factura",
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
                const bgColor = value === "Pendiente" ? "success" : value === "Pagada" ? "default": value === "Borrador" ? "warning" : "danger";
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
            noMatch: "AGREGA FACTURAS..",
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
          const selectedInvoice = rows[selectedRowIndex].invoice; 
        
          onSelectInvoice(selectedInvoice);
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
            toast.error('Error al cargar las Facturas')
        ) : isSuccess ? (
            <StyledEngineProvider injectFirst>
            <ThemeProvider theme={darkThemeSolid}>
                <div className="w-full max-h-[750px] overflow-y-auto"
                    onClick={(e) => e.stopPropagation()}
                >
                  <MUIDataTable
                  title={"Lista de Facturas"}
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
