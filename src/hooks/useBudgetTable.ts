// hooks/useBudgetTable.ts
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useGetServicesQuery } from "src/redux/services/servicesApi";
import { useGetProductsQuery } from "src/redux/services/productsApi";
import { v4 as uuidv4 } from "uuid";
import { SERVICEVOID } from "src/utils/constanst";

export const useBudgetTable = ({ selectedServices, setSelectedServices, currency, exchangeRate }: { 
  selectedServices: Service[]; 
  setSelectedServices: React.Dispatch<React.SetStateAction<Service[]>>; 
  currency: string;
  exchangeRate: number; 
}) => {
  const [serviceDetailsVisible, setServiceDetailsVisible] = useState<{ [key: string]: boolean }>({});
  const [isServiceTableVisible, setIsServiceTableVisible] = useState<boolean>(false);
  const [isProductTableVisible, setIsProductTableVisible] = useState<boolean>(false);
  const [activeServiceId, setActiveServiceId] = useState<string | null>(null);
  const [originalServices, setOriginalServices] = useState<Service[]>([]);
  const { data: services = [], isLoading, isError, isSuccess } = useGetServicesQuery();
  const { data: products = [], isError: isErrorProducts } = useGetProductsQuery();

  useEffect(() => {
    // Inicializar precios originales en dólares cuando se seleccionan servicios
    if (selectedServices.length > 0 && originalServices.length === 0) {
      setOriginalServices([...selectedServices]); // Clonar la lista
    }
  }, [selectedServices]);
  
  // Aplicar conversión de moneda
  useEffect(() => {
    if (originalServices.length > 0) {
      if (currency === "Bs") {
        setSelectedServices(
          originalServices.map((service) => ({
            ...service,
            totalPrice: parseFloat((service.totalPrice * exchangeRate).toFixed(2)),
            servicePrice: parseFloat((service.servicePrice * exchangeRate).toFixed(2)),
            products: service.products.map((product) => ({
              ...product,
              product: {
                ...product.product,
                price: parseFloat((product.product.price * exchangeRate).toFixed(2)),
              },
            })),
          }))
        );
      } else if (currency === "$") {
        setSelectedServices([...originalServices]); // Restablecer valores originales
      }
    }
  }, [currency, exchangeRate, originalServices]);
  
  const handleServiceSelect = (service: Service) => {
    let isRepeated = false;
  
    setSelectedServices((prev) => {
      const alreadyExists = prev.some((selectedService) => selectedService._id === service._id);
      if (alreadyExists) {
        isRepeated = true;
        return prev;
      }
  
      const newService = { ...service };
      // Si está en "Bs", convertir el nuevo servicio
      if (currency === "Bs") {
        newService.totalPrice = parseFloat((service.totalPrice * exchangeRate).toFixed(2));
        newService.servicePrice = parseFloat((service.servicePrice * exchangeRate).toFixed(2)),
        newService.products = service.products.map((product) => ({
          ...product,
          product: {
            ...product.product,
            price: parseFloat((product.product.price * exchangeRate).toFixed(2)),
          },
        }));
      }
      
      return [...prev, newService];
    });
  
    if (!isRepeated) {
      setOriginalServices((prev) => [...prev, service]); // Agregar a originales
    }
    
    setIsServiceTableVisible(false);
    
    if (isRepeated) {
      toast.info("¡Este servicio ya está agregado!");
    }
  };
  
  // Ver detalles del servicio
  const handleViewDetails = (service: Service) => {
    setServiceDetailsVisible((prev) => ({
      ...prev,
      [service._id]: !prev[service._id],
    }));
  };

  const handleAddEmptyService = () => {
    // Crear un nuevo servicio vacío
    const newService = {
      ...SERVICEVOID,
      _id: uuidv4(),
      name: "Nuevo Servicio",
      totalPrice: 0,
      serviceQuantity: 1,
    };
  
    // Agregar el servicio vacío a selectedServices
    setSelectedServices((prevServices) => [...prevServices, newService]);
  
    // Agregar el servicio vacío también a originalServices
    setOriginalServices((prevOriginalServices) => [...prevOriginalServices, newService]);
  };


  // Eliminar fila
  const handleDeleteRow = (serviceId: string) => {
    // Eliminar el servicio de selectedServices
    setSelectedServices((prevSelectedServices) => 
      prevSelectedServices.filter((service) => service._id !== serviceId)
    );

    // Eliminar el servicio de originalServices para mantener sincronización
    setOriginalServices((prevOriginalServices) => 
      prevOriginalServices.filter((service) => service._id !== serviceId)
    );

    // Eliminar los detalles de servicio
    setServiceDetailsVisible((prevServiceDetailsVisible) => {
      const newState = { ...prevServiceDetailsVisible };
      delete newState[serviceId];
      return newState;
    });
  };

  // Cambiar nombre del servicio
  const handleNameChange = (id: string, newName: string) => {
    setSelectedServices((prevServices) =>
      prevServices.map((service) =>
        service._id === id ? { ...service, name: newName } : service
      )
    );

    setOriginalServices((prevOriginalServices) =>
      prevOriginalServices.map((service) =>
        service._id === id ? { ...service, name: newName } : service
      )
    );
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

    setOriginalServices((prevOriginalServices) =>
      prevOriginalServices.map((service) =>
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
  
    // Actualizar originalServices, pero solo si currency === "$"
    if (currency === "$") {
      setOriginalServices((prevOriginalServices) =>
        prevOriginalServices.map((service) => {
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
    }
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

    setOriginalServices((prevOriginalServices) =>
      prevOriginalServices.map((service) => {
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

    setOriginalServices((prevOriginalServices) =>
      prevOriginalServices.map((service) => {
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
    let isRepeated = false;

    if (activeServiceId) { // Si tengo el ID del servicio seleccionado
      // Actualizar ambas listas
      setOriginalServices((prevOriginalServices) =>
        prevOriginalServices.map((service) => {
          if (service._id === activeServiceId) {
            const existingProduct = service.products.find(
              (p) => p.product._id === product._id
            );

            if (existingProduct) {
              isRepeated = true;
              return service;
            }

            const updatedProducts = [
              ...service.products,
              { product, quantity: 1 }, // Agregar producto sin conversión a originalServices
            ];
            return { ...service, products: updatedProducts };
          }
          return service;
        })
      );

      setSelectedServices((prevSelectedServices) =>
        prevSelectedServices.map((service) => {
          if (service._id === activeServiceId) {
            const existingProduct = service.products.find(
              (p) => p.product._id === product._id
            );

            if (existingProduct) {
              isRepeated = true;
              return service;
            }

            // Convertir precio si la moneda es "Bs"
            const convertedProduct = {
              ...product,
              price:
                currency === "Bs"
                  ? parseFloat((product.price * exchangeRate).toFixed(2))
                  : product.price,
            };

            const updatedProducts = [
              ...service.products,
              { product: convertedProduct, quantity: 1 },
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

    if (isRepeated) {
      toast.info("¡Este producto ya está agregado!");
    }
  };



  return {
    services,
    products,
    selectedServices,
    isServiceTableVisible,
    isProductTableVisible,
    activeServiceId,
    serviceDetailsVisible,
    isLoading,
    isError,
    isSuccess,
    isErrorProducts,
    handleServiceSelect,
    handleViewDetails,
    handleAddEmptyService,
    handleDeleteRow,
    handleNameChange,
    handleServiceQuantityChange,
    handleServicePriceChange,
    handleProductQuantityChange,
    handleProductDelete,
    handleAddProduct,
    setIsServiceTableVisible,
    setIsProductTableVisible,
    setActiveServiceId,
  };
};