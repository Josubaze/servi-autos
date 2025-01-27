'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { Loading } from 'src/components/Common/Loading';
import { PurchaseOrder } from '../PurchaseOrder';
import { useGetPurchaseOrderByIdQuery } from 'src/redux/services/purchaseOrders.Api';

export const PurchaseOrderUpload = ({ id }: { id: string }) => {
  const { data: purchaseOrder, isLoading, isError } = useGetPurchaseOrderByIdQuery(id);
  const router = useRouter();
  const [hasRedirected, setHasRedirected] = useState(false); // Estado para controlar la redirección

  if (isError && !hasRedirected) {
    setHasRedirected(true); // Marcar que se ha hecho la redirección
    toast.error('Error al cargar orden de compra');
    router.push('/control/purchase-orders');
    return null;
  }

  // Validar si el estado es "Recibida" antes de renderizar el componente
  if (purchaseOrder?.state === 'Recibida' && !hasRedirected) {
    setHasRedirected(true); // Marcar que se ha hecho la redirección
    toast.error('No se puede actualizar una orden de compra ya recibida');
    router.push('/control/purchase-orders');
    return null;
  }

  return (
    <div>
      {isLoading ? (
        <div className="flex justify-center items-center h-screen">
          <Loading/>
        </div>
      ) : (
        <PurchaseOrder mode="upload" purchaseOrderData={purchaseOrder} />
      )}
    </div>
  );
};
