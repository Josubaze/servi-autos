'use client';

import { BudgetOptions } from "./BudgetOptions";
import { BudgetHeader } from "./BudgetHeader";
import { BudgetCustomerForm } from "./BudgetCustomerForm";
import { BudgetForm } from "./BudgetForm";
import { BudgetTable } from "./BudgetTable";
import { BudgetSummary } from "./BudgetSummary";
import { BudgetActions } from "./BudgetActions";
import { Loading } from "../Common/Loading";
import { useBudgetFecth } from "src/hooks/Budget/useBudgetFetch";
import { useEffect } from "react";

    interface BudgetProps {
        mode?: "create" | "edit";
        budgetData?: Budget | null; // Opcional y puede ser null
    }

    export const Budget: React.FC<BudgetProps> = ({ mode = "create", budgetData= null }) => {
    const {
        formCustomerRef,
        formDateRef,
        selectedServices,
        setSelectedServices,
        subtotal,
        currency,
        setCurrency,
        exchangeRate,
        setExchangeRate,
        description,
        setDescription,
        company,
        isLoading,
        isError,
        isSaving,
        handleSave,
        handleSetFormDate,
        handleSetFormCustomer,
    } = useBudgetFecth();

    // Inicializar datos si el modo es "edit"
    useEffect(() => {
        console.log("budgetData recibido:", budgetData);
        if (mode === "edit" && budgetData) {
            handleSetFormDate( budgetData.budgetForm);
            handleSetFormCustomer(budgetData.customer)
            setSelectedServices(budgetData.services);
            setDescription(budgetData.description);
        }
    }, [mode, budgetData]);


    return (
        <div className="relative flex flex-col py-6 px-0 sm:px-12">
            {isSaving && (
                <div className="absolute inset-0 flex justify-center items-center bg-black/50 backdrop-blur-sm z-50">
                    <Loading />
                </div>
            )}
            <BudgetOptions />
            <BudgetHeader company={company || null} isError={isError} isLoading={isLoading} />
            <div className="flex flex-col sm:flex-row py-4 px-8">
                <div className="flex-1">
                    <BudgetCustomerForm ref={formCustomerRef} />
                </div>
                <div className="flex-1">
                    <BudgetForm
                        ref={formDateRef}
                        setCurrency={setCurrency}
                        currency={currency}
                        exchangeRate={exchangeRate}
                        setExchangeRate={setExchangeRate}
                        mode={mode}
                    />
                </div>
            </div>
            <BudgetTable
                selectedServices={selectedServices}
                setSelectedServices={setSelectedServices}
                currency={currency}
                exchangeRate={exchangeRate}
            />
            <BudgetSummary currency={currency} subtotal={subtotal} />

            {mode === 'create' && (
                <BudgetActions
                description={description}
                setDescription={setDescription}
                handleSave={handleSave}
            />
            )}

            {mode === 'edit' && (
                <div>Modo Modificar</div>
            )}

            
            
        </div>
    );
};
