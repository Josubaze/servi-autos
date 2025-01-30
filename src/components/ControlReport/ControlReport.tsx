'use client';

import { SearchBar } from 'src/components/Common/SearchBar';
import { PageTitle } from '../Common/PageTitle';
import { LottieBudget } from '../Dashboard/DashWidgets/DashWidgets';
import { DateRangePicker } from '@nextui-org/react';
import { I18nProvider } from '@react-aria/i18n';
import { Loading } from '../Common/Loading';
import { useGetReportsQuery, useDeleteReportMutation } from "src/redux/services/reports.Api";
import { ControlReportTable } from "./ControlReportTable";
import { useControlReport } from 'src/hooks/ControlReport/useControlReport';
import { ReportView } from '../ReportView';

export const ControlReport = () => {
  
  const { data = [], isError, isLoading, isFetching, isSuccess } = useGetReportsQuery();
  const [deleteMutation] = useDeleteReportMutation();
  const {
    searchTerm,
    setSearchTerm,
    selectedRange,
    handleDateRangeChange,
    handleStateUpdate,
    handleUpdate,
    handleDelete,
    handleView,
    handlePrint,
    handleExportPDF,
    isOpenPdf,
    isOpenPreview,
    setIsOpenPreview,
    reportCopy,
    printRef,
    isLoadingPDF,
  } = useControlReport({ data, isError, isLoading, isFetching, isSuccess, deleteMutation });

  return (
    <>
      <div className="flex justify-center items-center">  
          <LottieBudget loop className="h-24 pt-2" />
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
    </>
  );
};
