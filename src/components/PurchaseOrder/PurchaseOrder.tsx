'use client';

import { BudgetOptions } from "../Budget/BudgetOptions";
import { CustomerForm } from "../Budget/CustomerForm";
import { PurchaseOrderForm } from "./PurchaseOrderForm";
import { BudgetTable } from "../Budget/BudgetTable";
import { BudgetSummary } from "../Budget/BudgetSummary";
import { BudgetActions } from "../Budget/BudgetActions";
import { Loading } from "../Common/Loading";
import { usePurchaseOrder } from "src/hooks/PurchaseOrder/usePurchaseOrder";
import { DocHeader } from "../Common/DocHeader";
import { ProviderForm } from "./ProviderForm";

    interface PurchaseOrderProps {
        mode?: "create" | "upload";
        purchaseOrderData?: PurchaseOrder | null;
    }

    export const PurchaseOrder: React.FC<PurchaseOrderProps> = ({ mode = "create", purchaseOrderData= null }) => {
    const {
        formProviderRef,
        formRef,
        // selectedServices,
        // setSelectedServices,
        // originalServices,
        // setOriginalServices,
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
        handleSetFormProvider,
    } = usePurchaseOrder({ mode, purchaseOrderData });
    

    return (
        <div className="relative flex flex-col py-6 px-0 sm:px-12">
            {isSaving && (
                <div className="absolute inset-0 flex justify-center items-center bg-black/50 backdrop-blur-sm z-50">
                    <Loading />
                </div>
            )}
            {/* <BudgetOptions  
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
            /> */}
            <DocHeader company={company || null} isError={isError} isLoading={isLoading} title="ORDEN DE COMPRA" />
            <div className="flex flex-col sm:flex-row py-4 px-8">
                <div className="flex-1">
                    <ProviderForm title="Orden de compra para" ref={formProviderRef} />
                </div>
                <div className="flex-1">
                    <PurchaseOrderForm
                        ref={formRef}
                        setCurrency={setCurrency}
                        currency={currency}
                        exchangeRate={exchangeRate}
                        setExchangeRate={setExchangeRate}
                        // setSelectedServices={setSelectedServices}
                        // setOriginalServices={setOriginalServices}
                        // setIvaPercentage={setIvaPercentage}
                        // setIgtfPercentage={setIgtfPercentage}
                        handleSetFormProvider={handleSetFormProvider}
                        // setDescription={setDescription}
                        mode={mode}
                    />
                </div>
            </div>
            {/* <BudgetTable
                selectedServices={selectedServices}
                setSelectedServices={setSelectedServices}
                originalServices={originalServices}
                setOriginalServices={setOriginalServices}
                currency={currency}
                exchangeRate={exchangeRate}
            /> */}

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
                handleButtonType={() => handleSave( mode, purchaseOrderData?._id || '')} 
                mode={mode}              
            />
        </div>
    );
};
