// hooks/useBudgetTable.ts
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useGetServicesQuery } from "src/redux/services/servicesApi";
import { useGetProductsQuery } from "src/redux/services/productsApi";

export const useBudgetTable = () => {
  const [selectedServices, setSelectedServices] = useState<Service[]>([]);
  const [serviceDetailsVisible, setServiceDetailsVisible] = useState<{ [key: string]: boolean }>({});
  const [isTableVisible, setIsTableVisible] = useState<boolean>(false);
  const [isProductTableVisible, setIsProductTableVisible] = useState<boolean>(false);
  const [activeServiceId, setActiveServiceId] = useState<string | null>(null);
  const [productExists, setProductExists] = useState(false);

  const { data: services = [], isLoading, isError, isSuccess } = useGetServicesQuery();
  const { data: products = [], isError: isErrorProducts } = useGetProductsQuery();

  // Seleccionar servicio
  const handleSelect = (service: Service) => {
    setSelectedServices((prev) => [...prev, service]);
    setIsTableVisible(false);
  };

  // Ver detalles del servicio
  const handleViewDetails = (service: Service) => {
    setServiceDetailsVisible((prev) => ({
      ...prev,
      [service._id]: !prev[service._id],
    }));
  };

  // Eliminar fila
  const handleDeleteRow = (serviceId: string) => {
    setSelectedServices((prev) => prev.filter((service) => service._id !== serviceId));
    setServiceDetailsVisible((prev) => {
      const newState = { ...prev };
      delete newState[serviceId];
      return newState;
    });
  };

  // Cambiar la cantidad de servicios
  const handleServiceQuantityChange = (value: string, serviceId: string) => {
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

  // Calcular totales de servicios
  const calculateServiceTotals = (service: Service) => {
    const productTotal = service.products.reduce(
      (sum, p) => sum + p.quantity * p.product.price,
      0
    );

    const updatedTotalPrice = productTotal + (service.servicePrice || 0);
    const updatedTotal = updatedTotalPrice * (service.serviceQuantity || 1);

    return { updatedTotalPrice, updatedTotal };
  };

  // Modificar costo de mano de obra
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

  // Modificar cantidad de productos
  const handleProductQuantityChange = (
    serviceId: string,
    productId: string,
    newQuantity: number
  ) => {
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

  // Eliminar producto
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

  // Agregar producto
  const handleAddProduct = (product: any) => {
    if (activeServiceId) {
      setSelectedServices((prevServices) =>
        prevServices.map((service) => {
          if (service._id === activeServiceId) {
            const existingProduct = service.products.find(
              (p) => p.product._id === product._id
            );

            if (existingProduct) {
              setProductExists(true);
              setIsProductTableVisible(false);
              return service;
            }

            const updatedProducts = [
              ...service.products,
              { product, quantity: 1 },
            ];
            const updatedService = { ...service, products: updatedProducts };
            const { updatedTotalPrice, updatedTotal } =
              calculateServiceTotals(updatedService);
            return { ...updatedService, totalPrice: updatedTotalPrice, total: updatedTotal };
          }
          return service;
        })
      );
    }
    setIsProductTableVisible(false);
  };

  useEffect(() => {
    if (productExists) {
      toast.info("El producto ya está agregado!");
      setProductExists(false);
    }
  }, [productExists]);

  return {
    services,
    products,
    selectedServices,
    isTableVisible,
    isProductTableVisible,
    activeServiceId,
    serviceDetailsVisible,
    isLoading,
    isError,
    isSuccess,
    isErrorProducts,
    handleSelect,
    handleViewDetails,
    handleDeleteRow,
    handleServiceQuantityChange,
    handleServicePriceChange,
    handleProductQuantityChange,
    handleProductDelete,
    handleAddProduct,
    setIsTableVisible,
    setIsProductTableVisible,
    setActiveServiceId,
  };
};
