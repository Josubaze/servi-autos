import React from 'react';
import dayjs from 'dayjs'; // Importa dayjs
import { NumericFormat } from 'react-number-format';
import { IoExitOutline } from "react-icons/io5";

interface BudgetPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  company: Company | undefined;
  customer: Customer | null;
  budgetForm: BudgetForm | null;
  selectedServices: Service[];
  subtotal: number;
  ivaPercentage: number;
  igtfPercentage: number;
  calculatedIva: number;
  calculatedIgtf: number;
  total: number;
  totalWithIgft: number;
}

export const BudgetPreview: React.FC<BudgetPreviewProps> = ({
  isOpen,
  onClose,
  company,
  customer,
  budgetForm,
  selectedServices,
  subtotal,
  ivaPercentage,
  igtfPercentage,
  calculatedIva,
  calculatedIgtf,
  total,
  totalWithIgft,
}) => {
  if (!isOpen) return null; // No renderizar si el modal está cerrado

  // Función para formatear fechas con dayjs
  const formatDate = (date: any) => {
    return date ? dayjs(date).format('DD/MM/YYYY') : 'No disponible';
  };
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
    onClick={onClose}>
      {/* Modal Container */}
        <div className="bg-white rounded-lg shadow-lg max-w-screen-lg w-full p-6 overflow-y-auto"
        onClick={(e) => e.stopPropagation()}>
            {/* Botón Cerrar */}
            <button
                onClick={onClose}
                className="absolute top-4 right-4 bg-gray-100 hover:bg-gray-400 text-gray-800 rounded-full w-10 h-10 flex items-center justify-center transition-colors duration-200"
                aria-label="Cerrar"
                title="Cerrar"
            >
                <span className="text-xl"><IoExitOutline className='flex w-6 h-6'/></span> {/* Icono X */}
            </button>

            {/* Header */}
            <div className="py-9 bg-center bg-black-nav rounded-xl  flex flex-col sm:flex-row justify-between items-center">
                <div className="flex flex-col px-8 sm:flex-row items-center">
                    <div className="text-gray-100 font-title text-center sm:text-left">
                        {company ? (
                            <>
                                <p><strong>Nombre:</strong> {company.name || 'No disponible'}</p>
                                <p><strong>Cédula / RIF:</strong> {company.id_card || 'No disponible'}</p>
                                <p><strong>Dirección:</strong> {company.address || 'No disponible'}</p>
                                <p><strong>Email:</strong> {company.email || 'No disponible'}</p>
                                <p><strong>Teléfono:</strong> {company.phone || 'No disponible'}</p>
                            </>
                            ) : (
                            <p>No se pudo cargar la información de la empresa.</p>
                        )}
                    </div>
                </div>
                <div className="font-knewave px-8 font-title text-5xl mt-5 sm:mt-0">Presupuesto</div>
            </div>
            {/* Contenido Principal */}
            <div className="flex flex-col sm:flex-row py-4 px-8">
                {/* Customer Form */}
                <div className="flex-1 text-gray-700">
                    <h3 className="text-lg font-semibold mb-2">Información del Cliente</h3>
                    <p><strong>Cédula / RIF:</strong> {customer?.id_card || 'No disponible'}</p>
                    <p><strong>Nombre:</strong> {customer?.name || 'No disponible'}</p>
                    <p><strong>Teléfono:</strong> {customer?.phone || 'No disponible'}</p>
                    <p><strong>Email:</strong> {customer?.email || 'No disponible'}</p>
                    <p><strong>Dirección:</strong> {customer?.address || 'No disponible'}</p>
                </div>

                {/* Budget Form */}
                <div className="flex flex-col lg:items-end text-gray-700">
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold mb-2">Detalles del Presupuesto</h3>
                        <p ><strong>Nº de Presupuesto:</strong> {budgetForm?.n_budget || 'No disponible'}</p>
                        <p ><strong>Fecha de Creación:</strong> {formatDate(budgetForm?.dateCreation)}</p>
                        <p><strong>Fecha de Vencimiento:</strong> {formatDate(budgetForm?.dateExpiration)}</p>
                        <p><strong>Moneda:</strong> {budgetForm?.currency === 'Bs' ? 'Bolívar (Bs)' : 'USD ($)'}</p>
                        {budgetForm?.currency === 'Bs' && (
                        <p>
                            <strong>Tasa de Cambio:</strong> {budgetForm.exchangeRate?.toFixed(2) || 'No disponible'}
                        </p>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-5 rounded-lg w-full bg-black-nav px-8 py-3">
                    <div className="font-bold text-start pl-3 col-span-2">Descripción</div>
                    <div className="font-bold text-end pr-6 col-span-1">Cantidad</div>
                    <div className="font-bold text-end pr-4 col-span-1">Precio Unitario</div>
                    <div className="font-bold text-end pr-3 col-span-1">Precio Total</div>
            </div>

            {/* Filas de Servicios */}
            {selectedServices.map((service) => (
            <div key={service._id} className="grid grid-cols-5 items-center text-gray-700 py-2 px-8">
                <div className="text-start pl-3 col-span-2">{service.name}</div>
                <div className="text-end pr-6 col-span-1">
                <NumericFormat 
                    value={service.serviceQuantity} 
                    displayType="text" 
                    thousandSeparator="." 
                    decimalSeparator="," 
                />
                </div>
                <div className="text-end pr-4 col-span-1">
                <NumericFormat 
                    value={service.totalPrice} 
                    displayType="text" 
                    thousandSeparator="." 
                    decimalSeparator="," 
                    decimalScale={2} 
                    fixedDecimalScale 
                />
                </div>
                <div className="text-end pr-3 col-span-1">
                <NumericFormat 
                    value={service.totalPrice * service.serviceQuantity} 
                    displayType="text" 
                    thousandSeparator="." 
                    decimalSeparator="," 
                    decimalScale={2} 
                    fixedDecimalScale 
                />
                </div>
            </div>
            ))}


            {/* Summary Section */}
            <div className="flex flex-col items-end w-full px-8 mt-6 text-gray-700">
                {/* Subtotal */}
                <div className="flex justify-between w-full max-w-md py-1 pr-3">
                    <span className="font-bold">Subtotal:</span>
                    <span>
                    <NumericFormat 
                        value={subtotal} 
                        displayType="text" 
                        thousandSeparator="." 
                        decimalSeparator="," 
                        decimalScale={2} 
                        fixedDecimalScale 
                    />
                    </span>
                </div>

                {/* IVA */}
                <div className="flex justify-between w-full max-w-md py-1 pr-3">
                    <span className="font-bold">IVA ({ivaPercentage}%):</span>
                    <span>
                    <NumericFormat 
                        value={calculatedIva} 
                        displayType="text" 
                        thousandSeparator="." 
                        decimalSeparator="," 
                        decimalScale={2} 
                        fixedDecimalScale 
                    />
                    </span>
                </div>

                {/* IGTF (si la moneda es USD) */}
                {budgetForm?.currency === '$' && (
                    <div className="flex justify-between w-full max-w-md py-1 pr-3">
                    <span className="font-bold">IGTF ({igtfPercentage}%):</span>
                    <span>
                        <NumericFormat 
                        value={calculatedIgtf} 
                        displayType="text" 
                        thousandSeparator="." 
                        decimalSeparator="," 
                        decimalScale={2} 
                        fixedDecimalScale 
                        />
                    </span>
                    </div>
                )}

                {/* Total */}
                <div className="flex justify-between w-full max-w-md py-2 mt-2 pr-2 border-t border-gray-300">
                    <span className="font-bold text-lg">Total:</span>
                    <span className="font-bold text-lg">
                    <NumericFormat 
                        value={budgetForm?.currency === '$' ? totalWithIgft : total} 
                        displayType="text" 
                        thousandSeparator="." 
                        decimalSeparator="," 
                        decimalScale={2} 
                        fixedDecimalScale 
                    />
                    </span>
                </div>
            </div>
        </div>
    </div>
  );
};
