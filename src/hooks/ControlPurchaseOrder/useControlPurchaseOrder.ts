import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { useUpdateStatePurchaseOrderMutation } from 'src/redux/services/purchaseOrders.Api';

interface UseControlPurchaseOrderProps {
  data: PurchaseOrder[];
  isError: boolean;
  isLoading: boolean;
  isFetching: boolean;
  isSuccess: boolean;
  deleteMutation: any;
}

export const useControlPurchaseOrder = ({ data, isError, isLoading, isFetching, isSuccess, deleteMutation }: UseControlPurchaseOrderProps) => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedRange, setSelectedRange] = useState<any>(null);
  const [isOpenPdf, setIsOpenPdf] = useState<boolean>(false);
  const [isOpenPreview, setIsOpenPreview] = useState<boolean>(false);
  const [purchaseOrderCopy, setPurchaseOrderCopy] = useState<any>(null);
  const printRef = useRef<HTMLDivElement | null>(null);
  const [isLoadingPDF, setIsLoadingPDF] = useState(false);
  const [updateStatePurchaseOrder] = useUpdateStatePurchaseOrderMutation();

  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  const handleDateRangeChange = (value: any) => setSelectedRange(value);

  const handleUpdate = (purchaseOrderId: string) => {
    if (purchaseOrderId) {
      router.push(`/update/purchase-order/${purchaseOrderId}`);
    }
  };

  const handleStateUpdate = async (purchaseOrderId: string) => {
    setIsLoadingPDF(true);
    try {
      await updateStatePurchaseOrder({ id: purchaseOrderId }).unwrap();
        toast.success('Estado actualizado con éxito');
    } catch (error) {
        toast.error('Error al actualizar el estado:');
    } finally {
      setIsLoadingPDF(false);
    }
  };

  const handleDelete = async (purchaseOrderId: string) => {
    try {
      await deleteMutation(purchaseOrderId);
      toast.success('Presupuesto eliminado exitosamente');
    } catch (error) {
      toast.error('Hubo un error al tratar de eliminar el presupuesto');
    }
  };

  const handleView = async (purchaseOrder: PurchaseOrder) => {
    try {
      if (purchaseOrder) {
        setPurchaseOrderCopy(purchaseOrder);
      }
      setIsOpenPreview(true);
    } catch (error) {
      toast.error('Hubo un error al imprimir el presupuesto');
    }
  };

  const handleExportPDF = async (purchaseOrder: PurchaseOrder) => {
    setIsLoadingPDF(true);
    setIsOpenPdf(true);
    setPurchaseOrderCopy(purchaseOrder);
    try {
      await sleep(300);
      if (!printRef.current) return;

      const fullCanvas = await html2canvas(printRef.current, {
        scale: 3,
        backgroundColor: "#ffffff",
      });

      const pdf = new jsPDF("p", "mm", "a4");
      const pageHeight = pdf.internal.pageSize.getHeight();
      const pageWidth = pdf.internal.pageSize.getWidth();
      const margin = 10;
      const imgWidth = pageWidth - margin * 2;
      const visibleHeight = pageHeight - margin * 2;

      let yOffset = 0;

      while (yOffset < fullCanvas.height) {
        const remainingHeight = Math.min(
          fullCanvas.height - yOffset,
          visibleHeight * (fullCanvas.width / imgWidth)
        );

        const partCanvas = document.createElement("canvas");
        partCanvas.width = fullCanvas.width;
        partCanvas.height = remainingHeight;

        const context = partCanvas.getContext("2d");
        if (!context) return;

        context.drawImage(
          fullCanvas,
          0, yOffset,
          fullCanvas.width, remainingHeight,
          0, 0,
          partCanvas.width, remainingHeight
        );

        const partImgData = partCanvas.toDataURL("image/png", 0.6);

        pdf.addImage(partImgData, "PNG", margin, margin, imgWidth, (remainingHeight / fullCanvas.width) * imgWidth);

        yOffset += remainingHeight;

        if (yOffset < fullCanvas.height) pdf.addPage();
      }

      pdf.save(`Purchase_Order_N${purchaseOrder.form.num}.pdf`);
    } catch (error) {
      toast.error("Error al generar el PDF:");
    } finally {
      setIsOpenPdf(false);
      setIsLoadingPDF(false);
    }
  };

  const handlePrint = async (purchaseOrder: PurchaseOrder) => {
    setIsLoadingPDF(true);
    setIsOpenPdf(true);
    setPurchaseOrderCopy(purchaseOrder);
    try {
      await sleep(300);
      if (!printRef.current) return;

      const fullCanvas = await html2canvas(printRef.current, {
        scale: 3,
        backgroundColor: "#ffffff",
      });

      const printWindow = window.open("", "_blank");
      if (!printWindow) return;

      printWindow.document.title = "Imprimir contenido";

      const pageHeight = 1122;
      const pageWidth = 794;
      const margin = 37.8;
      const imgWidth = pageWidth - margin * 2;
      const visibleHeight = pageHeight - margin * 2;

      let yOffset = 0;

      let printContent = `
        <html>
          <head>
            <title>Imprimir</title>
            <style>
              body {
                margin: 0;
                padding: 0;
                display: flex;
                flex-direction: column;
                align-items: center;
              }
              img {
                display: block;
                margin: ${margin}px auto;
                width: ${imgWidth}px;
              }
              .page-break {
                page-break-after: always;
              }

              @page {
                margin: 0;
                size: A4;
              }
              * {
                -webkit-print-color-adjust: exact;
              }
            </style>
          </head>
          <body>
      `;

      while (yOffset < fullCanvas.height) {
        const remainingHeight = Math.min(
          fullCanvas.height - yOffset,
          visibleHeight * (fullCanvas.width / imgWidth)
        );

        const partCanvas = document.createElement("canvas");
        partCanvas.width = fullCanvas.width;
        partCanvas.height = remainingHeight;

        const context = partCanvas.getContext("2d");
        if (!context) return;

        context.drawImage(
          fullCanvas,
          0, yOffset,
          fullCanvas.width, remainingHeight,
          0, 0,
          partCanvas.width, remainingHeight
        );

        const partImgData = partCanvas.toDataURL("image/png");

        printContent += `
          <div>
            <img src="${partImgData}" />
          </div>
          <div class="page-break"></div>
        `;

        yOffset += remainingHeight;
      }

      printContent += `
        </body>
      </html>
      `;

      printWindow.document.write(printContent);
      printWindow.document.close();

      printWindow.onload = () => {
        printWindow.focus();
        printWindow.print();
        printWindow.close();
      };
    } catch (error) {
      toast.error("Error al generar la impresión:");
    } finally {
      setIsOpenPdf(false);
      setIsLoadingPDF(false);
    }
  };

  return {
    data,
    isError,
    isLoading,
    isFetching,
    isSuccess,
    searchTerm,
    setSearchTerm,
    selectedRange,
    handleDateRangeChange,
    handleUpdate,
    handleStateUpdate,
    handleDelete,
    handleView,
    handleExportPDF,
    handlePrint,
    isOpenPdf,
    isOpenPreview,
    setIsOpenPreview,
    purchaseOrderCopy,
    printRef,
    router,
    isLoadingPDF,
  };
};