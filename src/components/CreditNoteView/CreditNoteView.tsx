import React, { forwardRef } from 'react';
import { NumericFormat } from 'react-number-format';
import { IoExitOutline } from "react-icons/io5";
import { useCalendarDate } from 'src/hooks/useCalendarDate';
import { Tooltip } from '@nextui-org/react';

interface CreditNoteViewProps {
    onClose: () => void;
    company: Company | undefined;
    customer: Customer | undefined;
    form: FormCreditNote | null | undefined;
    selectedServices: Service[] | undefined;
    subtotal: number | undefined;
    ivaPercentage: number | undefined;
    igtfPercentage: number | undefined;
    calculatedIva: number | undefined;
    calculatedIgtf: number | undefined;
    total: number   | undefined;
    totalWithIgft: number | undefined;
    description: string | undefined;
}

export const CreditNoteView = forwardRef<HTMLDivElement, CreditNoteViewProps>((
    { 
    onClose,
    company,
    form,
    customer,
    selectedServices, 
    subtotal, 
    ivaPercentage, 
    igtfPercentage, 
    calculatedIva, 
    calculatedIgtf, 
    total, 
    totalWithIgft,
    description },
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
        <div className="bg-white rounded-lg shadow-lg max-w-screen-lg w-full p-6 max-h-screen overflow-y-auto"
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
            <div ref={ref} >
                {/* Header */}
                <div className="py-9 bg-center bg-black/85 rounded-xl  flex flex-col sm:flex-row justify-between items-center">
                    <div className="flex flex-col px-8 sm:flex-row items-center">
                        <div className="text-white font-title text-center sm:text-left">
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
                    <div className="font-knewave text-white px-8 font-title text-5xl mt-5 sm:mt-0">NOTA DE CRÉDITO</div>
                </div>

                {/* Contenido Principal */}
                <div className="flex flex-col sm:flex-row py-4 px-8">
                    {/* Customer Form */}
                    <div className="flex-1 text-black">
                        <h3 className="text-lg font-semibold mb-2">Información del Cliente</h3>
                        <p><strong>Cédula / RIF:</strong> {customer?.id_card || 'No disponible'}</p>
                        <p><strong>Nombre:</strong> {customer?.name || 'No disponible'}</p>
                        <p><strong>Teléfono:</strong> {customer?.phone || 'No disponible'}</p>
                        <p><strong>Email:</strong> {customer?.email || 'No disponible'}</p>
                        <p><strong>Dirección:</strong> {customer?.address || 'No disponible'}</p>
                    </div>

                    {/* Budget Form */}
                    <div className="flex flex-col lg:items-end text-black">
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold mb-2">Detalles de Nota de Crédito</h3>
                            <p ><strong>Nº de Nota de Crédito:</strong> {form?.num || 'No disponible'}</p>
                            <p ><strong>Nº de Factura Ref:</strong> {form?.numInvoice || 'No disponible'}</p>
                            <p ><strong>Fecha de Creación:</strong> {formatDate(form?.dateCreation)}</p>
                            <p><strong>Moneda:</strong> {form?.currency === 'Bs' ? 'Bolívar (Bs)' : 'USD ($)'}</p>
                            {form?.currency === 'Bs' && (
                            <p>
                                <strong>Tasa de Cambio:</strong> {form.exchangeRate?.toFixed(2) || 'No disponible'}
                            </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Columnas de Servicios */}
                <div className="grid grid-cols-5 text-white rounded-lg w-full bg-black/85 px-8 py-3">
                    <div className="font-bold text-start col-span-2 pl-2">Descripción</div>
                    <div className="font-bold text-end col-span-1">Cantidad</div>
                    <div className="font-bold text-end col-span-1">Precio Unitario</div>
                    <div className="font-bold text-end col-span-1 pr-2">Precio Total</div>
                </div>

                {/* Filas de Servicios */}
                <div className="space-y-6 px-4 py-2">
                {selectedServices?.map((service) => (
                    <div
                    key={service._id}
                    className="rounded-lg"
                    >
                    {/* Encabezado del Servicio */}
                    <div className="grid grid-cols-5 text-black rounded-t-lg bg-gray-200/65 px-6 py-3">
                        <div className="font-bold text-start col-span-2">{service.name}</div>
                        <div className="font-bold text-end col-span-1">
                        <NumericFormat
                            value={service.serviceQuantity}
                            displayType="text"
                            thousandSeparator="."
                            decimalSeparator=","
                        />
                        </div>
                        <div className="font-bold text-end col-span-1">
                        <NumericFormat
                            value={service.totalPrice}
                            displayType="text"
                            thousandSeparator="."
                            decimalSeparator=","
                            decimalScale={2}
                            fixedDecimalScale
                        />
                        </div>
                        <div className="font-bold text-end col-span-1">
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

                    {/* Tabla de Productos (Detalles del Servicio) */}
                    <div className="bg-gray-100/55 px-6 py-4 rounded-b-lg">
                        <div className="font-bold text-black mb-2">Detalles del Servicio</div>
                        {service.products && service.products.length > 0 ? (
                            <div className="space-y-2">
                                {/* Columnas de Productos */}
                                <div className="grid grid-cols-5 font-semibold text-black border-b pb-2">
                                    <div className="text-start col-span-1">Producto</div>
                                    <div className="text-end col-span-1">Categoría</div>
                                    <div className="text-end col-span-1">Cantidad</div>
                                    <div className="text-end col-span-1">Precio Unitario</div>
                                    <div className="text-end col-span-1">Precio Total</div>
                                </div>

                                {/* Filas de Productos */}
                                {service.products.map((product) => (
                                    <div
                                        key={product.product._id}
                                        className="grid grid-cols-5 items-center text-black py-1"
                                    >
                                        <div className="text-start col-span-1">{product.product.name}</div>
                                        <div className="text-end col-span-1">{product.product.category}</div>
                                        <div className="text-end col-span-1">
                                        <NumericFormat
                                            value={product.quantity}
                                            displayType="text"
                                            thousandSeparator="."
                                            decimalSeparator=","
                                        />
                                        </div>
                                        <div className="text-end col-span-1">
                                        <NumericFormat
                                            value={product.product.price}
                                            displayType="text"
                                            thousandSeparator="."
                                            decimalSeparator=","
                                            decimalScale={2}
                                            fixedDecimalScale
                                        />
                                        </div>
                                        <div className="text-end col-span-1">
                                        <NumericFormat
                                            value={product.product.price * product.quantity}
                                            displayType="text"
                                            thousandSeparator="."
                                            decimalSeparator=","
                                            decimalScale={2}
                                            fixedDecimalScale
                                        />
                                        </div>
                                    </div>
                                    ))}

                                    {/* Fila de Mano de Obra */}
                                    <div className="grid grid-cols-5 items-center text-black">
                                    <div className="text-start col-span-2">Mano de obra</div>
                                    <div className="text-end col-span-1">1</div>
                                    <div className="text-end col-span-1">
                                        <NumericFormat
                                        value={service.servicePrice}
                                        displayType="text"
                                        thousandSeparator="."
                                        decimalSeparator=","
                                        decimalScale={2}
                                        fixedDecimalScale
                                        />
                                    </div>
                                    <div className="text-end col-span-1">
                                        <NumericFormat
                                        value={service.servicePrice}
                                        displayType="text"
                                        thousandSeparator="."
                                        decimalSeparator=","
                                        decimalScale={2}
                                        fixedDecimalScale
                                        />
                                    </div>
                                </div>
                        </div>
                        ) : (
                        <div className="text-center py-2 text-gray-700">
                            No hay productos para este servicio.
                        </div>
                        )}
                    </div>
                    </div>
                ))}
                </div>

                {/* Contenedor Principal para Descripción y Totales */}
                <div className="flex flex-col md:flex-row w-full pl-4 pr-6 mt-6 gap-8 text-black text-justify">      
                    {/* Descripción de la Nota de Crédito (lado izquierdo) */}
                    <div className="w-full md:w-1/2 rounded-lg p-4 bg-gray-100/55">
                        <h3 className="text-lg font-bold mb-2 bg-">Descripción o Motivo:</h3>
                        <p className="text-black/80 text-justify text-sm">
                        {description || "No se ha proporcionado una descripción."}
                        </p>
                    </div>

                    {/* Resumen de Totales (lado derecho) */}
                    <div className="w-full md:w-1/2">
                        {/* Summary Section */}
                        <div className="flex flex-col items-end w-full text-black">
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
                        {form?.currency === '$' && (
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
                                value={form?.currency === '$' ? totalWithIgft : total} 
                                displayType="text" 
                                thousandSeparator="." 
                                decimalSeparator="," 
                                decimalScale={2} 
                                fixedDecimalScale 
                                prefix={form?.currency === 'Bs' ? 'Bs ' : '$ '}
                            />
                            </span>
                        </div>
                    </div>
                </div>
                </div>
            </div>
        </div>
    </div>
  );
});

// Agrega el displayName para evitar el error de ESLint
CreditNoteView.displayName = 'CreditNoteView';