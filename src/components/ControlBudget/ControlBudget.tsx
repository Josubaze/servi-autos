'use client';

import { useState } from 'react';
import { FaPlus } from "react-icons/fa6";
import { SearchBar } from 'src/components/Common/SearchBar';
import { PageTitle } from '../Common/PageTitle';
import { LottieBudget } from '../Dashboard/DashWidgets/DashWidgets';
import { HiDocumentPlus } from "react-icons/hi2";
import { useDeleteBudgetMutation, useGetBudgetsQuery } from 'src/redux/services/budgets.Api';
import { ControlBudgetTable } from './ControlBudgetTable/ControlBudgetTable';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { DateRangePicker, RangeValue, DateValue } from '@nextui-org/react';
import { I18nProvider } from '@react-aria/i18n';
import { Budget } from '../Budget';

export const ControlBudget = () => {
  const { data = [], isError, isLoading, isFetching, isSuccess } = useGetBudgetsQuery();
  const [deleteBudget] = useDeleteBudgetMutation();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const router = useRouter();
  const [selectedRange, setSelectedRange] = useState<RangeValue<DateValue> | null>(null);
  const [showHiddenPDF, setShowHiddenPDF] = useState<boolean>(false);
  const [isRenderBudget, setIsRenderBudget] = useState<boolean>(false);
  const [budgetCopy, setBudgetCopy] = useState<Budget>();
  const handleDateRangeChange = (value: RangeValue<DateValue> | null) => {
    setSelectedRange(value);
    console.log('Rango de fechas seleccionado:', value);
  };

  const handleUpdate = (budgetId: string) => {
    if (budgetId){
      router.push(`/update/budget/${budgetId}`);
    }
  };

  const handleDelete = async (budgetId: string) => {
    try {
      await deleteBudget(budgetId); 
    } catch (error) {
      toast.error('Hubo un error al eliminar el presupuesto');
    } finally {
      toast.success('Presupuesto eliminado exitosamente');
    }
  };
  
  const handlePrint = async (budget: Budget) => {
    try {
      setIsRenderBudget(true);
      if(budget){
        setBudgetCopy(budget);
      }
    } catch (error) {
      toast.error('Hubo un error al imprimir el presupuesto');
    }
  }


  const handleExport = async () => {}

  
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
          isLoading={isLoading}
          isError={isError}
          isFetching={isFetching}
          isSuccess={isSuccess}
          handleDelete={handleDelete}
          handleUpdate={handleUpdate}
          handlePrint={handlePrint}
          handleExport={handleExport}
        />

        <button
          className="bg-emerald-600 hover:bg-emerald-800 text-3xl text-white p-5 rounded-full fixed bottom-0 right-0 mr-8 mb-12 shadow-2xl shadow-emerald-400 sm:hidden z-50"
          onClick={() => router.push("/create/budget")}
        >
          <FaPlus />
        </button>
      </div>

      {isRenderBudget && (
        <Budget mode="update" budgetData={budgetCopy} />
      )}


      {/* Componente oculto para PDF */}
        {showHiddenPDF && (
          <div className="absolute top-[-9999px] left-[-9999px]">
            {/* <BudgetPDF
              ref={printRef}
              company={company}
              extractFormData={extractFormData}
              selectedServices={selectedServices}
              subtotal={subtotal}
              ivaPercentage={ivaPercentage}
              igtfPercentage={igtfPercentage}
              calculatedIva={calculatedIva}
              calculatedIgtf={calculatedIgtf}
              total={total}
              totalWithIgft={totalWithIgft}
            /> */}
          </div>
        )}
    </>
  );
};
