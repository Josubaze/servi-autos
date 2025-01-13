'use client';

import { BudgetOptions } from "./BudgetOptions";
import { CustomerForm } from "./CustomerForm";
import { BudgetForm } from "./BudgetForm";
import { BudgetTable } from "./BudgetTable";
import { BudgetSummary } from "./BudgetSummary";
import { BudgetActions } from "./BudgetActions";
import { Loading } from "../Common/Loading";
import { useBudget } from "src/hooks/Budget/useBudget";
import { DocHeader } from "../Common/DocHeader";

    interface BudgetProps {
        mode?: "create" | "upload";
        budgetData?: Budget | null;
    }

    export const Budget: React.FC<BudgetProps> = ({ mode = "create", budgetData= null }) => {
    const {
        formCustomerRef,
        formRef,
        selectedServices,
        setSelectedServices,
        originalServices,
        setOriginalServices,
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
        extractFormData,
        ivaPercentage,
        igtfPercentage,
        calculatedIva,
        calculatedIgtf,
        total,
        totalWithIgft,
        setIvaPercentage,
        setIgtfPercentage,
        handleSetFormCustomer,
    } = useBudget({ mode, budgetData });
    

    return (
        <div className="relative flex flex-col py-6 px-0 sm:px-12">
            {isSaving && (
                <div className="absolute inset-0 flex justify-center items-center bg-black/50 backdrop-blur-sm z-50">
                    <Loading />
                </div>
            )}
            <BudgetOptions  
                company={company}
                selectedServices={selectedServices}
                extractFormData={extractFormData}
                subtotal={subtotal}
                ivaPercentage={ivaPercentage}
                igtfPercentage={igtfPercentage}
                calculatedIva={calculatedIva}
                calculatedIgtf={calculatedIgtf}
                total={total}
                totalWithIgft={totalWithIgft}
            />
            <DocHeader company={company || null} isError={isError} isLoading={isLoading} title="PRESUPUESTO" />
            <div className="flex flex-col sm:flex-row py-4 px-8">
                <div className="flex-1">
                    <CustomerForm title="Presupuestar a" ref={formCustomerRef} />
                </div>
                <div className="flex-1">
                    <BudgetForm
                        ref={formRef}
                        setCurrency={setCurrency}
                        currency={currency}
                        exchangeRate={exchangeRate}
                        setExchangeRate={setExchangeRate}
                        setSelectedServices={setSelectedServices}
                        setOriginalServices={setOriginalServices}
                        setIvaPercentage={setIvaPercentage}
                        setIgtfPercentage={setIgtfPercentage}
                        handleSetFormCustomer={handleSetFormCustomer}
                        setDescription={setDescription}
                        mode={mode}
                    />
                </div>
            </div>
            <BudgetTable
                selectedServices={selectedServices}
                setSelectedServices={setSelectedServices}
                originalServices={originalServices}
                setOriginalServices={setOriginalServices}
                currency={currency}
                exchangeRate={exchangeRate}
            />

            <BudgetSummary
                subtotal={subtotal}
                currency={currency}
                ivaPercentage={ivaPercentage}
                igtfPercentage={igtfPercentage}
                calculatedIva={calculatedIva}
                calculatedIgtf={calculatedIgtf}
                total={total}
                totalWithIgft={totalWithIgft}
                setIvaPercentage={setIvaPercentage}
                setIgtfPercentage={setIgtfPercentage}
            />

            <BudgetActions
                description={description}
                setDescription={setDescription}
                handleButtonType={(action: "draft" | "approved") => handleSave(action, mode, budgetData?._id || '')} 
                mode={mode}              
            />
        </div>
    );
};
