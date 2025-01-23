'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { Report } from 'src/components/Report';
import { Loading } from 'src/components/Common/Loading';
import { useGetReportByIdQuery } from 'src/redux/services/reports.Api';

export const ReportUpdate = ({ id }: { id: string }) => {
  const { data: report, isLoading, isError } = useGetReportByIdQuery(id);
  const router = useRouter();
  const [hasRedirected, setHasRedirected] = useState(false); // Estado para controlar la redirección

  if (isError && !hasRedirected) {
    setHasRedirected(true); // Marcar que se ha hecho la redirección
    toast.error('Error al cargar el informe');
    router.push('/control/reports');
    return null;
  }

  // Validar si el estado es "Aprobado" antes de renderizar el componente
  if (report?.state === 'Presupuestado' && !hasRedirected) {
    setHasRedirected(true); // Marcar que se ha hecho la redirección
    toast.error('No se puede modificar un informe Presupuestado');
    router.push('/control/reports');
    return null;
  }

  return (
    <div>
      {isLoading ? (
        <div className="flex justify-center items-center h-screen">
          <Loading/>
        </div>
      ) : (
        <Report mode="upload" reportData={report} />
      )}
    </div>
  );
};
