import { useState } from "react";
import { FaRegEye } from "react-icons/fa";
import { FaFilePdf } from "react-icons/fa6";
import { BudgetPreview } from "src/components/BudgetPreview";

interface BudgetOptionsProps {
    company: Company | undefined;
    customer: Customer | null;
    budgetForm: BudgetForm | null;
    selectedServices: Service[];
    extractFormData: () => Promise<void>;
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
    customer,
    budgetForm,
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

    // Función asíncrona para manejar la apertura del modal
    const handleOpenModal = async () => {
        try {
            await extractFormData(); 
            setModalOpen(true); 
        } catch (error) {
            console.error("Error al extraer datos del formulario:", error);
        }
    };

    return (
        <div className="grid grid-cols-4 rounded-lg w-full h-12 mb-4 gap-x-4 bg-gradient-to-r from-indigo-600 via-black-nav to-indigo-600 animate-gradient bg-[length:200%]">
            <div className="col-span-2">
                <button
                    className="text-base px-6 w-full h-full rounded-xl bg-transparent transition ease-in-out delay-150 hover:bg-indigo-600 duration-300"
                    onClick={handleOpenModal} // Llama a la función asíncrona
                >
                    <span className="flex items-center justify-center gap-x-2 h-full">
                        Modo Vista
                        <FaRegEye className="h-5 w-5" />
                    </span>
                </button>
            </div>

            <div className="col-span-2">
                <button
                    className="text-base px-6 w-full h-full rounded-xl bg-transparent transition ease-in-out delay-150 hover:bg-indigo-600 duration-300"
                >
                    <span className="flex items-center justify-center gap-x-2 h-full">
                        Exportar PDF
                        <FaFilePdf className="h-5 w-5" />
                    </span>
                </button>
            </div>

            {/* Renderiza el modal solo si isModalOpen es true */}
            {isModalOpen && (
                <BudgetPreview
                    isOpen={isModalOpen}
                    onClose={() => setModalOpen(false)}
                    company={company}
                    customer={customer} // Pasar los datos actualizados
                    budgetForm={budgetForm}
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
