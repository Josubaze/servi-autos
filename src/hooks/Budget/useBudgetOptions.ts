import { useState, useRef } from "react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { toast } from "react-toastify";

interface BudgetOptionsProps {
  extractFormData: () => {
    customerData: Customer | null;
    form: Form | null;
  };
}

export const useBudgetOptions = ({
  extractFormData,
}: BudgetOptionsProps) => {
  const [showPreview, setShowPreview] = useState(false);
  const [showHiddenPDF, setShowHiddenPDF] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const printRef = useRef<HTMLDivElement | null>(null);
  const [ customer , setCustomer] = useState<Customer>();
  const [form, setForm] = useState<Form>();
  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  // Función que se ejecuta en cada acción de impresión o PDF
  const updateCustomerAndForm = async () => {
        const { customerData, form } = extractFormData();
        if (customerData) {
            setCustomer(customerData);
        } 
        if (form) {
            setForm(form);
        } 
  };

  const handlePDFGeneration = async (type: "Budget" | "Invoice") => {
    try {
        const { form: formExtract } = await extractFormData();
        setIsLoading(true);
        setShowHiddenPDF(true);

        await updateCustomerAndForm();

        await sleep(300);
        if (!printRef.current) {
            throw new Error("Referencia de impresión no disponible.");
        }

        // Aumentamos la escala para mejorar la calidad
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
            if (!context) throw new Error("Error al crear el contexto del canvas.");

            context.drawImage(
                fullCanvas,
                0,
                yOffset,
                fullCanvas.width,
                remainingHeight,
                0,
                0,
                partCanvas.width,
                remainingHeight
            );

            // Comprimir la imagen antes de añadirla al PDF
            const partImgData = partCanvas.toDataURL("image/jpeg", 0.6);

            pdf.addImage(partImgData, "JPEG", margin, margin, imgWidth, (remainingHeight / fullCanvas.width) * imgWidth);

            yOffset += remainingHeight;

            if (yOffset < fullCanvas.height) pdf.addPage();
        }

        pdf.save(`${type}_N${formExtract?.num}.pdf`);
    } catch (error) {
        if (error instanceof Error) {
            toast.error(`Error: ${error.message}`);
        } else {
            toast.error("Error desconocido al generar el PDF.");
        }
        console.error("Error al generar el PDF:", error);
    } finally {
        setShowHiddenPDF(false);
        setIsLoading(false);
    }
  };

  const handlePrint = async () => {
    setIsLoading(true);
    setShowHiddenPDF(true);
    // Actualizamos los estados antes de generar el PDF
    await updateCustomerAndForm();

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
      setShowHiddenPDF(false);
      setIsLoading(false);
    }
  };

  const handlePreview = async () => {
    // Actualizamos los estados antes de generar el PDF
    await updateCustomerAndForm();
    setShowPreview(!showPreview);
  };

  return {
    showPreview,
    setShowPreview,
    showHiddenPDF,
    setShowHiddenPDF,
    isLoading,
    printRef,
    handlePDFGeneration,
    handlePrint,
    handlePreview,
    customer,
    form,
  };
};
