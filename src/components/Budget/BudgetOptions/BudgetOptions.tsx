import { useState, useRef } from "react";
import { FaRegEye } from "react-icons/fa";
import { FaFilePdf } from "react-icons/fa6";
import { BudgetPreview } from "src/components/BudgetPreview";
import { BudgetPDF } from "src/components/BudgetPDF";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { Loading } from "src/components/Common/Loading"; // Asegúrate de que este componente está importado
import { toast } from "react-toastify";

interface BudgetOptionsProps {
    company: Company | undefined;
    selectedServices: Service[];
    extractFormData: () => Promise<{
        customerData: Customer;
        budgetForm: BudgetForm;
    }>;
    subtotal: number;
    ivaPercentage: number;
    igtfPercentage: number;
    calculatedIva: number;
    calculatedIgtf: number;
    total: number;
    totalWithIgft: number;
}

export const BudgetOptions: React.FC<BudgetOptionsProps> = ({
    company,
    extractFormData,
    subtotal,
    selectedServices,
    ivaPercentage,
    igtfPercentage,
    calculatedIva,
    calculatedIgtf,
    total,
    totalWithIgft,
}) => {
    const [isModalOpen, setModalOpen] = useState(false);
    const [showHiddenPDF, setShowHiddenPDF] = useState(false);
    const [isLoading, setIsLoading] = useState(false); // Estado para el loading
    const printRef = useRef<HTMLDivElement | null>(null);

    // Función de retraso
    const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
    const handlePDFGeneration = async () => {

        setIsLoading(true);
        setShowHiddenPDF(true);
    
        try {
            // Retraso para esperar la extracción de datos
            await sleep(300);  // 300ms de espera antes de continuar
            const { budgetForm } = await extractFormData();
            if (!printRef.current) return;
    
            // Capturar todo el contenido como un canvas
            const fullCanvas = await html2canvas(printRef.current, {
                scale: 1.2,
                backgroundColor: "#ffffff",
            });
    
            const pdf = new jsPDF("p", "mm", "a4");
            const pageHeight = pdf.internal.pageSize.getHeight();
            const pageWidth = pdf.internal.pageSize.getWidth();
            const margin = 10;
            const imgWidth = pageWidth - margin * 2;
            const visibleHeight = pageHeight - margin * 2;
    
            let yOffset = 0;
    
            // Crear las páginas dinámicamente
            while (yOffset < fullCanvas.height) {
                const remainingHeight = Math.min(
                    fullCanvas.height - yOffset,
                    visibleHeight * (fullCanvas.width / imgWidth)
                );
    
                // Crear y llenar el canvas temporal
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
    
                // Añadir la imagen al PDF
                pdf.addImage(partImgData, "PNG", margin, margin, imgWidth, (remainingHeight / fullCanvas.width) * imgWidth);
    
                yOffset += remainingHeight;
    
                if (yOffset < fullCanvas.height) pdf.addPage();
            }
    
            pdf.save(`Budget_${budgetForm.n_budget}.pdf`);
        } catch (error) {
            toast.error("Error al generar el PDF:");
        } finally {
            setShowHiddenPDF(false);
            setIsLoading(false);
        }
    };
    
    
    return (
        <div className="grid grid-cols-4 rounded-lg w-full h-12 mb-4 gap-x-4 bg-gradient-to-r from-indigo-600 via-black-nav to-indigo-600 animate-gradient bg-[length:200%]">
            {/* Botón de vista previa */}
            <div className="col-span-2">
                <button
                    className="text-base px-6 w-full h-full rounded-xl bg-transparent transition ease-in-out delay-150 hover:bg-indigo-600 duration-300"
                    onClick={() => setModalOpen(true)}
                >
                    <span className="flex items-center justify-center gap-x-2 h-full">
                        Modo Vista
                        <FaRegEye className="h-5 w-5" />
                    </span>
                </button>
            </div>

            {/* Botón para generar PDF */}
            <div className="col-span-2">
                <button
                    className="text-base px-6 w-full h-full rounded-xl bg-transparent transition ease-in-out delay-150 hover:bg-indigo-600 duration-300"
                    onClick={handlePDFGeneration}
                >
                    <span className="flex items-center justify-center gap-x-2 h-full">
                        Exportar PDF
                        <FaFilePdf className="h-5 w-5" />
                    </span>
                </button>
            </div>

            {/* Modal para vista previa */}
            {isModalOpen && (
                <BudgetPreview
                    isOpen={isModalOpen}
                    onClose={() => setModalOpen(false)}
                    company={company}
                    extractFormData={extractFormData}
                    selectedServices={selectedServices}
                    subtotal={subtotal}
                    ivaPercentage={ivaPercentage}
                    igtfPercentage={igtfPercentage}
                    calculatedIva={calculatedIva}
                    calculatedIgtf={calculatedIgtf}
                    total={total}
                    totalWithIgft={totalWithIgft}
                />
            )}

            {/* Componente oculto para PDF */}
            {showHiddenPDF && (
            <div className="absolute top-[-9999px] left-[-9999px]">
                <BudgetPDF
                ref={printRef}
                company={company}
                extractFormData={extractFormData}
                selectedServices={selectedServices}
                subtotal={subtotal}
                ivaPercentage={ivaPercentage}
                igtfPercentage={igtfPercentage}
                calculatedIva={calculatedIva}
                calculatedIgtf={calculatedIgtf}
                total={total}
                totalWithIgft={totalWithIgft}
                />
            </div>
            )}

            {isLoading && (
                <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md">
                    <Loading /> 
                </div>
            )}
        </div>
    );
};
