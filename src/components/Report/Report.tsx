'use client';

import { CustomerForm } from "../Budget/CustomerForm";
import { BudgetSummary } from "../Budget/BudgetSummary";
import { Loading } from "../Common/Loading";
import { ReportForm } from "./ReportForm";
import { DocHeader } from "../Common/DocHeader";
import { CreditNoteActions } from "../CreditNote/CreditNoteActions";
import { useCreditNote } from "src/hooks/CreditNote/useCreditNote";
import { CreditNoteOptions } from "../CreditNote/CreditNoteOptions";
import { ReportTable } from "./ReportTable";

    interface ReportProps {
        mode?: "create" | "upload";
        invoiceData?: Invoice | null;
    }

    export const Report: React.FC<ReportProps> = ({ mode = "create", invoiceData= null }) => {
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
            <DocHeader company={company || null} isError={isError} isLoading={isLoading} title="INFORME" />
            <div className="flex flex-col sm:flex-row py-4 px-8">
                <div className="flex-1">
                    <CustomerForm title="Infome realizado a:" ref={formCustomerRef} />
                </div>
                <div className="flex-1">
                    <ReportForm
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
            <ReportTable
                selectedServices={selectedServices}
                setSelectedServices={setSelectedServices}
                originalServices={originalServices}
                setOriginalServices={setOriginalServices}
                currency={currency}
                exchangeRate={exchangeRate}
            />

            <CreditNoteActions
                description={description}
                setDescription={setDescription}
                handleSave={handleSave} 
            />

        </div>
    );
};
