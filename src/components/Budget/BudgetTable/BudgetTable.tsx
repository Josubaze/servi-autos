import React from "react";
import { useBudgetTable } from "src/hooks/Budget/useBudgetTable";
import { BudgetTableHeader } from "./BudgetTableHeader";
import { BudgetServiceRow } from "./BudgetServiceRow";
import { BudgetAddLineButton } from "../BudgetAddLineButton";
import { SelectServices } from "src/components/Common/SelectServices";
import { SelectProducts } from "src/components/Common/SelectProducts";

interface BudgetTableProps {
  selectedServices: Service[];
  setSelectedServices: React.Dispatch<React.SetStateAction<Service[]>>;
  currency: string;
  exchangeRate: number;
}
export const BudgetTable = ({ selectedServices, setSelectedServices, currency, exchangeRate }: BudgetTableProps) => {
  const {
    services,
    products,
    isServiceTableVisible,
    isProductTableVisible,
    serviceDetailsVisible,
    isLoading,
    isError,
    isSuccess,
    isErrorProducts,
    handleServiceSelect,
    handleViewDetails,
    handleDeleteRow,
    handleAddEmptyService,
    handleNameChange,
    handleServiceQuantityChange,
    handleServicePriceChange,
    handleProductQuantityChange, 
    handleProductDelete,
    handleAddProduct,
    setIsServiceTableVisible,
    setIsProductTableVisible,
    setActiveServiceId,
  } = useBudgetTable({ selectedServices, setSelectedServices, currency, exchangeRate});

  return (
    <>
      <BudgetTableHeader />
      {selectedServices.map((service) => (
        <BudgetServiceRow
          key={service._id}
          service={service}
          serviceDetailsVisible={serviceDetailsVisible[service._id]}
          onViewDetails={handleViewDetails}
          onDeleteRow={handleDeleteRow}
          onNameChange={handleNameChange}
          onQuantityChange={handleServiceQuantityChange}
          onPriceChange={handleServicePriceChange}
          onProductQuantityChange={handleProductQuantityChange}
          onProductDelete={handleProductDelete}
          onShowProductTable={(serviceId) => {
            setActiveServiceId(serviceId);
            setIsProductTableVisible(true);
          }}
        />
      ))}

      <BudgetAddLineButton
        onTableVisible={() => setIsServiceTableVisible(true)} 
        onAddEmptyService={handleAddEmptyService}
      />

      {isServiceTableVisible && (
          <SelectServices
            data={services}
            isLoading={isLoading}
            isError={isError}
            isSuccess={isSuccess}
            onServiceSelect={handleServiceSelect}
            onCloseTable={() => setIsServiceTableVisible(false)}
          />
      )}
  
      {isProductTableVisible && ( 
          <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md"> 
          <SelectProducts 
            data={products} 
            isError={isErrorProducts}
            onAddProduct={handleAddProduct} 
            onCloseTable={() => setIsProductTableVisible(false)} 
          /> 
          </div>
      )}     
    </>
  );
};
