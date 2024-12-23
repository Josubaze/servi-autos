'use client';

import { BudgetOptions } from "../Budget/BudgetOptions";
import { InvoiceHeader } from "../Invoice/InvoiceHeader";
import { BudgetCustomerForm } from "../Budget/BudgetCustomerForm";
import { BudgetTable } from "../Budget/BudgetTable";
import { BudgetSummary } from "../Budget/BudgetSummary";
import { BudgetActions } from "../Budget/BudgetActions";
import { Loading } from "../Common/Loading";
import { useInvoice } from "src/hooks/Invoice/useInvoice";
import { InvoiceForm } from "./InvoiceForm/InvoiceForm";

    interface InvoiceProps {
        mode?: "create" | "update";
        invoiceData?: Invoice | null;
    }

    export const Invoice: React.FC<InvoiceProps> = ({ mode = "create", invoiceData= null }) => {
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
    } = useInvoice({ mode, invoiceData });
    

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
            <InvoiceHeader company={company || null} isError={isError} isLoading={isLoading} />
            <div className="flex flex-col sm:flex-row py-4 px-8">
                <div className="flex-1">
                    <BudgetCustomerForm ref={formCustomerRef} />
                </div>
                <div className="flex-1">
                    <InvoiceForm
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
                handleButtonType={(action: "draft" | "accepted") => handleSave(action, mode, invoiceData?._id || '')} 
                mode={mode}              
            />
        </div>
    );
};
