import { FaRegEye } from "react-icons/fa";
import { PiFilePdfBold } from "react-icons/pi";
import { MdPrint } from "react-icons/md";
import { BudgetView } from "src/components/BudgetView";
import { useBudgetOptions } from "src/hooks/Budget/useBudgetOptions"; // Importar el hook
import { Loading } from "src/components/Common/Loading";

interface BudgetOptionsProps {
    company: Company | undefined;
    selectedServices: Service[];
    extractFormData: () => {
      customerData: Customer | null;
      form: Form | null;
    };
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
      showPreview,
      setShowPreview,
      showHiddenPDF,
      isLoading,
      printRef,
      handlePDFGeneration,
      handlePrint,
      handlePreview,
      form,
      customer,
  } = useBudgetOptions({
      extractFormData,  // Pasamos el estado actualizado aquí
  });

  return (
    <div className="grid grid-cols-6 rounded-lg w-full h-12 mb-4 bg-gradient-to-r from-indigo-600 via-black-nav to-indigo-600 animate-gradient bg-[length:200%]">
      {/* Botón de vista previa */}
      <div className="col-span-2">
        <button
          className="text-base px-6 w-full h-full rounded-xl bg-transparent transition ease-in-out delay-150 hover:bg-indigo-600 duration-300"
          onClick={handlePreview}
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
          className="text-base px-6 w-full h-full rounded-xl bg-transparent transition ease-in-out delay-150 hover:bg-indigo-600 duration-300"
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
          className="text-base px-6 w-full h-full rounded-xl bg-transparent transition ease-in-out delay-150 hover:bg-indigo-600 duration-300"
          onClick={() => handlePDFGeneration("Budget")}
        >
          <span className="flex items-center justify-center gap-x-2 h-full">
            Exportar
            <PiFilePdfBold className="h-6 w-6" />
          </span>
        </button>
      </div>

      {/* Modal para vista previa */}
      {showPreview && (
        <BudgetView
          onClose={() => setShowPreview(false)}
          company={company}
          customer={customer}
          form={form}
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
          <BudgetView
            ref={printRef}
            onClose={() => setShowPreview(false)}
            company={company}
            customer={customer}
            form={form}
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
