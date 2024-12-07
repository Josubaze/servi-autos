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

export const ControlBudget = () => {
  const { data = [], isError, isLoading, isFetching, isSuccess } = useGetBudgetsQuery();
  const [deleteBudget] = useDeleteBudgetMutation();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const router = useRouter();

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

          <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </div>

        <ControlBudgetTable
          data={data}
          searchTerm={searchTerm}
          isLoading={isLoading}
          isError={isError}
          isFetching={isFetching}
          isSuccess={isSuccess}
          handleDelete={handleDelete}
          handleUpdate={handleUpdate}
        />

        <button
          className="bg-emerald-600 hover:bg-emerald-800 text-3xl text-white p-5 rounded-full fixed bottom-0 right-0 mr-8 mb-12 shadow-2xl shadow-emerald-400 sm:hidden z-50"
          onClick={() => router.push("/create/budget")}
        >
          <FaPlus />
        </button>
      </div>
    </>
  );
};
