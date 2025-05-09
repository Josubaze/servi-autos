'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { Budget } from 'src/components/Budget';
import { Loading } from 'src/components/Common/Loading';
import { useGetBudgetByIdQuery } from 'src/redux/services/budgets.Api';

export const BudgetUpdate = ({ id }: { id: string }) => {
  const { data: budget, isLoading, isError } = useGetBudgetByIdQuery(id);
  const router = useRouter();
  const [hasRedirected, setHasRedirected] = useState(false); // Estado para controlar la redirección

  if (isError && !hasRedirected) {
    setHasRedirected(true); // Marcar que se ha hecho la redirección
    toast.error('Error al cargar el presupuesto');
    router.push('/control/budgets');
    return null;
  }

  // Validar si el estado es "Aprobado" antes de renderizar el componente
  if (budget?.state === 'Aprobado' && !hasRedirected) {
    setHasRedirected(true); // Marcar que se ha hecho la redirección
    toast.error('No se puede modificar un presupuesto Aprobado');
    router.push('/control/budgets');
    return null;
  }

  return (
    <div>
      {isLoading ? (
        <div className="flex justify-center items-center h-screen">
          <Loading/>
        </div>
      ) : (
        <Budget mode="upload" budgetData={budget} />
      )}
    </div>
  );
};
