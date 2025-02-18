import { FaFilePowerpoint, FaUsers } from "react-icons/fa6";
import { FaBoxes, FaFileInvoice } from "react-icons/fa";
import { BiSolidPurchaseTag } from "react-icons/bi";
import { IoDocumentText } from "react-icons/io5";
import { MdStore } from "react-icons/md";

export const Services = () => {
    return (
        <section id="services" className="py-16 bg-black-nav">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold border-b-4 border-gray-600 inline-block pb-2">
                        Servicios
                    </h2>
                    <p className="mt-4 text-gray-300">
                        Soluciones integrales para la automatización del taller.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Tarjeta Servicio 1 */}
                    <div className="bg-[#202020] p-6 rounded-lg shadow-lg flex gap-4">
                        <div className="flex items-center justify-center">
                            <div className="h-16 w-16 flex items-center justify-center rounded-full bg-gray-200/90">
                                <FaFileInvoice className="h-12 w-12 text-black-nav" />
                            </div>
                        </div>
                        <div className="flex flex-col justify-center">
                            <h3 className="text-xl font-bold mb-2">Automatización de Facturación</h3>
                            <p className="text-gray-300">
                                Optimiza la generación y control de facturas con un sistema eficiente y preciso.
                            </p>
                        </div>
                    </div>
                    {/* Tarjeta Servicio 2 */}
                    <div className="bg-[#202020] p-6 rounded-lg shadow-lg flex gap-4">
                        <div className="flex items-center justify-center">
                            <div className="h-16 w-16 flex items-center justify-center rounded-full bg-gray-200/90">
                                <FaFilePowerpoint className="h-12 w-12 text-black-nav" />
                            </div>
                        </div>
                        <div className="flex flex-col justify-center">
                            <h3 className="text-xl font-bold mb-2">Generación de Presupuestos</h3>
                            <p className="text-gray-300">
                                Crea presupuestos detallados y personalizados de manera ágil y sencilla.
                            </p>
                        </div>
                    </div>
                    {/* Tarjeta Servicio 3 */}
                    <div className="bg-[#202020] p-6 rounded-lg shadow-lg flex gap-4">
                        <div className="flex items-center justify-center">
                            <div className="h-16 w-16 flex items-center justify-center rounded-full bg-gray-200/90">
                                <FaBoxes className="h-12 w-12 text-black-nav" />
                            </div>
                        </div>
                        <div className="flex flex-col justify-center">
                            <h3 className="text-xl font-bold mb-2">Gestión Inteligente de Almacén</h3>
                            <p className="text-gray-300">
                                Controla y administra el stock de repuestos y piezas con total precisión.
                            </p>
                        </div>
                    </div>
                    {/* Tarjeta Servicio 4 */}
                    <div className="bg-[#202020] p-6 rounded-lg shadow-lg flex gap-4">
                        <div className="flex items-center justify-center">
                            <div className="h-16 w-16 flex items-center justify-center rounded-full bg-gray-200/90">
                                <FaUsers className="h-12 w-12 text-black-nav" />
                            </div>
                        </div>
                        <div className="flex flex-col justify-center">
                            <h3 className="text-xl font-bold mb-2">Optimización del Servicio al Cliente</h3>
                            <p className="text-gray-300">
                                Mejora la comunicación con los clientes y optimiza la atención postventa.
                            </p>
                        </div>
                    </div>
                    {/* Tarjeta Servicio 5 */}
                    <div className="bg-[#202020] p-6 rounded-lg shadow-lg flex gap-4">
                        <div className="flex items-center justify-center">
                            <div className="h-16 w-16 flex items-center justify-center rounded-full bg-gray-200/90">
                                <BiSolidPurchaseTag className="h-12 w-12 text-black-nav" />
                            </div>
                        </div>
                        <div className="flex flex-col justify-center">
                            <h3 className="text-xl font-bold mb-2">Administración de Compras</h3>
                            <p className="text-gray-300">
                                Simplifica la solicitud y gestión de pedidos con proveedores de forma eficiente.
                            </p>
                        </div>
                    </div>
                    {/* Tarjeta Servicio 6 */}
                    <div className="bg-[#202020] p-6 rounded-lg shadow-lg flex gap-4">
                        <div className="flex items-center justify-center">
                            <div className="h-16 w-16 flex items-center justify-center rounded-full bg-gray-200/90">
                                <IoDocumentText className="h-12 w-12 text-black-nav" />
                            </div>
                        </div>
                        <div className="flex flex-col justify-center">
                            <h3 className="text-xl font-bold mb-2">Generación Automatizada de Informes</h3>
                            <p className="text-gray-300">
                                Obtén informes detallados de los servicios a realizar de cada vehículo de manera rápida y precisa.
                            </p>
                        </div>
                    </div>

                    {/* Tarjeta Servicio 7 */}
                    <div className="bg-[#202020] p-6 rounded-lg shadow-lg flex gap-4 col-span-1 lg:col-span-3">
                        <div className="flex items-center justify-center">
                            <div className="h-16 w-16 flex items-center justify-center rounded-full bg-gray-200/90">
                                <MdStore className="h-12 w-12 text-black-nav" />
                            </div>
                        </div>
                        <div className="flex flex-col justify-center">
                            <h3 className="text-xl font-bold mb-2">Consultar Precios en MercadoLibre</h3>
                            <p className="text-gray-300">
                                Consulta los precios actuales de repuestos en MercadoLibre en tiempo real, para ofrecer a tus clientes las mejores opciones y precios disponibles.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
