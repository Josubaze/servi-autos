'use client';

import { FaPlus } from "react-icons/fa6";
import { SearchBar } from 'src/components/Common/SearchBar';
import { PageTitle } from '../Common/PageTitle';
import { LottieBudget } from '../Dashboard/DashWidgets/DashWidgets';
import { HiDocumentPlus } from "react-icons/hi2";
import { ControlInvoiceTable } from './../ControlInvoice/ControlInvoiceTable';
import { Button, DateRangePicker } from '@nextui-org/react';
import { I18nProvider } from '@react-aria/i18n';
import { Loading } from '../Common/Loading';
import { useControlInvoice } from 'src/hooks/ControlInvoice/useControlInvoice';
import { useGetInvoicesQuery, useDeleteInvoiceMutation } from "src/redux/services/invoices.Api";
import { InvoiceView } from "../InvoiceView";

export const ControlInvoice = () => {
  
  const { data = [], isError, isLoading, isFetching, isSuccess } = useGetInvoicesQuery();
  const [deleteMutation] = useDeleteInvoiceMutation();
  const {
    searchTerm,
    setSearchTerm,
    selectedRange,
    handleDateRangeChange,
    handleUpdate,
    handleUpload,
    handleStateUpdate,
    handleDelete,
    handleView,
    handlePrint,
    handleExportPDF,
    isOpenPdf,
    setIsOpenPdf,
    isOpenPreview,
    setIsOpenPreview,
    router,
    invoiceCopy,
    printRef,
    isLoadingPDF,
  } = useControlInvoice({ data, isError, isLoading, isFetching, isSuccess, deleteMutation });

  return (
    <>
      <div className="flex justify-center items-center">  
          <LottieBudget loop className="h-24 pt-2" />
          <PageTitle title="CONTROL DE FACTURAS"/>
      </div>
      <div className="relative flex flex-col pb-6 px-0 sm:px-12">
        <div className="my-4 flex justify-between items-center gap-2">
          <Button
            radius="md"
            className="h-14 text-gray-100 bg-green-600"
            variant="solid"
            onClick={() => router.push("/create/invoice")}
          >
            <span className="flex items-center gap-2">
              <HiDocumentPlus className='h-6 w-6' />
              Agregar Factura
            </span>
          </Button>
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

        <ControlInvoiceTable
          data={data}
          searchTerm={searchTerm}
          selectedRange={selectedRange}
          isLoading={isLoading}
          isError={isError}
          isFetching={isFetching}
          isSuccess={isSuccess}
          handleView={handleView}
          handleDelete={handleDelete}
          handleUpdate={handleUpdate}
          handleUpload={handleUpload}
          handleStateUpdate={handleStateUpdate}
          handlePrint={handlePrint}
          handleExportPDF={handleExportPDF}
        />

        <button
          className="bg-emerald-600 hover:bg-emerald-800 text-3xl text-white p-5 rounded-full fixed bottom-0 right-0 mr-8 mb-12 shadow-2xl shadow-emerald-400 sm:hidden z-50"
          onClick={() => router.push("/create/invoice")}
        >
          <FaPlus />
        </button>
      </div>

      {/* Componente oculto para PDF */}
        {isOpenPdf && (
          <div className="absolute top-[-9999px] left-[-9999px]">
            <InvoiceView
              onClose={() => setIsOpenPdf(false)}
              ref={printRef}
              company={invoiceCopy?.company}
              customer={invoiceCopy?.customer}
              form={invoiceCopy?.form}
              selectedServices={invoiceCopy?.services}
              subtotal={invoiceCopy?.subtotal}
              ivaPercentage={invoiceCopy?.ivaPercentage}
              igtfPercentage={invoiceCopy?.igtfPercentage}
              calculatedIva={invoiceCopy?.calculatedIva}
              calculatedIgtf={invoiceCopy?.calculatedIgtf}
              total={invoiceCopy?.total}
              totalWithIgft={invoiceCopy?.totalWithIgft}
            /> 
          </div>
        )}

        {/* Modal para vista previa */}
        {isOpenPreview && (
          <InvoiceView
            onClose={() => setIsOpenPreview(false)}
            company={invoiceCopy?.company}
            customer={invoiceCopy?.customer}
            form={invoiceCopy?.form}
            selectedServices={invoiceCopy?.services}
            subtotal={invoiceCopy?.subtotal}
            ivaPercentage={invoiceCopy?.ivaPercentage}
            igtfPercentage={invoiceCopy?.igtfPercentage}
            calculatedIva={invoiceCopy?.calculatedIva}
            calculatedIgtf={invoiceCopy?.calculatedIgtf}
            total={invoiceCopy?.total}
            totalWithIgft={invoiceCopy?.totalWithIgft}
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
