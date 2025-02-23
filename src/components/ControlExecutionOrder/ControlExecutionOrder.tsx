'use client';

import { SearchBar } from 'src/components/Common/SearchBar';
import { PageTitle } from '../Common/PageTitle';
import { LottieExecutionOrder } from '../Dashboard/DashWidgets/DashWidgets';
import { Button, DateRangePicker, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@nextui-org/react';
import { I18nProvider } from '@react-aria/i18n';
import { Loading } from '../Common/Loading';
import { useControlExecutionOrder } from 'src/hooks/ControlExecutionOrder/useControlExecutionOrder';
import { useGetExecutionOrdersQuery, useDeleteExecutionOrderMutation } from "src/redux/services/executionOrders.Api";
import { ControlExecutionOrderTable } from "./ControlExecutionOrderTable";
import { ExecutionOrderView } from "../ExecutionOrderView";

export const ControlExecutionOrder = () => {
  
  const { data = [], isError, isLoading, isFetching, isSuccess } = useGetExecutionOrdersQuery();
  const [deleteMutation, { isLoading: isLoadingDelete }] = useDeleteExecutionOrderMutation();
  const {
    searchTerm,
    setSearchTerm,
    selectedRange,
    handleDateRangeChange,
    handleStateUpdate,
    handleDelete,
    confirmDelete,
    handleView,
    handlePrint,
    handleExportPDF,
    isOpenPdf,
    isOpenPreview,
    setIsOpenPreview,
    executionOrderCopy,
    printRef,
    isLoadingPDF,
    isModalOpen,
    setIsModalOpen,
    isModalChangeState,
    setIsModalChangeState,
    confirmChangeState,
    isLoadingUpdateState
  } = useControlExecutionOrder({ data, isError, isLoading, isFetching, isSuccess, deleteMutation });

  return (
    <>
      <div className="flex justify-center items-center">  
          <LottieExecutionOrder loop className="h-28 pt-2" />
          <PageTitle title="CONTROL DE ORDEN DE EJECUCIÓN"/>
      </div>
      <div className="relative flex flex-col pb-6 px-0 sm:px-12">
        <div className="my-4 flex justify-end items-center gap-2">

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

        <ControlExecutionOrderTable
          data={data}
          searchTerm={searchTerm}
          selectedRange={selectedRange}
          isLoading={isLoading}
          isError={isError}
          isFetching={isFetching}
          isSuccess={isSuccess}
          handleView={handleView}
          handleDelete={handleDelete}
          handleStateUpdate={handleStateUpdate}
          handlePrint={handlePrint}
          handleExportPDF={handleExportPDF}
        />

      </div>

      {/* Componente oculto para PDF */}
        {isOpenPdf && (
          <div className="absolute top-[-9999px] left-[-9999px]">
            <ExecutionOrderView
              ref={printRef}
              company={executionOrderCopy?.company}
              customer={executionOrderCopy?.customer}
              form={executionOrderCopy?.form}
              selectedServices={executionOrderCopy?.services}
              state={executionOrderCopy?.state}
              description={executionOrderCopy?.description} 
              onClose={() => setIsOpenPreview(false)}           
            /> 
          </div>
        )}

        {/* Modal para vista previa */}
        {isOpenPreview && (
          <ExecutionOrderView
            ref={printRef}
            company={executionOrderCopy?.company}
            customer={executionOrderCopy?.customer}
            form={executionOrderCopy?.form}
            selectedServices={executionOrderCopy?.services}
            state={executionOrderCopy?.state}
            description={executionOrderCopy?.description} 
            numberInvoice={executionOrderCopy?.numInvoice}
            onClose={() => setIsOpenPreview(false)}  
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
                  Confirmar eliminación de orden de ejecución
                </ModalHeader>
                <ModalBody>
                  <p className="text-gray-300">
                    ¿Deseas eliminar esta orden de ejecución? Esta acción no se puede deshacer.
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
                        <span className="text-green-400 font-semibold">En Proceso</span> a{" "}
                        <span className="text-gray-400 font-semibold">Finalizado</span> ?<br />
                        <span className="text-red-500 font-medium">Esta acción no se puede deshacer.</span>
                      </p>
                      <div className="mt-4 p-3 border-l-4 border-red-500 bg-gray-700/30 rounded-md">
                        <p className="text-sm text-gray-300"> <strong className="text-red-400">Nota: </strong> Cambia el estado solo si todos los servicios de la orden han sido completados. Esta acción no genera un documento, solo notifica en el sistema que el trabajo ha finalizado. 
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
