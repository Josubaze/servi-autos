import MUIDataTable from "mui-datatables";
import { StyledEngineProvider, ThemeProvider } from "@mui/material/styles";
import { Loading } from 'src/components/Common/Loading';
import { darkThemeSolid } from "src/styles/themes/themeTable";
import { useResponsiveColumns } from "src/hooks/useResponsiveColumns";
import { toast } from "react-toastify";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { Chip } from "@nextui-org/react";

export const SelectPurchaseOrder: React.FC<{
  data: PurchaseOrder[]; 
  isLoading: boolean; 
  isError: boolean; 
  isSuccess: boolean;
  isFetching: boolean;
  onSelectPurchaseOrder: (purchaseOrder: PurchaseOrder) => void,
  onCloseTable: () => void,
}> = ({
  data,
  isLoading,
  isError,
  isSuccess,
  isFetching,
  onSelectPurchaseOrder,
  onCloseTable
  }) => {
    // Transformar los datos
    const rows = data.map(purchaseOrder => ({
        num: purchaseOrder.form.num,
        description: purchaseOrder.description,
        dateCreation: new Date(purchaseOrder.form.dateCreation).toLocaleDateString(),
        dateUpdate: purchaseOrder.form.dateUpdate ? new Date(purchaseOrder.form.dateUpdate).toLocaleDateString() : "", 
        state: purchaseOrder.state,
        purchaseOrderId: purchaseOrder._id, 
        purchaseOrder: purchaseOrder,
    }));

    const columns = [
    {
        name: "num",
        label: "N° Orden de Compra",
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
            noMatch: "NO HAY ÓRDENES DE COMPRA..",
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
          const selectedPurchaseOrder = rows[selectedRowIndex].purchaseOrder; // Accede a la propiedad oculta 'PurchaseOrder'
        
          onSelectPurchaseOrder(selectedPurchaseOrder);
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
            toast.error('Error al cargar las órdenes de compra')	
        ) : isSuccess ? (
            <StyledEngineProvider injectFirst>
            <ThemeProvider theme={darkThemeSolid}>
                <div className="w-full max-h-[750px] overflow-y-auto">
                  <MUIDataTable
                  title={"Lista de Órdenes de Compra"}
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
