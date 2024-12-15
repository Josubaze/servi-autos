'use client';

import { FaPlus } from "react-icons/fa6";
import { SearchBar } from 'src/components/Common/SearchBar';
import { PageTitle } from '../Common/PageTitle';
import { LottieBudget } from '../Dashboard/DashWidgets/DashWidgets';
import { HiDocumentPlus } from "react-icons/hi2";
import { ControlBudgetTable } from './ControlBudgetTable/ControlBudgetTable';
import { DateRangePicker } from '@nextui-org/react';
import { I18nProvider } from '@react-aria/i18n';
import { BudgetPreview } from '../BudgetPreview';
import { BudgetPDF } from '../BudgetPDF';
import { Loading } from '../Common/Loading';
import { useControlBudget } from 'src/hooks/ControlBudget/useControlBudget';

export const ControlBudget = () => {
  const {
    data,
    isError,
    isLoadingBudget,
    isFetching,
    isSuccess,
    searchTerm,
    setSearchTerm,
    selectedRange,
    handleDateRangeChange,
    handleUpdate,
    handleDelete,
    handleView,
    handlePrint,
    handleExportPDF,
    isOpenPdf,
    isOpenPreview,
    setIsOpenPreview,
    router,
    budgetCopy,
    printRef,
    isLoadingPDF,
  } = useControlBudget();

  return (
    <>
      <div className="flex justify-center items-center">  
          <LottieBudget loop className="h-24 pt-2" />
          <PageTitle title="Control de Presupuestos"/>
      </div>
      <div className="relative flex flex-col pb-6 px-0 sm:px-12">
        <div className="my-4 flex justify-between items-center gap-2">
          <button
            className="transition ease-in-out delay-150 bg-emerald-600 text-white px-3 py-3 rounded-full hover:-translate-y-1 hover:scale-110 hover:bg-emerald-500 duration-300 max-sm:hidden"
            onClick={() => window.location.href = '/create/budget'} 
          >
            <span className='flex items-center'>
              <HiDocumentPlus className='h-6 w-6' />
              Agregar Presupuesto
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

        <ControlBudgetTable
          data={data}
          searchTerm={searchTerm}
          selectedRange={selectedRange}
          isLoading={isLoadingBudget}
          isError={isError}
          isFetching={isFetching}
          isSuccess={isSuccess}
          handleView={handleView}
          handleDelete={handleDelete}
          handleUpdate={handleUpdate}
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
            <BudgetPDF
              ref={printRef}
              company={budgetCopy?.company}
              customer={budgetCopy?.customer}
              budgetForm={budgetCopy?.budgetForm}
              selectedServices={budgetCopy?.services}
              subtotal={budgetCopy?.subtotal}
              ivaPercentage={budgetCopy?.ivaPercentage}
              igtfPercentage={budgetCopy?.igtfPercentage}
              calculatedIva={budgetCopy?.calculatedIva}
              calculatedIgtf={budgetCopy?.calculatedIgtf}
              total={budgetCopy?.total}
              totalWithIgft={budgetCopy?.totalWithIgft}
            /> 
          </div>
        )}

        {/* Modal para vista previa */}
        {isOpenPreview && (
          <BudgetPreview
            isOpen={isOpenPreview}
            onClose={() => setIsOpenPreview(false)}
            company={budgetCopy?.company}
            customer={budgetCopy?.customer}
            budgetForm={budgetCopy?.budgetForm}
            selectedServices={budgetCopy?.services}
            subtotal={budgetCopy?.subtotal}
            ivaPercentage={budgetCopy?.ivaPercentage}
            igtfPercentage={budgetCopy?.igtfPercentage}
            calculatedIva={budgetCopy?.calculatedIva}
            calculatedIgtf={budgetCopy?.calculatedIgtf}
            total={budgetCopy?.total}
            totalWithIgft={budgetCopy?.totalWithIgft}
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
