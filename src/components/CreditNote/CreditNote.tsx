'use client';

import { CustomerForm } from "../Budget/CustomerForm";
import { BudgetTable } from "../Budget/BudgetTable";
import { BudgetSummary } from "../Budget/BudgetSummary";
import { Loading } from "../Common/Loading";
import { CreditNoteForm } from "./CreditNoteForm";
import { DocHeader } from "../Common/DocHeader";
import { CreditNoteActions } from "./CreditNoteActions/CreditNoteActions";
import { useCreditNote } from "src/hooks/CreditNote/useCreditNote";
import { CreditNoteOptions } from "./CreditNoteOptions/CreditNoteOptions";

    interface CreditNoteProps {
        mode?: "create" | "upload";
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
    } = useCreditNote({ mode, invoiceData });
    

    return (
        <div className="relative flex flex-col py-6 px-0 sm:px-12">
            {isSaving && (
                <div className="absolute inset-0 flex justify-center items-center bg-black/50 backdrop-blur-sm z-50">
                    <Loading />
                </div>
            )}
            <CreditNoteOptions  
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
                description={description}
            />
            <DocHeader company={company || null} isError={isError} isLoading={isLoading} title="NOTA DE CRÉDITO" />
            <div className="flex flex-col sm:flex-row py-4 px-8">
                <div className="flex-1">
                    <CustomerForm title="Nota de Crédito para:" ref={formCustomerRef} />
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
