'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { Loading } from 'src/components/Common/Loading';
import { useGetInvoiceByIdQuery } from 'src/redux/services/invoices.Api';
import { CreditNote } from '../CreditNote';

export const CreditNoteUpload = ({ id }: { id: string }) => {
  const { data: invoice, isLoading, isError } = useGetInvoiceByIdQuery(id);
  const router = useRouter();
  const [hasRedirected, setHasRedirected] = useState(false); // Estado para controlar la redirección

  if (isError && !hasRedirected) {
    setHasRedirected(true); // Marcar que se ha hecho la redirección
    toast.error('Error al cargar nota de crédito');
    router.push('/control/invoices');
    return null;
  }

  // Validar si el estado es "Borrador" antes de renderizar el componente
  if (invoice?.state === 'Borrador' && !hasRedirected) {
    setHasRedirected(true); // Marcar que se ha hecho la redirección
    toast.error('No se puede crear nota de crédito para un borrador');
    router.push('/control/invoices');
    return null;
  }

  return (
    <div>
      {isLoading ? (
        <div className="flex justify-center items-center h-screen">
          <Loading/>
        </div>
      ) : (
        <CreditNote mode="upload" invoiceData={invoice} />
      )}
    </div>
  );
};
