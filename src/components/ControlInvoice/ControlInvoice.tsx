'use client';

import { FaPlus } from "react-icons/fa6";
import { SearchBar } from 'src/components/Common/SearchBar';
import { PageTitle } from '../Common/PageTitle';
import { LottieInvoice } from '../Dashboard/DashWidgets/DashWidgets';
import { HiDocumentPlus } from "react-icons/hi2";
import { ControlInvoiceTable } from './../ControlInvoice/ControlInvoiceTable';
import { Button, DateRangePicker, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@nextui-org/react';
import { I18nProvider } from '@react-aria/i18n';
import { Loading } from '../Common/Loading';
import { useControlInvoice } from 'src/hooks/ControlInvoice/useControlInvoice';
import { useGetInvoicesQuery, useDeleteInvoiceMutation } from "src/redux/services/invoices.Api";
import { InvoiceView } from "../InvoiceView";

export const ControlInvoice = () => {
  const { data = [], isError, isLoading, isFetching, isSuccess } = useGetInvoicesQuery();
  const [deleteMutation, { isLoading: isLoadingDelete }] = useDeleteInvoiceMutation();
  const {
    searchTerm,
    setSearchTerm,
    selectedRange,
    handleDateRangeChange,
    handleUpdate,
    handleUpload,
    handleStateUpdate,
    handleDelete,
    confirmDelete,
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
    isModalOpen,
    setIsModalOpen,
    isModalChangeState,
    setIsModalChangeState,
    confirmChangeState,
    isLoadingUpdateState
  } = useControlInvoice({ data, isError, isLoading, isFetching, isSuccess, deleteMutation });

  return (
    <>
      <div className="flex justify-center items-center">  
          <LottieInvoice loop className="h-32 pt-2" />
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

      <Modal isOpen={isModalOpen} onOpenChange={setIsModalOpen}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="text-gray-200">
                Confirmar eliminación de factura
              </ModalHeader>
              <ModalBody>
                <p className="text-gray-300">
                  ¿Deseas eliminar esta factura? Esta acción no se puede deshacer.
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

      <Modal isOpen={isModalChangeState} onOpenChange={setIsModalChangeState}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="text-gray-200">
                  Confirmar cambio de estado
                </ModalHeader>
                  <ModalBody>
                    <div className="bg-gray-700/30 p-4 rounded-lg">
                      <p className="text-lg text-gray-200">
                        ¿Deseas cambiar el estado de{" "}
                        <span className="text-green-400 font-semibold">Pendiente</span> a{" "}
                        <span className="text-gray-400 font-semibold">Pagada</span> ?<br />
                        <span className="text-red-500 font-medium">Esta acción no se puede deshacer.</span>
                      </p>
                      <div className="mt-4 p-3 border-l-4 border-red-500 bg-gray-700/30 rounded-md">
                        <p className="text-sm text-gray-300"> <strong className="text-red-400">Nota: </strong> Cambia el estado solo si el pago de la factura ha sido recibido. Una vez actualizado, el monto sin impuestos se sumará a los Ingresos Recibidos. Esta acción no genera un documento, solo notifica en el sistema la recepción del pago. 
                        </p>
                      </div>
                    </div>
                  </ModalBody>
                <ModalFooter>
                  <Button variant="flat" color="default" onPress={() => onClose()}>
                    Cancelar
                  </Button>
                  <Button 
                    color="danger" 
                    onPress={confirmChangeState}
                    isLoading={isLoadingUpdateState}
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