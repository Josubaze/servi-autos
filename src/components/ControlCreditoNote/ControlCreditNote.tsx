'use client';

import { FaPlus } from "react-icons/fa6";
import { SearchBar } from 'src/components/Common/SearchBar';
import { PageTitle } from '../Common/PageTitle';
import { HiDocumentPlus } from "react-icons/hi2";
import { DateRangePicker } from '@nextui-org/react';
import { I18nProvider } from '@react-aria/i18n';
import { Loading } from '../Common/Loading';
import { useControlCreditNote } from 'src/hooks/ControlCreditNote/useControlInvoice';
import { useGetCreditNotesQuery, useDeleteCreditNoteMutation } from "src/redux/services/creditNotes.Api";
import { InvoicePreview } from "../InvoicePreview";
import { ControlCreditNoteTable } from "./ControlInvoiceTable";
import { LottieCreditNote } from "../Dashboard/DashWidgets/DashWidgets";
import { CreditNotePDF } from "../../components/CreditNotePDF";
import { CreditNote } from "../CreditNote";
import { CreditNotePreview } from "../CreditNotePreview";

export const ControlCreditNote = () => {
  
  const { data = [], isError, isLoading, isFetching, isSuccess } = useGetCreditNotesQuery();
  const [deleteMutation] = useDeleteCreditNoteMutation();
  const {
    searchTerm,
    setSearchTerm,
    selectedRange,
    handleDateRangeChange,
    handleDelete,
    handleView,
    handlePrint,
    handleExportPDF,
    isOpenPdf,
    isOpenPreview,
    setIsOpenPreview,
    router,
    creditNoteCopy,
    printRef,
    isLoadingPDF,
  } = useControlCreditNote({ data, isError, isLoading, isFetching, isSuccess, deleteMutation });

  return (
    <>
      <div className="flex justify-center items-center">  
          <LottieCreditNote loop className="h-32 pt-2" />
          <PageTitle title="Control de Notas de Crédito"/>
      </div>
      <div className="relative flex flex-col pb-6 px-0 sm:px-12">
        <div className="my-4 flex justify-between items-center gap-2">
          <button
            className="transition ease-in-out delay-150 bg-emerald-600 text-white px-3 py-3 rounded-full hover:-translate-y-1 hover:scale-110 hover:bg-emerald-500 duration-300 max-sm:hidden"
            onClick={() => window.location.href = '/create/credit-note'} 
          >
            <span className='flex items-center'>
              <HiDocumentPlus className='h-6 w-6' />
              Agregar Nota de Crédito
            </span>
          </button>
          <div className='flex gap-x-4'>
            {/* Envolvemos el DateRangePicker con I18nProvider para cambiar localizacion*/}
            <I18nProvider locale="es">
              <DateRangePicker
                className="max-w-[260px]"
                label="Rango de Fechas"
                value={selectedRange}
                onChange={handleDateRangeChange}
              />
            </I18nProvider>
            <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          </div>
        </div>

        <ControlCreditNoteTable
          data={data}
          searchTerm={searchTerm}
          selectedRange={selectedRange}
          isLoading={isLoading}
          isError={isError}
          isFetching={isFetching}
          isSuccess={isSuccess}
          handleView={handleView}
          handleDelete={handleDelete}
          handlePrint={handlePrint}
          handleExportPDF={handleExportPDF}
        />

        <button
          className="bg-emerald-600 hover:bg-emerald-800 text-3xl text-white p-5 rounded-full fixed bottom-0 right-0 mr-8 mb-12 shadow-2xl shadow-emerald-400 sm:hidden z-50"
          onClick={() => router.push("/create/invoices")}
        >
          <FaPlus />
        </button>
      </div>

      {/* Componente oculto para PDF */}
        {isOpenPdf && (
          <div className="absolute top-[-9999px] left-[-9999px]">
            <CreditNotePDF
              ref={printRef}
              company={creditNoteCopy?.company}
              customer={creditNoteCopy?.customer}
              form={creditNoteCopy?.form}
              selectedServices={creditNoteCopy?.services}
              subtotal={creditNoteCopy?.subtotal}
              ivaPercentage={creditNoteCopy?.ivaPercentage}
              igtfPercentage={creditNoteCopy?.igtfPercentage}
              calculatedIva={creditNoteCopy?.calculatedIva}
              calculatedIgtf={creditNoteCopy?.calculatedIgtf}
              total={creditNoteCopy?.total}
              totalWithIgft={creditNoteCopy?.totalWithIgft}
              description={creditNoteCopy?.description}
            /> 
          </div>
        )}

        {/* Modal para vista previa */}
        {isOpenPreview && (
          <CreditNotePreview
            isOpen={isOpenPreview}
            onClose={() => setIsOpenPreview(false)}
            company={creditNoteCopy?.company}
            customer={creditNoteCopy?.customer}
            form={creditNoteCopy?.form}
            selectedServices={creditNoteCopy?.services}
            subtotal={creditNoteCopy?.subtotal}
            ivaPercentage={creditNoteCopy?.ivaPercentage}
            igtfPercentage={creditNoteCopy?.igtfPercentage}
            calculatedIva={creditNoteCopy?.calculatedIva}
            calculatedIgtf={creditNoteCopy?.calculatedIgtf}
            total={creditNoteCopy?.total}
            totalWithIgft={creditNoteCopy?.totalWithIgft}
            description={creditNoteCopy?.description}
          />
        )}

        {isLoadingPDF && (
          <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md">
            <Loading />
          </div>
        )}
    </>
  );
};
