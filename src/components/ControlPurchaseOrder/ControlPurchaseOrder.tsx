'use client';

import { FaPlus } from "react-icons/fa6";
import { SearchBar } from 'src/components/Common/SearchBar';
import { PageTitle } from '../Common/PageTitle';
import { LottiePurchaseOrder } from '../Dashboard/DashWidgets/DashWidgets';
import { HiDocumentPlus } from "react-icons/hi2";
import { ControlPurchaseOrderTable } from './ControlPurchaseOrderTable';
import { Button, DateRangePicker, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@nextui-org/react';
import { I18nProvider } from '@react-aria/i18n';
import { Loading } from '../Common/Loading';
import {  } from "src/redux/services/budgets.Api";
import { useControlPurchaseOrder } from "src/hooks/ControlPurchaseOrder/useControlPurchaseOrder";
import { useDeletePurchaseOrderMutation, useGetPurchaseOrdersQuery } from "src/redux/services/purchaseOrders.Api";
import { PurchaseOrderView } from "../PurchaseOrderView";

export const ControlPurchaseOrder = () => {

  const { data = [], isError, isLoading, isFetching, isSuccess } = useGetPurchaseOrdersQuery();
  const [deleteMutation, {isLoading: isLoadingDelete}] = useDeletePurchaseOrderMutation();
  const {
    searchTerm,
    setSearchTerm,
    selectedRange,
    handleDateRangeChange,
    handleUpdate,
    handleStateUpdate,
    handleDelete,
    confirmDelete,
    handleView,
    handlePrint,
    handleExportPDF,
    isOpenPdf,
    isOpenPreview,
    setIsOpenPreview,
    router,
    purchaseOrderCopy,
    printRef,
    isLoadingPDF,
    isModalOpen,
    setIsModalOpen
  } = useControlPurchaseOrder({ data, isError, isLoading, isFetching, isSuccess, deleteMutation });

  return (
    <>
      <div className="flex justify-center items-center">  
          <LottiePurchaseOrder loop className="h-36 pt-2" />
          <PageTitle title="CONTROL DE ÓRDENES DE COMPRA"/>
      </div>
      <div className="relative flex flex-col pb-6 px-0 sm:px-12">
        <div className="my-4 flex justify-between items-center gap-2">
          <Button
            radius="md"
            className="h-14 text-gray-100 bg-green-600"
            variant="solid"
            onClick={() => router.push("/create/budget")}
          >
            <span className="flex items-center gap-2">
              <HiDocumentPlus className='h-6 w-6' />
              Agregar Orden de Compra
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

        <ControlPurchaseOrderTable
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
          handleStateUpdate={handleStateUpdate}
          handlePrint={handlePrint}
          handleExportPDF={handleExportPDF}
        />

        <button
          className="bg-emerald-600 hover:bg-emerald-800 text-3xl text-white p-5 rounded-full fixed bottom-0 right-0 mr-8 mb-12 shadow-2xl shadow-emerald-400 sm:hidden z-50"
          onClick={() => router.push("/create/budget")}
        >
          <FaPlus />
        </button>
      </div>

      {/* Componente oculto para PDF */}
        {isOpenPdf && (
          <div className="absolute top-[-9999px] left-[-9999px]">
            <PurchaseOrderView
              onClose={() => setIsOpenPreview(false)}
              ref={printRef}
              company={purchaseOrderCopy?.company}
              provider={purchaseOrderCopy?.provider}
              form={purchaseOrderCopy?.form}
              selectedProducts={purchaseOrderCopy?.products}
              subtotal={purchaseOrderCopy?.subtotal}
              ivaPercentage={purchaseOrderCopy?.ivaPercentage}
              igtfPercentage={purchaseOrderCopy?.igtfPercentage}
              calculatedIva={purchaseOrderCopy?.calculatedIva}
              calculatedIgtf={purchaseOrderCopy?.calculatedIgtf}
              total={purchaseOrderCopy?.total}
              totalWithIgft={purchaseOrderCopy?.totalWithIgft}
              state={purchaseOrderCopy?.state}
            /> 
          </div>
        )}

        {/* Modal para vista previa */}
        {isOpenPreview && (
          <PurchaseOrderView
            onClose={() => setIsOpenPreview(false)}
            company={purchaseOrderCopy?.company}
            provider={purchaseOrderCopy?.provider}
            form={purchaseOrderCopy?.form}
            selectedProducts={purchaseOrderCopy?.products}
            subtotal={purchaseOrderCopy?.subtotal}
            ivaPercentage={purchaseOrderCopy?.ivaPercentage}
            igtfPercentage={purchaseOrderCopy?.igtfPercentage}
            calculatedIva={purchaseOrderCopy?.calculatedIva}
            calculatedIgtf={purchaseOrderCopy?.calculatedIgtf}
            total={purchaseOrderCopy?.total}
            totalWithIgft={purchaseOrderCopy?.totalWithIgft}
            state={purchaseOrderCopy?.state}
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
                  Confirmar eliminación de orden de compra
                </ModalHeader>
                <ModalBody>
                  <p className="text-gray-300">
                    ¿Deseas eliminar esta orden de compra? Esta acción no se puede deshacer.
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
