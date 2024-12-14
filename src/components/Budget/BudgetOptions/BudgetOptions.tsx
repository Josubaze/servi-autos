import { FaRegEye } from "react-icons/fa";
import { PiFilePdfBold } from "react-icons/pi";
import { MdPrint } from "react-icons/md";
import { BudgetPreview } from "src/components/BudgetPreview";
import { BudgetPDF } from "src/components/BudgetPDF";
import { useBudgetOptions } from "src/hooks/Budget/useBudgetOptions"; // Importar el hook
import { Loading } from "src/components/Common/Loading";

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
  const {
    isModalOpen,
    setModalOpen,
    showHiddenPDF,
    setShowHiddenPDF,
    isLoading,
    printRef,
    handlePDFGeneration,
    handlePrint,
  } = useBudgetOptions({
    extractFormData,
  });

  return (
    <div className="grid grid-cols-6 rounded-lg w-full h-12 mb-4 gap-x-4 bg-gradient-to-r from-indigo-600 via-black-nav to-indigo-600 animate-gradient bg-[length:200%]">
      {/* Botón de vista previa */}
      <div className="col-span-2">
        <button
          className="text-base px-6 w-full h-full rounded-xl bg-transparent transition ease-in-out delay-150 hover:bg-indigo-600/80 duration-300"
          onClick={() => setModalOpen(true)}
        >
          <span className="flex items-center justify-center gap-x-2 h-full">
            Modo Vista
            <FaRegEye className="h-6 w-6" />
          </span>
        </button>
      </div>

      {/* Botón para imprimir */}
      <div className="col-span-2">
        <button
          className="text-base px-6 w-full h-full rounded-xl bg-transparent transition ease-in-out delay-150 hover:bg-indigo-600/80 duration-300"
          onClick={handlePrint}
        >
          <span className="flex items-center justify-center gap-x-2 h-full">
            Imprimir
            <MdPrint className="h-6 w-6" />
          </span>
        </button>
      </div>

      {/* Botón para generar PDF */}
      <div className="col-span-2">
        <button
          className="text-base px-6 w-full h-full rounded-xl bg-transparent transition ease-in-out delay-150 hover:bg-indigo-600/80 duration-300"
          onClick={handlePDFGeneration}
        >
          <span className="flex items-center justify-center gap-x-2 h-full">
            Exportar
            <PiFilePdfBold className="h-6 w-6" />
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
