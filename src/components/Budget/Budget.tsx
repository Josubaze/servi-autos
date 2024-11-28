'use client'

import { LuSaveAll } from "react-icons/lu";
import { motion } from "framer-motion";
import { BudgetOptions } from "./BudgetOptions";
import { BudgetHeader } from "./BudgetHeader";
import { BudgetCustomerForm } from "./BudgetCustomerForm";
import { BudgetForm } from "./BudgetForm";
import { BudgetTable } from "./BudgetTable";
import { useRef, useState } from 'react';
import { BudgetSummary } from "./BudgetSummary";
import { useBudgetSubtotal } from "src/hooks/Budget/useBudgetSubtotal";
import Tooltip from "@mui/material/Tooltip";
import { FaArrowRightLong } from "react-icons/fa6";
import { RiDraftLine } from "react-icons/ri";

// Define la interfaz que contiene la función submitForm
interface BudgetFormHandle {
    submitForm: () => any;
}

export const Budget = () => {
    const formCustomerRef = useRef<BudgetFormHandle | null>(null);
    const formDateRef = useRef<BudgetFormHandle | null>(null);
    const [selectedServices, setSelectedServices] = useState<Service[]>([]);
    const subtotal = useBudgetSubtotal(selectedServices);
    const [currency, setCurrency] = useState<string>('$');
    const [exchangeRate, setExchangeRate] = useState<number>(1);

    const handleSaveAsPending = async () => {
        if (formCustomerRef.current) {
            const customerData = await formCustomerRef.current.submitForm(); 
            console.log("Datos del formulario:", customerData); // Ahora obtenemos el valor resuelto
        }
        if (formDateRef.current) {
            const dateData = await formDateRef.current.submitForm(); 
            console.log("Datos del formulario:", dateData); // Ahora obtenemos el valor resuelto
        }
        console.log('Opcion del select:', currency);
        console.log('Opcion del textExchange:', exchangeRate);
        console.log(selectedServices);
        
    };

    const handleSaveAsAccepted = () => {
        
    };
    return (
        <div className='relative flex flex-col py-6 px-0 sm:px-12'>   
            {/* opciones */}
            <BudgetOptions/>

            {/* Header del presupuesto */}    
            <BudgetHeader/>

            {/* Segmento de formularios */}
            <div className="flex flex-col sm:flex-row py-4 px-8">
                {/* Formulario de cliente */}
                <div className="flex-1 sm:border-r sm:border-white/30">
                    {/* Pasamos la función al componente hijo */}
                    <BudgetCustomerForm ref={formCustomerRef}/>
                </div>

                {/* Formulario de presupuesto */}
                <div className="flex-1">
                    <BudgetForm 
                        ref={formDateRef}
                        setCurrency={setCurrency}
                        currency={currency}
                        exchangeRate={exchangeRate}
                        setExchangeRate={setExchangeRate}
                    />
                </div>
            </div>

            {/* Tabla de presupuesto */}
            <BudgetTable 
                selectedServices={selectedServices} 
                setSelectedServices={setSelectedServices} 
                currency={currency}
                exchangeRate={exchangeRate}
            />

            {/* calculos del presupuesto */}
            <BudgetSummary currency={currency} subtotal={subtotal}></BudgetSummary>
            
            {/* GUARDADO */}
            <div className="grid grid-cols-4 rounded-lg w-full py-3 mt-6">
                <div className="col-start-3 flex justify-end items-center">
                        <div>
                            <motion.div
                                animate={{
                                x: ["0px", "20px", "0px"], 
                                }}
                                transition={{
                                duration: 1, 
                                repeat: 5,
                                ease: "easeInOut",
                                }}
                                className="flex gap-x-2 justify-center items-center"
                            >
                                <span className="font-knewave text-4xl">GUARDAR</span>
                                <FaArrowRightLong className="text-3xl" />
                            </motion.div> 
                        </div>
                    </div>         

                    <div className="flex items-center justify-center gap-x-12 ">                  
                    <Tooltip title="Borrador" arrow>
                        <button className="w-16 h-16 rounded-full bg-transparent border-2 border-indigo-600 flex justify-center items-center text-white transition-all ease-in-out delay-150 hover:scale-110 hover:bg-gray-600 hover:border-gray-600 hover:text-white duration-300"
                        onClick={handleSaveAsPending}>
                            <RiDraftLine className="w-16 h-16 p-2 transition-all ease-in-out delay-150 hover:scale-110" />
                        </button>
                    </Tooltip>
                    <Tooltip title="Guardar" arrow>
                        <button className="w-16 h-16 rounded-full bg-transparent border-2 border-indigo-600 flex justify-center items-center text-white transition-all ease-in-out delay-150 hover:scale-110 hover:bg-green-600 hover:border-green-600 hover:text-white duration-300"
                        onClick={handleSaveAsPending}>
                            <LuSaveAll className="w-16 h-16 p-2 transition-all ease-in-out delay-150 hover:scale-110" />
                        </button>
                    </Tooltip>
                </div>        
            </div>

                
        </div>
    );
}
