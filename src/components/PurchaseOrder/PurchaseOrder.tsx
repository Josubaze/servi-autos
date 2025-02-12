'use client';


import { PurchaseOrderForm } from "./PurchaseOrderForm";
import { BudgetSummary } from "../Budget/BudgetSummary";
import { Loading } from "../Common/Loading";
import { usePurchaseOrder } from "src/hooks/PurchaseOrder/usePurchaseOrder";
import { DocHeader } from "../Common/DocHeader";
import { ProviderForm } from "./ProviderForm";
import { PurchaseOrderTable } from "./PurchaseOrderTable/PurchaseOrderTable";
import { PurchaseOrderActions } from "./PurchaseOrderActions/PurchaseOrderActions";
import { PurchaseOrderOptions } from "./PurchaseOrderOptions";

    interface PurchaseOrderProps {
        mode?: "create" | "upload";
        purchaseOrderData?: PurchaseOrder | null;
    }

    export const PurchaseOrder: React.FC<PurchaseOrderProps> = ({ mode = "create", purchaseOrderData= null }) => {
    const {
        formProviderRef,
        formRef,
        selectedProducts,
        setSelectedProducts,
        originalProducts,
        setOriginalProducts,
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
        handleSetFormProvider,
    } = usePurchaseOrder({ mode, purchaseOrderData });
    

    return (
        <div className="relative flex flex-col py-6 px-0 sm:px-12">
            <PurchaseOrderOptions  
                company={company}
                selectedProducts={selectedProducts}
                extractFormData={extractFormData}
                subtotal={subtotal}
                ivaPercentage={ivaPercentage}
                igtfPercentage={igtfPercentage}
                calculatedIva={calculatedIva}
                calculatedIgtf={calculatedIgtf}
                total={total}
                totalWithIgft={totalWithIgft}
            />
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
                        handleSetFormProvider={handleSetFormProvider}
                        setIgtfPercentage={setIgtfPercentage}
                        setIvaPercentage={setIvaPercentage}
                        setOriginalProducts={setOriginalProducts}
                        setSelectedProducts={setSelectedProducts}
                        setDescription={setDescription}
                        mode={mode}
                    />
                </div>
            </div>
            <PurchaseOrderTable
                selectedProducts={selectedProducts}
                setSelectedProducts={setSelectedProducts}
                originalProducts={originalProducts}
                setOriginalProducts={setOriginalProducts}
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

            <PurchaseOrderActions
                description={description}
                setDescription={setDescription}
                handleButtonType={(action: "draft" | "inProgress") => handleSave( action, mode, purchaseOrderData?._id || '')} 
                mode={mode}              
            />
        </div>
    );
};
