'use client';

import { CustomerForm } from "../Budget/CustomerForm";
import { BudgetTable } from "../Budget/BudgetTable";
import { BudgetSummary } from "../Budget/BudgetSummary";
import { Loading } from "../Common/Loading";
import { useInvoice } from "src/hooks/Invoice/useInvoice";
import { InvoiceForm } from "./InvoiceForm/InvoiceForm";
import { InvoiceOptions } from "./InvoiceOptions/InvoiceOptions";
import { InvoiceActions } from "./InvoiceActions";
import { DocHeader } from "../Common/DocHeader";


    export const Invoice = () => {
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
        setRefBudget
    } = useInvoice();
    

    return (
        <div className="relative flex flex-col py-6 px-0 sm:px-12">
            <InvoiceOptions  
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
            <DocHeader company={company || null} isError={isError} isLoading={isLoading} title="FACTURA" />
            <div className="flex flex-col sm:flex-row py-4 px-8">
                <div className="flex-1">
                    <CustomerForm title="Facturar a" ref={formCustomerRef} />
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
                        setRefBudget = {setRefBudget}
                        setDescription={setDescription}
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

            <InvoiceActions
                description={description}
                setDescription={setDescription}
                handleButtonType={(action: "paid" | "pending") => handleSave(action)}               
            />
        </div>
    );
};
