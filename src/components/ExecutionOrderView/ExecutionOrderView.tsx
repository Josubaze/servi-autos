import React, { forwardRef } from 'react';
import dayjs from 'dayjs';
import { IoExitOutline } from 'react-icons/io5';
import { Tooltip } from '@nextui-org/react';
import { NumericFormat } from 'react-number-format';

interface ExecutionOrderViewProps {
    company: Company | undefined;
    customer: Customer | undefined;
    form: Form | undefined;
    selectedServices: Service[] | undefined;
    description: string | undefined;
    state: string | undefined;
    onClose: () => void; // Agregamos la función para cerrar el modal
}

export const ExecutionOrderView = forwardRef<HTMLDivElement, ExecutionOrderViewProps>(({
    company,
    form,
    customer,
    selectedServices,
    description,
    state,
    onClose,
    }, ref) => {
    const formatDate = (date: any) => {
        return date ? dayjs(date).format('DD/MM/YYYY') : 'No disponible';
    };

    return (
        <div
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
        onClick={onClose}
        >
        {/* Botón Cerrar */}
        <Tooltip title="Salir">
            <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-gray-100 hover:bg-gray-100/80 text-gray-800 rounded-full w-10 h-10 flex items-center justify-center transition-transform hover:scale-110 duration-200"
            >
            <IoExitOutline className="w-6 h-6" />
            </button>
        </Tooltip>

        <div
            className="bg-white py-4 px-6 text-black rounded-lg max-w-4xl mx-auto max-h-screen overflow-y-auto scrollbar-custom"
            onClick={(e) => e.stopPropagation()}
        >
            <div 
                className='py-4 px-6'
                ref={ref}
            >
                {/* Header */}
                <div className="text-center border-b pb-4 mb-6">
                <h1 className="text-2xl font-bold uppercase tracking-wide">Orden de Ejecución</h1>
                <p className="text-sm text-gray-600">{company?.name || 'No disponible'}</p>
                <p className="text-sm text-gray-600">{company?.id_card || 'No disponible'}</p>
                <p className="text-sm text-gray-600">{company?.email || 'No disponible'}</p>
                </div>


                {/* Detalles del Trabajo e Información del Cliente (lado a lado) */}
                <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                    <h2 className="text-lg font-semibold mb-2">Detalles del Trabajo</h2>
                    <p><strong>Nº de Orden:</strong> {form?.num || 'No disponible'}</p>
                    <p><strong>Fecha de Creación:</strong> {formatDate(form?.dateCreation)}</p>
                    <p><strong>Estado:</strong> {state || 'Pendiente'}</p>
                </div>
                <div>
                    <h2 className="text-lg font-semibold mb-2">Información del Cliente</h2>
                    <p><strong>Nombre:</strong> {customer?.name || 'No disponible'}</p>
                    <p><strong>Teléfono:</strong> {customer?.phone || 'No disponible'}</p>
                    <p><strong>Email:</strong> {customer?.email || 'No disponible'}</p>
                </div>
                </div>

                
                {/* Tabla de Servicios */}
                <div>
                    <h2 className="text-lg font-semibold mb-4">Servicios a realizar:</h2>
                    <div className="space-y-4"> 
                        {selectedServices?.map((service) => (
                        <div key={service._id} className="rounded-lg bg-white p-6 border border-gray-200">
                            {/* Información del Servicio */}
                            <div className="mb-4">
                            <h3 className="text-lg font-medium text-gray-700">{service.name}</h3>
                            <p className="text-sm text-gray-500">Cantidad: {service.serviceQuantity}</p>
                            </div>

                            {/* Productos Asociados */}
                            {service.products && service.products.length > 0 ? (
                            <div className="mt-4">
                                <p className="text-sm font-semibold text-gray-600 mb-3">Productos asociados:</p>
                                <table className="min-w-full table-auto">
                                <thead>
                                    <tr className="bg-gray-100">
                                    <th className="py-2 px-4 text-left text-sm font-medium text-gray-600">Producto</th>
                                    <th className="py-2 px-4 text-right text-sm font-medium text-gray-600">Cantidad</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {service.products.map((product) => (
                                    <tr key={product.product._id} className="odd:bg-white even:bg-gray-50 hover:bg-gray-200 transition-colors">
                                        <td className="py-2 px-4 text-sm font-medium text-gray-700">{product.product.name}</td>
                                        <td className="py-2 px-4 text-sm text-right text-gray-700">{product.quantity}</td>
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
                <h2 className="text-lg font-semibold mb-2">Descripción</h2>
                <p className="text-justify">{description || 'Sin descripción'}</p>
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
ExecutionOrderView.displayName = 'ExecutionOrderView';
