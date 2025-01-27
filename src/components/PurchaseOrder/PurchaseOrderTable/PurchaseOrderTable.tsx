import React from "react";
import { BudgetTableHeader } from "src/components/Budget/BudgetTable/BudgetTableHeader";
import { ProductRow } from "./ProductRow";
import { SelectProducts } from "src/components/Common/SelectProducts";
import { usePurchaseOrderTable } from "src/hooks/PurchaseOrder/usePurchaseOrderTable";
import { AddLineButton } from "../AddLineButton";

interface PurchaseOrderTableProps {
  selectedProducts: Product[];
  setSelectedProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  originalProducts: Product[];
  setOriginalProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  currency: string;
  exchangeRate: number;
}
export const PurchaseOrderTable = ({ selectedProducts, setSelectedProducts, originalProducts, setOriginalProducts, currency, exchangeRate }: PurchaseOrderTableProps) => {
  const {
    products,
    isProductTableVisible,
    isLoading,
    isFetching,
    isError,
    isSuccess,
    handleAddEmptyProduct, 
    handleProductSelect,
    handleNameChange,
    handleDeleteRow,
    handlePriceChange,
    handleQuantityChange,
    toggleProductTableVisibility,
  } = usePurchaseOrderTable({ selectedProducts, setSelectedProducts, originalProducts, setOriginalProducts, currency, exchangeRate});

  return (
    <>
      <BudgetTableHeader />
      {selectedProducts.map((product) => (
        <ProductRow
          key={product._id}
          product={product}
          onDeleteRow={handleDeleteRow}
          onNameChange={handleNameChange}
          onQuantityChange={handleQuantityChange}
          onPriceChange={handlePriceChange}        
        />
      ))}

      <AddLineButton
        onTableVisible={toggleProductTableVisibility} 
        onAddEmptyProduct={handleAddEmptyProduct}
      />
  
      {isProductTableVisible && ( 
          <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md"> 
          <SelectProducts 
            data={products} 
            isError={isError}
            isFetching={isFetching}
            isLoading={isLoading}
            isSuccess={isSuccess}
            onAddProduct={handleProductSelect}
            onCloseTable={toggleProductTableVisibility} 
          /> 
          </div>
      )}     
    </>
  );
};
