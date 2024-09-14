'use client'
import { FaBoxes } from "react-icons/fa";
import { MdNoteAdd } from "react-icons/md";
import { IoPersonAdd } from "react-icons/io5";

export const Budget = () => {
    return (
        <div className='relative flex flex-col py-6 px-0 sm:px-12'>   
            {/* Background de presupuesto */}    
            <div className="py-9 bg-center bg-black-nav rounded-xl flex flex-col sm:flex-row justify-between items-center">
                <div className="flex flex-col px-8 sm:flex-row items-center">
                    <div className="text-gray-100 font-title text-center sm:text-left">
                        <p className="font-bold mb-2">Nombre de la empresa</p>
                        <p className="text-sm font-medium">Por favor, añada los datos de la empresa</p>
                        <p className="text-sm font-medium">dirección de la empresa</p>
                        <p className="text-sm font-medium">Empresa@email.com</p>
                    </div>
                </div>

                <div className="text-white px-8 font-title font-bold text-5xl mt-5 sm:mt-0">Presupuesto</div>
            </div>




            {/* Segmento de formularios */}
            <div className="flex flex-col sm:flex-row pt-3 px-8">
            {/* Formulario de cliente */}
            <div className="flex-1">
                <div className="flex items-center">
                <p className="font-title font-bold">Presupuestar a</p>
                <div className="relative ml-3">
                    <button
                    type="button"
                    className="rounded-xl text-white flex items-center justify-center text-sm h-8 px-2 border-2 border-green-600 transition ease-in-out delay-150 hover:scale-110 hover:bg-green-600 duration-300"
                    >
                    <span className="flex items-center justify-center gap-x-2">
                        Cargar
                        <IoPersonAdd className="h-4 w-4"/>
                    </span>
                   
                    </button>
                </div>
                </div>

                {/* Ajuste de inputs */}
                <div className="flex flex-wrap gap-y-2 pt-4 w-full">
                <div className="w-full">
                    <input
                    placeholder="Nombre del cliente"
                    className="w-1/2 px-2 block border-solid border-2 border-gray-500 rounded-xl bg-gray-800 focus:outline-none focus:border-indigo-600 h-8"
                    />
                </div>

                <div className="w-full">
                    <input
                    placeholder="Dirección del cliente"
                    className="w-3/4 px-2 block border-solid border-2 border-gray-500 rounded-xl bg-gray-800 focus:outline-none focus:border-indigo-600 h-8"
                    />
                </div>

                <div className="w-full">
                    <input
                    placeholder="Móvil del cliente"
                    className="w-1/2 px-2 block border-solid border-2 border-gray-500 rounded-xl bg-gray-800 focus:outline-none focus:border-indigo-600 h-8"
                    />
                </div>

                <div className="w-full">
                    <input
                    placeholder="Correo del cliente"
                    className="w-3/4 px-2 block border-solid border-2 border-gray-500 rounded-xl bg-gray-800 focus:outline-none focus:border-indigo-600 h-8"
                    />
                </div>
                </div>
            </div>




            {/* Formulario de factura */}
            <div className="flex-1">
                <div className="flex flex-col gap-y-2 my-12 mx-4">
                    <div className="flex flex-row justify-between items-center">
                        <div className="font-title font-bold flex-1">Presupuesto</div>
                        <div className="flex-1 text-right">
                            <input
                            placeholder="Nº de Presupuesto"
                            className="px-2 w-full border-solid border-2 rounded-xl bg-indigo-950 focus:outline-none border-indigo-600 focus:border-indigo-300 h-8 text-right"
                            />
                        </div>
                    </div>

                    <div className="flex flex-row justify-between items-center">
                    <div className="font-title font-bold flex-1">Fecha de Creación</div>
                        <div className="flex-1 text-right">
                            <input
                                placeholder="12/09/2024"
                                className="px-2 w-3/4 border-solid border-2 rounded-xl bg-indigo-950 focus:outline-none border-indigo-600 focus:border-indigo-300 h-8 text-right"
                            />
                        </div>
                    </div>

                    <div className="flex flex-row justify-between items-center">
                    <div className="font-title font-bold flex-1">Fecha de Vencimiento</div>
                        <div className="font-title flex-1 text-right">
                            <input
                                placeholder="30/09/2024"
                                className="px-2 w-full border-solid border-2 rounded-xl bg-indigo-950 focus:outline-none border-indigo-600 focus:border-indigo-300 h-8 text-right"
                            />
                        </div>
                    </div>

                    <div className="flex flex-row justify-between items-center">
                    <div className="font-title font-bold flex-1">Cambiar Moneda</div>
                        <div className="font-title flex-1 text-right">
                            <input
                                placeholder="$"
                                className="px-2 w-3/4 border-solid border-2 rounded-xl bg-indigo-950 focus:outline-none border-indigo-600 focus:border-indigo-300 h-8 text-right"
                            />
                        </div>
                    </div>
                </div>
            </div>
            {/* termina segmento formulario */}
            </div>


             {/* segmento service & products */}
            <div className="grid grid-cols-4 rounded-lg w-full bg-black-nav px-8 py-3">

                <div className="font-bold text-right pr-10">
                    Descripción
                </div>

                <div className="font-bold text-right pr-10">
                    Cantidad
                </div>

                <div className="font-bold text-right pr-10">
                    Precio Unitario
                </div>

                <div className="font-bold text-right pr-10">
                    Precio Total
                </div>
            </div>

            {/* tabla de presupuesto */}
            <div className="grid grid-cols-4 rounded-lg w-full px-8 pt-4">
                <div className="pr-10">
                    <input
                        type="text"
                        name="description"
                        id="description" 
                        className="text-base px-2 w-full border-solid border-2  h-8 rounded-xl text-right border-gray-500 bg-gray-800 focus:outline-none  focus:border-indigo-600
                    "/>
                </div>
                <div className="pr-10">
                <input 
                        type="number" 
                        name="quantity" 
                        id="quantity" 
                        className="text-base px-2 mr-2 w-full border-solid border-2 h-8 rounded-xl text-right border-gray-500 bg-gray-800 focus:outline-none focus:border-indigo-600 no-arrows"
                    />
                </div>
                <div className="pr-10">
                    <input 
                        type="number"
                        name="unit_price" 
                        id="unit_price" 
                        className="text-base px-2 w-full border-solid border-2  h-8 rounded-xl text-right border-gray-500 bg-gray-800 focus:outline-none  focus:border-indigo-600
                    "/>
                </div>
                <div className="pr-10">
                    <input 
                        type="number"
                        name="total_price"
                        id="total_price" 
                        className="text-base px-2 w-full border-solid border-2  h-8 rounded-xl text-right border-gray-500 bg-gray-800 focus:outline-none  focus:border-indigo-600
                    "/>
                </div>
            </div>

            {/* botones de agregar */}
            <div className="grid grid-cols-4 rounded-lg w-full px-8 pt-4">
                <div className="col-start-3 pr-10">
                    <button className="text-base px-2 w-full border-solid border-2  h-8 rounded-xl  border-green-600 bg-transparent transition ease-in-out delay-150 hover:scale-105 hover:bg-green-600 duration-300">
                    <span className="flex items-center justify-center gap-x-2">
                            Crear Item
                            <MdNoteAdd className="h-4 w-4" />
                        </span>
                    </button>
                </div>

                <div className="pr-10">
                    <button className="text-base px-2 w-full border-solid border-2  h-8 rounded-xl  border-green-600 bg-transparent transition ease-in-out delay-150 hover:scale-105 hover:bg-green-600 duration-300">
                        <span className="flex items-center justify-center gap-x-2">
                            Cargar 
                            <FaBoxes className="h-4 w-4" />
                        </span>
                    </button>
                </div>
            </div>


            {/* IVA*/}
            <div className="grid grid-cols-4 rounded-lg w-full px-8 pt-4">
                <div className="col-start-3 pr-10 font-bold content-center text-right">
                    <label htmlFor="tax" className="">I.V.A. % :</label>
                </div>

                <div className="pr-10">
                    <input 
                            type="number"
                            name="tax"
                            id="tax" 
                            placeholder="16"
                            className="text-base px-2 w-full border-solid border-2  h-8 rounded-xl text-right border-gray-500 bg-gray-800 focus:outline-none  focus:border-indigo-600 holder
                        "/>
                </div>
            </div>

            {/* SUBTOTAL*/}
            <div className="grid grid-cols-4 rounded-lg w-full px-8 pt-4">
                <div className="col-start-3 pr-10 font-bold content-center text-right">
                    <label htmlFor="subtotal" className="">SubTotal :</label>
                </div>

                <div className="pr-10">
                    <input 
                            type="number"
                            name="subtotal"
                            id="subtotal" 
                            className="text-base px-2 w-full border-solid border-2  h-8 rounded-xl text-right border-gray-500 bg-gray-800 focus:outline-none  focus:border-indigo-600 holder
                        "/>
                </div>
            </div>

            {/* TOTAL*/}
            <div className="grid grid-cols-4 rounded-lg w-full bg-black-nav px-8 py-3 mt-4">
                <div className="col-start-3 pr-10 content-center font-bold text-right">
                    Total :
                </div>

                <div className="pr-10 content-center font-bold text-right">
                    <label className="">0.00 $</label>            
                </div>
            </div>

        </div>
    );
}
