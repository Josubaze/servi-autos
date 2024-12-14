import React, { forwardRef, useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { NumericFormat } from 'react-number-format';
import { toast } from 'react-toastify';

interface BudgetPDFProps {
    company: Company | undefined;
    customer: Customer | undefined;
    budgetForm: BudgetForm | undefined;
    selectedServices: Service[];
    subtotal: number;
    ivaPercentage: number;
    igtfPercentage: number;
    calculatedIva: number;
    calculatedIgtf: number;
    total: number;
    totalWithIgft: number;
}

export const BudgetPDF = forwardRef<HTMLDivElement, BudgetPDFProps>((
    { 
    company,
    budgetForm,
    customer,
    selectedServices, 
    subtotal, 
    ivaPercentage, 
    igtfPercentage, 
    calculatedIva, 
    calculatedIgtf, 
    total, 
    totalWithIgft },
    ref
    ) => {

    const formatDate = (date: any) => {
        return date ? dayjs(date).format('DD/MM/YYYY') : 'No disponible';
    };

  return (
    <>
      {/* Modal Container */}
        <div className="bg-white rounded-lg shadow-lg max-w-screen-lg w-full min-h-screen overflow-y-auto" ref={ref}>
            {/* Header */}
            <div className="py-9 bg-center bg-black-nav rounded-xl  flex flex-col sm:flex-row justify-between items-center">
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
                <div className="font-knewave text-white px-8 font-title text-5xl mt-5 sm:mt-0">Presupuesto</div>
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

            {/* Columnas de Servicios */}
            <div className="grid grid-cols-5 text-white rounded-lg w-full bg-black-nav px-8 py-3">
                <div className="font-bold text-start col-span-2 pl-2">Descripción</div>
                <div className="font-bold text-end col-span-1">Cantidad</div>
                <div className="font-bold text-end col-span-1">Precio Unitario</div>
                <div className="font-bold text-end col-span-1 pr-2">Precio Total</div>
            </div>

            {/* Filas de Servicios */}
            <div className="space-y-6 px-4 py-2">
            {selectedServices.map((service) => (
                <div
                key={service._id}
                className="rounded-lg"
                >
                {/* Encabezado del Servicio */}
                <div className="grid grid-cols-5 text-gray-700 rounded-t-lg bg-gray-200/60 px-6 py-3">
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
                <div className="bg-gray-50 px-6 py-4 rounded-b-lg">
                    <div className="font-bold text-gray-700 mb-2">Detalles del Servicio</div>
                    {service.products && service.products.length > 0 ? (
                    <div className="space-y-2">
                        {/* Columnas de Productos */}
                        <div className="grid grid-cols-5 font-semibold text-gray-600 border-b pb-2">
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
                            className="grid grid-cols-5 items-center text-gray-700 py-1"
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
                        <div className="grid grid-cols-5 items-center text-gray-700">
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
                    <div className="text-center py-2 text-gray-500">
                        No hay productos para este servicio.
                    </div>
                    )}
                </div>
                </div>
            ))}
            </div>



            {/* Contenedor Principal para Resumen y Condiciones */}
            <div className="flex flex-col md:flex-row w-full pl-4 pr-6 mt-6 gap-8 text-gray-700">
            
                {/* Condiciones de la Oferta (lado izquierdo) */}
                <div className="w-full md:w-1/2 rounded-lg p-4 bg-gray-50">
                    <h3 className="text-lg font-bold mb-2">Condiciones de la Oferta:</h3>
                    <p className="mb-1">
                        <span className="font-semibold">Moneda:</span> El monto está establecido en {budgetForm?.currency === '$' ? 'dólares' : 'Bolívares'}.
                    </p>
                    {budgetForm?.currency !== '$' && (
                        <p className="mb-1">
                        <span className="font-semibold">Pagadero a tasa de BCV:</span> A la fecha de su cancelación.
                        </p>
                    )}
                    <p className="mb-1">
                        <span className="font-semibold">Tiempo de entrega:</span> Inmediata.
                    </p>
                    <p className="mb-0">
                        <span className="font-semibold">Nota:</span> Precio sujeto a cambio sin previo aviso.
                    </p>
                </div>


            {/* Resumen de Totales (lado derecho) */}
            <div className="w-full md:w-1/2">
                {/* Summary Section */}
                <div className="flex flex-col items-end w-full text-gray-700">
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
        </div>
    </>
  );
});
