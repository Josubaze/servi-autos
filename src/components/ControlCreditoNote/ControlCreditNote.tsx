'use client';

import { FaPlus } from "react-icons/fa6";
import { SearchBar } from 'src/components/Common/SearchBar';
import { PageTitle } from '../Common/PageTitle';
import { HiDocumentPlus } from "react-icons/hi2";
import { Button, DateRangePicker, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@nextui-org/react';
import { I18nProvider } from '@react-aria/i18n';
import { Loading } from '../Common/Loading';
import { useControlCreditNote } from 'src/hooks/ControlCreditNote/useControlCreditNote';
import { useGetCreditNotesQuery, useDeleteCreditNoteMutation } from "src/redux/services/creditNotes.Api";
import { ControlCreditNoteTable } from "./ControlCreditNoteTable";
import { LottieCreditNote } from "../Dashboard/DashWidgets/DashWidgets";
import { CreditNoteView } from "../CreditNoteView";

export const ControlCreditNote = () => {
  
  const { data = [], isError, isLoading, isFetching, isSuccess } = useGetCreditNotesQuery();
  const [deleteMutation, {isLoading: isLoadingDelete}] = useDeleteCreditNoteMutation();
  const {
    searchTerm,
    setSearchTerm,
    selectedRange,
    handleDateRangeChange,
    handleDelete,
    confirmDelete,
    handleView,
    handlePrint,
    handleExportPDF,
    isOpenPdf,
    isOpenPreview,
    setIsOpenPreview,
    setIsOpenPdf,
    router,
    creditNoteCopy,
    printRef,
    isLoadingPDF,
    isModalOpen,
    setIsModalOpen,
  } = useControlCreditNote({ data, isError, isLoading, isFetching, isSuccess, deleteMutation });

  return (
    <>
      <div className="flex justify-center items-center">  
          <LottieCreditNote loop className="h-28 pt-2" />
          <PageTitle title="CONTROL DE NOTAS DE CRÉDITO"/>
      </div>
      <div className="relative flex flex-col pb-6 px-0 sm:px-12">
        <div className="my-4 flex justify-between items-center gap-2">
          <Button
            radius="md"
            className="h-14 text-gray-100 bg-green-600"
            variant="solid"
            onClick={() => router.push("/create/credit-note")}
          >
            <span className="flex items-center gap-2">
              <HiDocumentPlus className='h-6 w-6' />
              Agregar Nota de Crédito
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
          onClick={() => router.push("/create/credit-note")}
        >
          <FaPlus />
        </button>
      </div>

      {/* Componente oculto para PDF */}
        {isOpenPdf && (
          <div className="absolute top-[-9999px] left-[-9999px]">
            <CreditNoteView
              onClose={() => setIsOpenPdf(false)}
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
          <CreditNoteView
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

        <Modal isOpen={isModalOpen} onOpenChange={setIsModalOpen}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="text-gray-200">
                  Confirmar eliminación de nota de crédito
                </ModalHeader>
                <ModalBody>
                  <p className="text-gray-300">
                    ¿Deseas eliminar esta nota de crédito? Esta acción no se puede deshacer.
                  </p>
                </ModalBody>
                <ModalFooter>
                  <Button variant="flat" color="default" onPress={() => onClose()}>
                    Cancelar
                  </Button>
                  <Button 
                    color="danger" 
                    onPress={confirmDelete}
                    isLoading={isLoadingDelete}
                  >                      
                    Aceptar
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
    </>
  );
};
