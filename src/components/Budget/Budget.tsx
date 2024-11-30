'use client'

import { BudgetOptions } from "./BudgetOptions";
import { BudgetHeader } from "./BudgetHeader";
import { BudgetCustomerForm } from "./BudgetCustomerForm";
import { BudgetForm } from "./BudgetForm";
import { BudgetTable } from "./BudgetTable";
import { useRef, useState } from 'react';
import { BudgetSummary } from "./BudgetSummary";
import { useBudgetSubtotal } from "src/hooks/Budget/useBudgetSubtotal";
import { BudgetActions } from "./BudgetActions";
import { useGetCompanyQuery } from "src/redux/services/company.Api";
import { useCreateBudgetMutation } from "src/redux/services/budgets.Api";
import dayjs from "dayjs";
import { toast } from "react-toastify";

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
    const [description, setDescription] = useState<string>("");
    const { data: company, isLoading, isError } = useGetCompanyQuery();
    const [createBudget, { isError: isErrorBudget }] = useCreateBudgetMutation();

    const handleSave = async (action: "draft" | "save") => {
        // Obtener datos del formulario de cliente
        const customerData = formCustomerRef.current
            ? await formCustomerRef.current.submitForm()
            : null;
    
        // Obtener datos del formulario de presupuesto
        const dateData = formDateRef.current
            ? await formDateRef.current.submitForm()
            : null;
    
        // Verificar que exista información en company
        if (!company) {
            console.error("Faltan datos de la empresa");
            return;
        }
    
        // Verificar que los datos de cliente y fecha estén presentes
        if (!customerData || !dateData) {
            console.error("Faltan datos requeridos");
            return;
        }
    
        // Construir el objeto de presupuesto
        const budget: Omit<Budget, "_id"> = {
            n_budget: dateData.n_budget,
            dateCreation: dayjs(dateData.dateCreation).toDate(),
            dateExpiration: dayjs(dateData.dateExpiration).toDate(),
            currency: dateData.currency,
            exchangeRate: dateData.exchangeRate,
            company: {
                _id: company._id,
                id_card: company.id_card,
                name: company.name,
                address: company.address,
                email: company.email,
                phone: company.phone,
            },
            customer: {
                _id: customerData._id,
                id_card: customerData.id_card,
                name: customerData.name,
                email: customerData.email,
                phone: customerData.phone,
                address: customerData.address,
            },
            services: selectedServices.map(service => ({
                _id: service._id,
                name: service.name,
                serviceQuantity: service.serviceQuantity,
                servicePrice: service.servicePrice,
                products: service.products.map(product => ({
                    product: {
                        _id: product.product._id,
                        name: product.product.name,
                        category: product.product.category,
                        price: product.product.price,
                    },
                    quantity: product.quantity,
                })),
                totalPrice: service.totalPrice,
            })),
            description,
            state: action,
        };
    
        // Llamar al endpoint de RTK Query con el tipo adecuado
        try {
            // Aquí pasamos el objeto `budget` que corresponde con el tipo Omit<Budget, '_id'>
            await createBudget(budget).unwrap();
            toast.success('Presupuesto Creado Exitosamente!');
        } catch (error) {
            toast.error('Ha ocurrido un error al intentar crear!');
        }
    };
    
    
    
    return (
        <div className='relative flex flex-col py-6 px-0 sm:px-12'>   
            {/* opciones */}
            <BudgetOptions/>

            {/* Header del presupuesto */}    
            <BudgetHeader
                company={company || null}
                isError={isError}
                isLoading={isLoading}
            />

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
            <BudgetActions
                description={description}
                setDescription={setDescription}
                handleSave={handleSave}
            />
            
        </div>
    );
}
