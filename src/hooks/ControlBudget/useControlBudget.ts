import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { useDeleteBudgetMutation, useGetBudgetsQuery } from 'src/redux/services/budgets.Api';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export const useControlBudget = () => {
  const { data = [], isError, isLoading: isLoadingBudget, isFetching, isSuccess } = useGetBudgetsQuery();
  const [deleteBudget] = useDeleteBudgetMutation();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedRange, setSelectedRange] = useState<any>(null);
  const [isOpenPdf, setIsOpenPdf] = useState<boolean>(false);
  const [isOpenPreview, setIsOpenPreview] = useState<boolean>(false);
  const [budgetCopy, setBudgetCopy] = useState<any>(null);
  const printRef = useRef<HTMLDivElement | null>(null);
  const [isLoadingPDF, setIsLoadingPDF] = useState(false);
  
  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  const handleDateRangeChange = (value: any) => setSelectedRange(value);

  const handleUpdate = (budgetId: string) => {
    if (budgetId){
      router.push(`/update/budget/${budgetId}`);
    }
  };

  const handleDelete = async (budgetId: string) => {
    try {
      await deleteBudget(budgetId); 
    } catch (error) {
      toast.error('Hubo un error al eliminar el presupuesto');
    } finally {
      toast.success('Presupuesto eliminado exitosamente');
    }
  };  

  const handleView = async (budget: Budget) => {
    try {
      if(budget){
        setBudgetCopy(budget);
      }
      setIsOpenPreview(true);
    } catch (error) {
      toast.error('Hubo un error al imprimir el presupuesto');
    }
  }

  const handleExportPDF = async (budget: Budget) => {
    setIsLoadingPDF(true);
    setIsOpenPdf(true);
    setBudgetCopy(budget);
    try {
      await sleep(300);
      if (!printRef.current) return;

      const fullCanvas = await html2canvas(printRef.current, {
        scale: 1.5,
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

        const partImgData = partCanvas.toDataURL("image/png");

        pdf.addImage(partImgData, "PNG", margin, margin, imgWidth, (remainingHeight / fullCanvas.width) * imgWidth);

        yOffset += remainingHeight;

        if (yOffset < fullCanvas.height) pdf.addPage();
      }

      pdf.save(`Budget_${budget.form.num}.pdf`);
    } catch (error) {
      toast.error("Error al generar el PDF:");
    } finally {
      setIsOpenPdf(false);
      setIsLoadingPDF(false);
    }
  };

  const handlePrint = async (budget: Budget) => {
    setIsLoadingPDF(true);
    setIsOpenPdf(true);
    setBudgetCopy(budget);
    try {
      await sleep(300);
      if (!printRef.current) return;

      const fullCanvas = await html2canvas(printRef.current, {
        scale: 2,
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
    isLoadingBudget,
    isFetching,
    isSuccess,
    searchTerm,
    setSearchTerm,
    selectedRange,
    handleDateRangeChange,
    handleUpdate,
    handleDelete,
    handleView,
    handleExportPDF,
    handlePrint,
    isOpenPdf,
    isOpenPreview,
    setIsOpenPreview,
    budgetCopy,
    printRef,
    router,
    isLoadingPDF,
  };
};
