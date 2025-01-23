import React, { forwardRef } from 'react';
import { IoExitOutline } from "react-icons/io5";
import { useCalendarDate } from 'src/hooks/useCalendarDate';
import { Tooltip } from '@nextui-org/react';

interface ReportViewProps {
    onClose: () => void;
    company: Company | undefined;
    customer: Customer | undefined;
    form: FormReport | null | undefined;
    selectedServices: Service[] | undefined;
    description: string;
    state?: string | undefined;
}

export const ReportView = forwardRef<HTMLDivElement, ReportViewProps>((
    { 
    onClose,
    company,
    form,
    customer,
    selectedServices, 
    description,
    state
    },
    ref
    ) => {
    const { transformToCalendarDate } = useCalendarDate();  
    const formatDate = (date : any) => {
        if (!date) return 'No disponible';
        let calendarDate;
        // Verificar si el objeto tiene las propiedades de CalendarDate
        if (date && date.day && date.month && date.year) {
            calendarDate = date; 
        } else {
            calendarDate = transformToCalendarDate(date);
        }

        // Acceder a las propiedades de la fecha
        const day = calendarDate.day;
        const month = calendarDate.month; // El mes comienza desde 1
        const year = calendarDate.year;

        return `${day}/${month}/${year}`;
    };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
    onClick={onClose}>
      {/* Modal Container */}
        <div className="bg-white py-4 px-6 text-black rounded-lg max-w-4xl mx-auto max-h-screen overflow-y-auto scrollbar-custom"
        onClick={(e) => e.stopPropagation()}>
            {/* Botón Cerrar */}
            <Tooltip content='Salir'>
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 bg-gray-100 hover:bg-gray-100/80 text-gray-800 rounded-full w-10 h-10 flex items-center justify-center transition-colors hover:scale-110 duration-200"
                >
                    <span className="text-xl"><IoExitOutline className='flex w-6 h-6'/></span> {/* Icono X */}
                </button>
            </Tooltip>
            <div 
                className='text-black p-4'
                ref={ref}
            >
                {/* Header */}
                <div className="text-center border-b pb-4 mb-6">
                <h1 className="text-2xl font-bold uppercase tracking-wide">Informe</h1>
                <p className="text-sm text-gray-600">{company?.name || 'No disponible'}</p>
                <p className="text-sm text-gray-600">{company?.id_card || 'No disponible'}</p>
                <p className="text-sm text-gray-600">{company?.email || 'No disponible'}</p>
                </div>


                {/* Detalles del Trabajo e Información del Cliente (lado a lado) */}
                <div className="grid grid-cols-2 gap-6 py-2">
                <div>
                    <h2 className="text-lg font-semibold mb-2">Detalles del Reporte</h2>
                    <p className='text-sm'><strong>Nº de Reporte:</strong> {form?.num || 'No disponible'}</p>
                    <p className='text-sm'><strong>Fecha de Creación:</strong> {formatDate(form?.dateCreation)}</p>
                    <p className='text-sm'><strong>Estado: </strong> { state || 'Sin Presupuestar'}</p>
                </div>
                <div>
                    <h2 className="text-lg font-semibold mb-2">Información del Cliente</h2>
                    <p className='text-sm'><strong>Nombre:</strong> {customer?.name || 'No disponible'}</p>
                    <p className='text-sm'><strong>Teléfono:</strong> {customer?.phone || 'No disponible'}</p>
                    <p className='text-sm'><strong>Email:</strong> {customer?.email || 'No disponible'}</p>
                </div>
                </div>

                <div className='mb-4 flex flex-col'>
                    <h2 className="text-lg font-semibold mb-2">Realizado por</h2>
                    <p className='text-sm'><strong>Nombre:</strong> {form?.nameWorker || 'No disponible'}</p>
                    <p className='text-sm'><strong>Email:</strong> {form?.emailWorker || 'No disponible'}</p>
                   
                </div>

                {/* Tabla de Servicios */}
                <div>
                    <h2 className="text-lg font-semibold mb-4">Servicios necesarios:</h2>
                    <div className="space-y-4"> 
                        {selectedServices?.map((service) => (
                        <div key={service._id} className="rounded-lg bg-white p-6 border border-gray-200">
                            {/* Información del Servicio */}
                            <div className="mb-4">
                            <h3 className="text-lg font-medium ">{service.name}</h3>
                            <p className="text-sm ">Cantidad: {service.serviceQuantity}</p>
                            </div>

                            {/* Productos Asociados */}
                            {service.products && service.products.length > 0 ? (
                            <div className="mt-4">
                                <p className="text-sm font-semibold  mb-3">Productos asociados:</p>
                                <table className="min-w-full table-auto">
                                <thead>
                                    <tr className="bg-gray-100">
                                    <th className="py-2 px-4 text-left text-sm font-medium ">Producto</th>
                                    <th className="py-2 px-4 text-right text-sm font-medium ">Cantidad</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {service.products.map((product) => (
                                    <tr key={product.product._id} className="odd:bg-white even:bg-gray-50 hover:bg-gray-200 transition-colors">
                                        <td className="py-2 px-4 text-sm font-medium ">{product.product.name}</td>
                                        <td className="py-2 px-4 text-sm text-right ">{product.quantity}</td>
                                    </tr>
                                    ))}
                                </tbody>
                                </table>
                            </div>
                            ) : (
                            <p className="text-sm text-gray-500 mt-3">No hay productos para este servicio.</p>
                            )}
                        </div>
                        ))}
                    </div>
                </div>


                {/* Descripción */}
                <div className="mt-6">
                <h2 className="text-lg font-semibold mb-2">Descripción u Observación</h2>
                <p className="text-justify">{description || 'Sin descripción u Observación'}</p>
                </div>

                {/* Footer */}
                <div className="mt-6 text-xs text-center text-gray-500 border-t pt-4">
                    Este documento es una representación de la orden de ejecución generada el {formatDate(new Date())}.
                </div>
            </div>
        </div>
    </div>
  );
});

// Agrega el displayName para evitar el error de ESLint
ReportView.displayName = 'ReportView';