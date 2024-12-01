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

export const Budget = () => {
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
    } = useBudgetFecth();

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
                <div className="flex-1 sm:border-r sm:border-white/30">
                    <BudgetCustomerForm ref={formCustomerRef} />
                </div>
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
            <BudgetTable
                selectedServices={selectedServices}
                setSelectedServices={setSelectedServices}
                currency={currency}
                exchangeRate={exchangeRate}
            />
            <BudgetSummary currency={currency} subtotal={subtotal} />
            <BudgetActions
                description={description}
                setDescription={setDescription}
                handleSave={handleSave}
            />
        </div>
    );
};
