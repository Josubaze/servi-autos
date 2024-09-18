'use client'

import { FaFileCircleExclamation } from "react-icons/fa6";
import { FaFileCircleCheck } from "react-icons/fa6";
import { BudgetOptions } from "./BudgetOptions";
import { BudgetHeader } from "./BudgetHeader";
import { BudgetCustomerForm } from "./BudgetCustomerForm";
import { BudgetForm } from "./BudgetForm";
import { BudgetTable } from "./BudgetTable";


export const Budget = () => {
    return (

        <div className='relative flex flex-col py-6 px-0 sm:px-12'>   
            {/* opciones */}
            <BudgetOptions/>


            {/* Header del presupuesto */}    
            <BudgetHeader/>

            {/* Segmento de formularios */}
            <div className="flex flex-col sm:flex-row py-3 px-8">
                {/* Formulario de cliente */}
                <div className="flex-1">
                    <BudgetCustomerForm/>
                </div>

                {/* Formulario de presupuesto */}
                <div className="flex-1">
                    <BudgetForm/>
                </div>
            </div>

            {/* Tabla de presupuesto */}
            <BudgetTable/>

            {/* GUARDADO*/}
            <div className="grid grid-cols-4 rounded-lg w-full bg-black-nav py-3 mt-6 gap-x-6">
                <div className="content-center">
                        <div className="font-bold text-right">
                            Guardar como:
                        </div>
                    </div>

                    <div>
                        <button className="text-base px-2 w-full border-solid border-2 border-orange-600  h-8 rounded-xl bg-transparent transition ease-in-out delay-150 hover:scale-105 hover:bg-orange-600 duration-300">
                                <span className="flex items-center justify-center gap-x-2">
                                    Pediente
                                    <FaFileCircleExclamation className="h-5 w-5"/>
                                </span>
                        </button>
                    </div>

                    <div>
                        <button className="text-base px-2 w-full border-solid border-2 border-blue-600  h-8 rounded-xl bg-transparent transition ease-in-out delay-150 hover:scale-105 hover:bg-blue-600 duration-300">
                            <span className="flex items-center justify-center gap-x-2">
                                Aceptado
                                <FaFileCircleCheck  className="h-5 w-5"/>
                            </span>
                        </button>
                    </div>
            </div>

        </div>
    );
}
