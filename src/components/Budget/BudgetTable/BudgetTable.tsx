import { FaBoxes } from "react-icons/fa";
import { MdNoteAdd } from "react-icons/md";


export const BudgetTable = () => {
    return (
        <>
            {/* colmnas de tabla */}
            <div className="grid grid-cols-4 rounded-lg w-full bg-black-nav px-8 py-3">

                <div className="font-bold text-center">
                    Descripción
                </div>

                <div className="font-bold text-center">
                    Cantidad
                </div>

                <div className="font-bold text-center">
                    Precio Unitario
                </div>

                <div className="font-bold text-center">
                    Precio Total
                </div>
                </div>

            {/* datos de tabla */}
            <div className="grid grid-cols-4 rounded-lg w-full px-8 pt-4 gap-x-6">
                <div>
                    <input
                        type="text"
                        name="description"
                        id="description" 
                        className="text-base px-2 w-full border-solid border-2  h-8 rounded-xl text-right border-gray-500 bg-gray-800 focus:outline-none  focus:border-indigo-600
                    "/>
                </div>
                <div>
                <input 
                        type="number" 
                        name="quantity" 
                        id="quantity" 
                        className="text-base px-2 w-full border-solid border-2 h-8 rounded-xl text-right border-gray-500 bg-gray-800 focus:outline-none focus:border-indigo-600"
                    />
                </div>
                <div>
                    <input 
                        type="number"
                        name="unit_price" 
                        id="unit_price" 
                        className="text-base px-2 w-full border-solid border-2  h-8 rounded-xl text-right border-gray-500 bg-gray-800 focus:outline-none  focus:border-indigo-600
                    "/>
                </div>
                <div>
                    <input 
                        type="number"
                        name="total_price"
                        id="total_price" 
                        className="text-base px-2 w-full border-solid border-2  h-8 rounded-xl text-right border-gray-500 bg-gray-800 focus:outline-none  focus:border-indigo-600
                    "/>
                </div>
            </div>

            {/* opciones de agregar linea de factura*/}
            <div className="grid grid-cols-4 rounded-lg w-full px-8 pt-4 gap-x-6">
                <div className="col-start-3">
                    <button className="text-base px-2 w-full border-solid border-2  h-8 rounded-xl  border-green-600 bg-transparent transition ease-in-out delay-150 hover:scale-105 hover:bg-green-600 duration-300">
                        <span className="flex items-center justify-center gap-x-2">
                            Crear Item
                            <MdNoteAdd className="h-5 w-5" />
                        </span>
                    </button>
                </div>

                <div>
                    <button className="text-base px-2 w-full border-solid border-2  h-8 rounded-xl  border-green-600 bg-transparent transition ease-in-out delay-150 hover:scale-105 hover:bg-green-600 duration-300">
                        <span className="flex items-center justify-center gap-x-2">
                            Cargar 
                            <FaBoxes className="h-5 w-5" />
                        </span>
                    </button>
                </div>
            </div>


            {/* IVA*/}
            <div className="grid grid-cols-4 rounded-lg w-full px-8 pt-4 gap-x-6">
                <div className="col-start-3 font-bold content-center text-right">
                    <label htmlFor="tax" className="">I.V.A. % :</label>
                </div>

                <div>
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
            <div className="grid grid-cols-4 rounded-lg w-full px-8 pt-4 gap-x-6">
                <div className="col-start-3 font-bold content-center text-right">
                    <label htmlFor="subtotal" className="">SubTotal :</label>
                </div>

                <div>
                    <input 
                            type="number"
                            name="subtotal"
                            id="subtotal" 
                            className="text-base px-2 w-full border-solid border-2  h-8 rounded-xl text-right border-gray-500 bg-gray-800 focus:outline-none  focus:border-indigo-600 holder
                        "/>
                </div>
            </div>

            {/* TOTAL */}
            <div className="grid grid-cols-4 w-full mt-4">
                <div className="col-start-3 col-span-2 py-3 pr-8 gap-x-6 bg-black-nav rounded-lg grid grid-cols-2">
                    <div className="content-center font-bold text-right">
                        Total :
                    </div>

                    <div className="content-center font-bold text-right">
                        <label className="">0.00 $</label>            
                    </div>
                </div>
            </div>
            
        </>
    );
}

