'use client';

import { SearchBar } from 'src/components/Common/SearchBar';
import { PageTitle } from '../Common/PageTitle';
import { LottieReport } from '../Dashboard/DashWidgets/DashWidgets';
import { Button, DateRangePicker, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@nextui-org/react';
import { I18nProvider } from '@react-aria/i18n';
import { Loading } from '../Common/Loading';
import { useGetReportsQuery, useDeleteReportMutation } from "src/redux/services/reports.Api";
import { ControlReportTable } from "./ControlReportTable";
import { useControlReport } from 'src/hooks/ControlReport/useControlReport';
import { ReportView } from '../ReportView';

export const ControlReport = () => {
  
  const { data = [], isError, isLoading, isFetching, isSuccess } = useGetReportsQuery();
  const [deleteMutation, { isLoading: isLoadingDelete }] = useDeleteReportMutation();
  const {
    searchTerm,
    setSearchTerm,
    selectedRange,
    handleDateRangeChange,
    handleStateUpdate,
    handleUpdate,
    handleDelete,
    confirmDelete,
    handleView,
    handlePrint,
    handleExportPDF,
    isOpenPdf,
    isOpenPreview,
    setIsOpenPreview,
    reportCopy,
    printRef,
    isLoadingPDF,
    isModalOpen,
    setIsModalOpen,
    isModalOpenNoRef,
    setIsModalOpenNoRef,
    referencingBudgets,
    isModalChangeState,
    setIsModalChangeState,
    confirmChangeState,
    isLoadingUpdateState
  } = useControlReport({ data, isError, isLoading, isFetching, isSuccess, deleteMutation });

  return (
    <>
      <div className="flex justify-center items-center">  
          <LottieReport loop className="h-36" />
          <PageTitle title="CONTROL DE INFORMES"/>
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

        <ControlReportTable
          data={data}
          searchTerm={searchTerm}
          selectedRange={selectedRange}
          isLoading={isLoading}
          isError={isError}
          isFetching={isFetching}
          isSuccess={isSuccess}
          handleUpdate={handleUpdate}
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
            <ReportView
              ref={printRef}
              company={reportCopy?.company}
              customer={reportCopy?.customer}
              form={reportCopy?.form}
              selectedServices={reportCopy?.services}
              state={reportCopy?.state}
              description={reportCopy?.description} 
              onClose={() => setIsOpenPreview(false)}           
            /> 
          </div>
        )}

        {/* Modal para vista previa */}
        {isOpenPreview && (
          <ReportView
            company={reportCopy?.company}
            customer={reportCopy?.customer}
            form={reportCopy?.form}
            selectedServices={reportCopy?.services}
            state={reportCopy?.state}
            description={reportCopy?.description} 
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
                <ModalHeader>Confirmar eliminación de Informe</ModalHeader>
                <ModalBody>
                  <div className="bg-gray-700/30 p-4 rounded-lg">
                    <h2 className="text-lg font-semibold mb-4 text-gray-200">Lista de Informes:</h2>
                    
                    <div className="max-h-60 overflow-y-auto space-y-4 scrollbar-custom">
                      {referencingBudgets?.map((budget) => (
                        <div
                          key={budget._id}
                          className="p-4 border-l-4 border-indigo-600 bg-gray-800/50 rounded-md shadow-md"
                        >
                          <p className="text-gray-300 text-sm font-semibold">ID:</p>
                          <p className="text-gray-400 text-sm break-all">{budget._id}</p>
                          
                          <p className="text-gray-300 text-sm font-semibold mt-2">N°:</p>
                          <p className="text-gray-400 text-sm">{budget.form.num}</p>
                          
                          <p className="text-gray-300 text-sm font-semibold mt-2">Descripción:</p>
                          <p className="text-gray-400 text-sm">{budget.description}</p>
                          
                          <p className="text-gray-300 text-sm font-semibold mt-2">Fecha de Creación:</p>
                          <p className="text-gray-400 text-sm">{new Date(budget.form.dateCreation).toLocaleDateString("es-ES")}</p>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 p-3 border-l-4 border-red-500 bg-gray-700/30 rounded-md">
                      <p className="text-red-500 font-medium">
                        Al eliminar este informe, se removerá de todos los presupuestos asociados.
                        <br />
                        <span className="font-semibold">¿Deseas continuar?</span>
                      </p>
                    </div>
                  </div>
                </ModalBody>

                <ModalFooter>
                  <Button
                    variant="flat"
                    color="default"
                    onPress={() => onClose()}
                  >
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

        <Modal isOpen={isModalOpenNoRef} onOpenChange={setIsModalOpenNoRef}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="text-gray-200">
                  Confirmar eliminación de informe
                </ModalHeader>
                <ModalBody>
                  <p className="text-gray-300">
                    ¿Deseas eliminar este informe? Esta acción no se puede deshacer.
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
                        <span className="text-green-400 font-semibold">Sin Presupuestar</span> a{" "}
                        <span className="text-gray-400 font-semibold">Presupuestado</span> ?<br />
                        <span className="text-red-500 font-medium">Esta acción no se puede deshacer.</span>
                      </p>
                      <div className="mt-4 p-3 border-l-4 border-red-500 bg-gray-700/30 rounded-md">
                        <p className="text-sm text-gray-300">
                          <strong className="text-red-400">Nota:</strong> Esto es un último recurso en caso de que la actualización no se haya realizado automáticamente. No genera documento solo cambia el estado.
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
