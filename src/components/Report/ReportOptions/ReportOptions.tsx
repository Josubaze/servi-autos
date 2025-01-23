import { FaRegEye } from "react-icons/fa";
import { PiFilePdfBold } from "react-icons/pi";
import { MdPrint } from "react-icons/md";
import { useReportOptions } from "src/hooks/Report/useReportOptions"; // Importar el hook
import { Loading } from "src/components/Common/Loading";
import { ReportView } from "src/components/ReportView";

interface ReportOptionsProps {
    company: Company | undefined;
    selectedServices: Service[];
    extractFormData: () => {
      customerData: Customer | null;
      form: FormReport | null;
    };
    description: string;
}

export const ReportOptions: React.FC<ReportOptionsProps> = ({
  company,
  extractFormData,
  selectedServices,
  description,
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
  } = useReportOptions({
      extractFormData,  // Pasamos el estado actualizado aquí
  });
  
  return (
    <div className="grid grid-cols-6 rounded-lg w-full h-12 mb-4 gap-x-4 bg-gradient-to-r from-indigo-600 via-black-nav to-indigo-600 animate-gradient bg-[length:200%]">
      {/* Botón de vista previa */}
      <div className="col-span-2">
        <button
          className="text-base px-6 w-full h-full rounded-xl bg-transparent transition ease-in-out delay-150 hover:bg-indigo-600/80 duration-300"
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
          onClick={ () =>  handlePDFGeneration() }
        >
          <span className="flex items-center justify-center gap-x-2 h-full">
            Exportar
            <PiFilePdfBold className="h-6 w-6" />
          </span>
        </button>
      </div>

      
      {showPreview && (
        <ReportView
          onClose={() => setShowPreview(false)}
          company={company}
          customer={customer}
          form={form}
          selectedServices={selectedServices}
          description={description}
        />
      )}

      {showHiddenPDF && (
        <div className="absolute top-[-9999px] left-[-9999px]">
          <ReportView
            onClose={() => setShowPreview(false)}
            ref={printRef}
            company={company}
            customer={customer}
            form={form}
            selectedServices={selectedServices}
            description={description}
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
