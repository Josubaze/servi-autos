import { useRef, useState } from "react";
import { FaRegEye } from "react-icons/fa";
import { FaFilePdf } from "react-icons/fa6";
import { BudgetPreview } from "src/components/BudgetPreview";
import { BudgetPDF } from "src/components/BudgetPDF";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

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
    const printRef = useRef<HTMLDivElement | null>(null);

    const handlePDFGeneration = async () => {
        setShowHiddenPDF(true); // Mostrar componente oculto
    
        setTimeout(async () => {
            if (!printRef.current) return;
    
            const element = printRef.current;
            const canvas = await html2canvas(element, {
                scale: 2, 
                backgroundColor: "#ffffff",
            });
    
            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF("p", "mm", "a4");
    
            const imgWidth = 210; // Ancho A4 en mm
            const pageHeight = 297; // Alto A4 en mm
            const imgHeight = (canvas.height * imgWidth) / canvas.width; // Mantener proporción
    
            let heightLeft = imgHeight;
            let position = 0;
    
            // Añadir la imagen en la primera página (sin margen superior)
            pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight); 
            heightLeft -= pageHeight;
    
            // Añadir las siguientes páginas
            while (heightLeft > 0) {
                position -= pageHeight;
                pdf.addPage();
                pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }
    
            pdf.save("Budget.pdf");
            setShowHiddenPDF(false); // Ocultar componente
        }, 100);
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
            )}
        </div>
    );
};
