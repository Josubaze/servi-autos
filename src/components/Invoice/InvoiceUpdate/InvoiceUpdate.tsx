'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { Loading } from 'src/components/Common/Loading';
import { useGetInvoiceByIdQuery } from 'src/redux/services/invoices.Api';
import { Invoice } from '../Invoice';

export const InvoiceUpdate = ({ id }: { id: string }) => {
  const { data: invoice, isLoading, isError } = useGetInvoiceByIdQuery(id);
  const router = useRouter();
  const [hasRedirected, setHasRedirected] = useState(false); // Estado para controlar la redirección

  if (isError && !hasRedirected) {
    setHasRedirected(true); // Marcar que se ha hecho la redirección
    toast.error('Error al cargar factura');
    router.push('/control/invoices');
    return null;
  }

  // Validar si el estado es "Pagada" antes de renderizar el componente
  if (invoice?.state === 'Pagada' && !hasRedirected) {
    setHasRedirected(true); // Marcar que se ha hecho la redirección
    toast.error('No se puede modificar una factura pagada');
    router.push('/control/invoices');
    return null;
  }

  return (
    <div>
      {isLoading ? (
        <div className="h-full">
          <Loading />
        </div>
      ) : (
        <Invoice mode="update" invoiceData={invoice} />
      )}
    </div>
  );
};
