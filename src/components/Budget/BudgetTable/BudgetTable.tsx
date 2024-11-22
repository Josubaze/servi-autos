import React from "react";
import { useBudgetTable } from "src/hooks/useBudgetTable";
import { BudgetTableHeader } from "./BudgetTableHeader";
import { BudgetServiceRow } from "./BudgetServiceRow";
import { BudgetAddLineButton } from "../BudgetAddLineButton";
import { SelectServices } from "src/components/Common/SelectServices";
import { SelectProducts } from "src/components/Common/SelectProducts";

export const BudgetTable: React.FC = () => {
  const {
    services,
    products,
    selectedServices,
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
  } = useBudgetTable();

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
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md">
          <SelectServices
            data={services}
            isLoading={isLoading}
            isError={isError}
            isSuccess={isSuccess}
            onServiceSelect={handleServiceSelect}
            onCloseTable={() => setIsServiceTableVisible(false)}
          />
        </div>      
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
