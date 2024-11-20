import React, { useState } from "react";
import { ThemeProvider } from "@mui/material/styles";
import { TextFieldTheme } from "src/styles/themes/themeTextField";
import { NumericFormat } from "react-number-format";
import { BudgetProductTable } from "../BudgetProductTable";
import { BudgetAddLineButton } from "../BudgetAddLineButton";
import { TextField, Tooltip } from "@mui/material";
import { MdDelete, MdVisibility } from "react-icons/md";
import { useGetServicesQuery } from "src/redux/services/servicesApi";
import { SelectTableServices } from "../SelectTableServices";

export const BudgetTable = () => {
  const [selectedServices, setSelectedServices] = useState<Service[]>([]);
  const [serviceDetailsVisible, setServiceDetailsVisible] = useState<{ [key: string]: boolean }>({});
  const [isTableVisible, setIsTableVisible] = useState<boolean>(false);
  const { data = [], isLoading, isError, isSuccess } = useGetServicesQuery();

  // seleccionar servicio
  const handleSelect = (service: Service) => {
    setSelectedServices((prev) => [...prev, service]);
    setIsTableVisible(false);
  };

  // ver los detalles de servicio
  const handleViewDetails = (service: Service) => {
    setServiceDetailsVisible((prev) => ({
      ...prev,
      [service._id]: !prev[service._id],
    }));
  };

  // eliminar fila
  const handleDeleteRow = (serviceId: string) => {
    setSelectedServices((prev) => prev.filter((service) => service._id !== serviceId));
    setServiceDetailsVisible((prev) => {
      const newState = { ...prev };
      delete newState[serviceId];
      return newState;
    });
  };

  // cambiar la cantidad de servicios
  const handleQuantityChange = (value: string, serviceId: string) => {
    const quantity = parseInt(value.replace(/\D/g, ""), 10) || 1;
    setSelectedServices((prev) =>
      prev.map((service) =>
        service._id === serviceId
          ? {
              ...service,
              serviceQuantity: quantity,
              total: ((service.totalPrice || 0) * quantity).toFixed(2),
            }
          : service
      )
    );
  };

  // Función común para calcular los totales
  const calculateServiceTotals = (service: Service) => {
    const productTotal = service.products.reduce(
      (sum: number, p: any) => sum + p.quantity * p.product.price,
      0
    );

    const updatedTotalPrice = productTotal + (service.servicePrice || 0);
    const updatedTotal = updatedTotalPrice * (service.serviceQuantity || 1);

    return { updatedTotalPrice, updatedTotal };
  };

  // modificar costo mano de obra
  const handleServicePriceChange = (serviceId: string, newPrice: number) => {
    setSelectedServices((prevServices) =>
      prevServices.map((service) => {
        if (service._id === serviceId) {
          const updatedService = {
            ...service,
            servicePrice: newPrice,
          };
          const { updatedTotalPrice, updatedTotal } = calculateServiceTotals(updatedService);
          return {
            ...updatedService,
            totalPrice: updatedTotalPrice,
            total: updatedTotal,
          };
        }
        return service;
      })
    );
  };
  
  

  // modificar cantidad de productos
  const handleProductQuantityChange = (serviceId: string, productId: string, newQuantity: number) => {
    setSelectedServices((prevServices) =>
      prevServices.map((service) => {
        if (service._id === serviceId) {
          const updatedProducts = service.products.map((p) =>
            p.product._id === productId ? { ...p, quantity: newQuantity } : p
          );
          const updatedService = {
            ...service,
            products: updatedProducts,
          };
          const { updatedTotalPrice, updatedTotal } = calculateServiceTotals(updatedService);
          return {
            ...updatedService,
            totalPrice: updatedTotalPrice,
            total: updatedTotal,
          };
        }
        return service;
      })
    );
  };
  
  
  // eliminar producto
  const handleProductDelete = (productId: string) => {
    setSelectedServices((prevServices) =>
      prevServices.map((service) => {
        const updatedProducts = service.products.filter(
          (product) => product.product._id !== productId
        );
        const updatedService = {
          ...service,
          products: updatedProducts,
        };
        const { updatedTotalPrice, updatedTotal } = calculateServiceTotals(updatedService);
        return {
          ...updatedService,
          totalPrice: updatedTotalPrice,
          total: updatedTotal,
        };
      })
    );
  };
  
  
  return (
    <>
      <div className="grid grid-cols-6 rounded-lg w-full bg-indigo-700 px-8 py-3">
        <div className="font-bold text-start pl-3 col-span-2">Descripción</div>
        <div className="font-bold text-end pr-6">Cantidad</div>
        <div className="font-bold text-end pr-4">Precio Unitario</div>
        <div className="font-bold text-end pr-3">Precio Total</div>
        <div className="font-bold text-center">Acciones</div>
      </div>

      {selectedServices.map((service) => (
        <div key={service._id}>
          {/* Fila de servicio */}
          <div className="grid grid-cols-6 rounded-lg w-full px-8 py-2 mt-4 gap-x-6">
            <div className="col-span-2 bg-black-nav">
              <ThemeProvider theme={TextFieldTheme}>
                <TextField
                  value={service.name}
                  variant="outlined"
                  fullWidth
                  type="text"
                  className="text-right"
                />
              </ThemeProvider>
            </div>

            <div className="bg-black-nav">
              <ThemeProvider theme={TextFieldTheme}>
                <NumericFormat
                  value={service.serviceQuantity}
                  customInput={TextField}
                  variant="outlined"
                  fullWidth
                  type="text"
                  allowNegative={false}
                  decimalScale={0}
                  fixedDecimalScale={false}
                  decimalSeparator=","
                  thousandSeparator="."
                  sx={{ input: { textAlign: "right" } }}
                  onValueChange={({ value }) => handleQuantityChange(value, service._id)}
                  isAllowed={(values) => {
                    const { floatValue } = values;
                    return floatValue !== undefined && floatValue > 0;
                  }}
                />
              </ThemeProvider>
            </div>

            <div className="bg-black-nav">
              <ThemeProvider theme={TextFieldTheme}>
                <NumericFormat
                  value={service.totalPrice.toFixed(2)}
                  customInput={TextField}
                  variant="outlined"
                  fullWidth
                  type="text"
                  decimalSeparator=","
                  thousandSeparator="."
                  decimalScale={2}
                  fixedDecimalScale
                  allowNegative={false}
                  sx={{ input: { textAlign: "right" } }}
                  disabled
                />
              </ThemeProvider>
            </div>

            <div className="bg-black-nav">
              <ThemeProvider theme={TextFieldTheme}>
                <NumericFormat
                  value={(service.totalPrice * service.serviceQuantity).toFixed(2)}
                  customInput={TextField}
                  variant="outlined"
                  fullWidth
                  type="text"
                  decimalSeparator=","
                  thousandSeparator="."
                  decimalScale={2}
                  fixedDecimalScale
                  allowNegative={false}
                  sx={{ input: { textAlign: "right" } }}
                  disabled
                />
              </ThemeProvider>
            </div>

            <div className="flex justify-center items-center gap-4">
              <Tooltip title="Ver Detalles" arrow>
                <button
                  className="w-12 h-12 rounded-full bg-transparent border-2 border-blue-600 flex justify-center items-center text-white transition-all ease-in-out delay-150 hover:scale-110 hover:bg-blue-600 hover:text-white duration-300"
                  onClick={() => handleViewDetails(service)}
                >
                  <MdVisibility className="w-12 h-12 p-2 text-blue-600 hover:text-white transition-all ease-in-out delay-150 hover:scale-110" />
                </button>
              </Tooltip>
              <Tooltip title="Eliminar Fila" arrow>
                <button
                  className="w-12 h-12 rounded-full bg-transparent border-2 border-red-600 flex justify-center items-center text-white transition-all ease-in-out delay-150 hover:scale-110 hover:bg-red-600 hover:text-white duration-300"
                  onClick={() => handleDeleteRow(service._id)}
                >
                  <MdDelete className="w-12 h-12 p-2 text-red-600 hover:text-white transition-all ease-in-out delay-150 hover:scale-110" />
                </button>
              </Tooltip>
            </div>
          </div>

          {/* Aquí va la tabla de detalles para cada servicio */}
          {serviceDetailsVisible[service._id] && (
            <BudgetProductTable
              productos={service.products}
              servicePrice={service.servicePrice || 0}
              onServicePriceChange={(newPrice) =>
                handleServicePriceChange(service._id, newPrice)
              }
              onProductQuantityChange={(productId, newQuantity) =>
                handleProductQuantityChange(service._id, productId, newQuantity)
              }
              onProductDelete={( productId) => handleProductDelete( productId)}
            />
          )}
        </div>
      ))}

      {isTableVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md">
          <SelectTableServices
            data={data}
            searchTerm=""
            isLoading={isLoading}
            isError={isError}
            isSuccess={isSuccess}
            handleSelect={handleSelect}
            onCloseTable={() => setIsTableVisible(false)}
          />
        </div>
      )}

      <BudgetAddLineButton setIsTableVisible={setIsTableVisible} />
    </>
  );
};
