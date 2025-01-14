'use client';

import { SearchBar } from 'src/components/Common/SearchBar';
import { PageTitle } from '../Common/PageTitle';
import { LottieBudget } from '../Dashboard/DashWidgets/DashWidgets';
import { DateRangePicker } from '@nextui-org/react';
import { I18nProvider } from '@react-aria/i18n';
import { Loading } from '../Common/Loading';
import { useControlExecutionOrder } from 'src/hooks/ControlExecutionOrder/useControlExecutionOrder';
import { useGetExecutionOrdersQuery, useDeleteExecutionOrderMutation } from "src/redux/services/executionOrders.Api";
import { ControlExecutionOrderTable } from "./ControlExecutionOrderTable";
import { ExecutionOrderView } from "../ExecutionOrderView";

export const ControlExecutionOrder = () => {
  
  const { data = [], isError, isLoading, isFetching, isSuccess } = useGetExecutionOrdersQuery();
  const [deleteMutation] = useDeleteExecutionOrderMutation();
  const {
    searchTerm,
    setSearchTerm,
    selectedRange,
    handleDateRangeChange,
    handleStateUpdate,
    handleDelete,
    handleView,
    handlePrint,
    handleExportPDF,
    isOpenPdf,
    isOpenPreview,
    setIsOpenPreview,
    router,
    executionOrderCopy,
    printRef,
    isLoadingPDF,
  } = useControlExecutionOrder({ data, isError, isLoading, isFetching, isSuccess, deleteMutation });

  return (
    <>
      <div className="flex justify-center items-center">  
          <LottieBudget loop className="h-24 pt-2" />
          <PageTitle title="Control de Ordenes de Ejecución"/>
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
            onClose={() => setIsOpenPreview(false)}  
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
