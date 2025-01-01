'use client';

import { BudgetCustomerForm } from "../Budget/BudgetCustomerForm";
import { BudgetTable } from "../Budget/BudgetTable";
import { BudgetSummary } from "../Budget/BudgetSummary";
import { Loading } from "../Common/Loading";
import { useInvoice } from "src/hooks/Invoice/useInvoice";
import { CreditNoteForm } from "./CreditNoteForm";
import { InvoiceOptions } from "./../Invoice/InvoiceOptions";	
import { InvoiceActions } from "./../Invoice/InvoiceActions";
import { DocHeader } from "../Common/InvoiceHeader/InvoiceHeader";
import { CreditNoteActions } from "./CreditNoteActions/CreditNoteActions";
import { useCreditNote } from "src/hooks/CreditNote/useCreditNote";

    interface CreditNoteProps {
        mode?: "create" | "update";
        invoiceData?: Invoice | null;
    }

    export const CreditNote: React.FC<CreditNoteProps> = ({ mode = "create", invoiceData= null }) => {
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
    } = useCreditNote();
    

    return (
        <div className="relative flex flex-col py-6 px-0 sm:px-12">
            {isSaving && (
                <div className="absolute inset-0 flex justify-center items-center bg-black/50 backdrop-blur-sm z-50">
                    <Loading />
                </div>
            )}
            {/* <InvoiceOptions  
                company={company}
                selectedServices={selectedServices}
                // extractFormData={extractFormData}
                subtotal={subtotal}
                ivaPercentage={ivaPercentage}
                igtfPercentage={igtfPercentage}
                calculatedIva={calculatedIva}
                calculatedIgtf={calculatedIgtf}
                total={total}
                totalWithIgft={totalWithIgft}
            /> */}
            <DocHeader company={company || null} isError={isError} isLoading={isLoading} title="NOTA DE CRÉDITO" />
            <div className="flex flex-col sm:flex-row py-4 px-8">
                <div className="flex-1">
                    <BudgetCustomerForm ref={formCustomerRef} />
                </div>
                <div className="flex-1">
                    <CreditNoteForm
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

            <CreditNoteActions
                description={description}
                setDescription={setDescription}
                handleSave={handleSave} 
            />

        </div>
    );
};
