import React from "react";
import { useReportTable } from "src/hooks/Report/useReportTable";
import { ReportTableHeader } from "./ReportTableHeader";
import { ReportServiceRow } from "./ReportServiceRow";
import { SelectServices } from "src/components/Common/SelectServices";
import { SelectProducts } from "src/components/Common/SelectProducts";
import { BudgetAddLineButton } from "src/components/Budget/BudgetAddLineButton";

interface ReportTableProps {
  selectedServices: Service[];
  setSelectedServices: React.Dispatch<React.SetStateAction<Service[]>>;
  originalServices: Service[];
  setOriginalServices: React.Dispatch<React.SetStateAction<Service[]>>;
}
export const ReportTable = ({ selectedServices, setSelectedServices, originalServices, setOriginalServices }: ReportTableProps) => {
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
    isFetchingProducts,
    isLoadingProducts,
    isSuccessProducts,
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
  } = useReportTable({ selectedServices, setSelectedServices, originalServices, setOriginalServices});

  return (
    <>
      <ReportTableHeader />
      {selectedServices.map((service) => (
        <ReportServiceRow
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
            showPrices={false}
            onServiceSelect={handleServiceSelect}
            onCloseTable={() => setIsServiceTableVisible(false)}
          />
      )}
  
      {isProductTableVisible && ( 
          <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md"> 
          <SelectProducts 
            data={products} 
            isError={isErrorProducts}
            isFetching={isFetchingProducts}
            isLoading={isLoadingProducts}
            isSuccess={isSuccessProducts}
            onAddProduct={handleAddProduct} 
            onCloseTable={() => setIsProductTableVisible(false)} 
            showPrice={false}
          /> 
          </div>
      )}     
    </>
  );
};
