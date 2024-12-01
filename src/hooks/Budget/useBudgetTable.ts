// hooks/useBudgetTable.ts
import { useEffect, useMemo, useState } from "react";
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

  const originalServicesMemo = useMemo(() => {
    if (selectedServices.length > 0 && originalServices.length === 0) {
      return [...selectedServices]; // Clonar la lista solo si es necesario
    }
    return originalServices; // Retorna el valor existente si no cambia
  }, [selectedServices, originalServices]);
  
  useEffect(() => {
    setOriginalServices(originalServicesMemo);
  }, [originalServicesMemo, selectedServices])
  
  const convertedServices = useMemo(() => {
    if (originalServices.length === 0) return [];
  
    if (currency === "Bs") {
      return originalServices.map((service) => ({
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
      }));
    } else if (currency === "$") {
      return [...originalServices]; // Restablece valores originales
    }
  
    return originalServices; // Retorna por defecto
  }, [currency, exchangeRate, originalServices]);
  
  useEffect(() => {
    setSelectedServices(convertedServices);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [convertedServices]);
  
  
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

// Función genérica para agregar un nuevo servicio a un estado
const addServiceToState = (
  stateUpdater: React.Dispatch<React.SetStateAction<Service[]>>,
  service: Service
) => {
  stateUpdater((prevServices) => [...prevServices, service]);
};

  // Manejar la adición de un servicio vacío
  const handleAddEmptyService = () => {
    const newService = {
      ...SERVICEVOID,
      _id: uuidv4(),
      name: "Nuevo Servicio",
      totalPrice: 0,
      serviceQuantity: 1,
    };

    // Usar la función genérica para agregar el nuevo servicio
    addServiceToState(setSelectedServices, newService);
    addServiceToState(setOriginalServices, newService);
  };


// Función genérica para eliminar un servicio de un estado
const removeServiceFromState = (
  stateUpdater: React.Dispatch<React.SetStateAction<Service[]>>,
  serviceId: string
) => {
  stateUpdater((prevServices) =>
    prevServices.filter((service) => service._id !== serviceId)
  );
};

  // Función genérica para eliminar una propiedad de un objeto de estado
  const removePropertyFromState = (
    stateUpdater: React.Dispatch<React.SetStateAction<Record<string, any>>>,
    propertyKey: string
  ) => {
    stateUpdater((prevState) => {
      const newState = { ...prevState };
      delete newState[propertyKey];
      return newState;
    });
  };

  // Manejar la eliminación de una fila
  const handleDeleteRow = (serviceId: string) => {
    // Eliminar el servicio de los estados
    removeServiceFromState(setSelectedServices, serviceId);
    removeServiceFromState(setOriginalServices, serviceId);

    // Eliminar los detalles del servicio
    removePropertyFromState(setServiceDetailsVisible, serviceId);
  };

  // Función genérica para actualizar el nombre de un servicio
  const updateServiceNameInState = (
    stateUpdater: React.Dispatch<React.SetStateAction<Service[]>>,
    serviceId: string,
    newName: string
  ) => {
    stateUpdater((prevServices) =>
      prevServices.map((service) =>
        service._id === serviceId ? { ...service, name: newName } : service
      )
    );
  };

  // Manejar el cambio de nombre del servicio
  const handleNameChange = (id: string, newName: string) => {
    // Actualizar el nombre en los estados
    updateServiceNameInState(setSelectedServices, id, newName);
    updateServiceNameInState(setOriginalServices, id, newName);
  };

  // Función genérica para actualizar la cantidad de servicio
  const updateServiceQuantityInState = (
    stateUpdater: React.Dispatch<React.SetStateAction<Service[]>>,
    serviceId: string,
    quantity: number
  ) => {
    stateUpdater((prevServices) =>
      prevServices.map((service) =>
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

  // Manejar el cambio de cantidad de servicio
  const handleServiceQuantityChange = (value: string, serviceId: string) => {
    const quantity = parseInt(value.replace(/\D/g, ""), 10) || 1;

    // Actualizar cantidad en los estados
    updateServiceQuantityInState(setSelectedServices, serviceId, quantity);
    updateServiceQuantityInState(setOriginalServices, serviceId, quantity);
  };


  // Calcular totales de servicios
  const calculateServiceTotals = (service: Service) => {
    const productTotal = service.products.reduce(
      (sum, p) => sum + p.quantity * p.product.price,
      0
    );

    const updatedTotalProductWithService = productTotal + (service.servicePrice || 0);
    const updatedTotal = updatedTotalProductWithService * (service.serviceQuantity || 1);

    return { updatedTotal };
  };

  // Función genérica para actualizar el precio de servicio
  const updateServicePriceInState = (
    stateUpdater: React.Dispatch<React.SetStateAction<Service[]>>,
    serviceId: string,
    newPrice: number
  ) => {
    stateUpdater((prevServices) =>
      prevServices.map((service) => {
        if (service._id === serviceId) {
          const updatedService = {
            ...service,
            servicePrice: newPrice,
          };
          const { updatedTotal } = calculateServiceTotals(updatedService);
          return {
            ...updatedService,
            totalPrice: updatedTotal,
          };
        }
        return service;
      })
    );
  };

  // Manejar el cambio de precio de servicio
  const handleServicePriceChange = (serviceId: string, newPrice: number) => {
    // Actualizar precio en selectedServices
    updateServicePriceInState(setSelectedServices, serviceId, newPrice);

    // Solo actualizar originalServices si currency es "$"
    if (currency === "$") {
      updateServicePriceInState(setOriginalServices, serviceId, newPrice);
    }
  };

  // Función genérica para actualizar la cantidad de productos
  const updateProductQuantityInState = (
    stateUpdater: React.Dispatch<React.SetStateAction<Service[]>>,
    serviceId: string,
    productId: string,
    newQuantity: number
  ) => {
    stateUpdater((prevServices) =>
      prevServices.map((service) => {
        if (service._id === serviceId) {
          const updatedProducts = service.products.map((p) =>
            p.product._id === productId ? { ...p, quantity: newQuantity } : p
          );
          const updatedService = {
            ...service,
            products: updatedProducts,
          };
          const { updatedTotal } = calculateServiceTotals(updatedService);
          return {
            ...updatedService,
            totalPrice: updatedTotal,
          };
        }
        return service;
      })
    );
  };

  // Manejar el cambio de cantidad de producto
  const handleProductQuantityChange = (
    serviceId: string,
    productId: string,
    newQuantity: number
  ) => {
    // Actualizar cantidad en selectedServices
    updateProductQuantityInState(setSelectedServices, serviceId, productId, newQuantity);

    // Actualizar cantidad en originalServices
    updateProductQuantityInState(setOriginalServices, serviceId, productId, newQuantity);
  };


  // Función genérica para eliminar un producto
  const removeProductFromState = (
    stateUpdater: React.Dispatch<React.SetStateAction<Service[]>>,
    productId: string
  ) => {
    stateUpdater((prevServices) =>
      prevServices.map((service) => {
        const updatedProducts = service.products.filter(
          (product) => product.product._id !== productId
        );
        const updatedService = {
          ...service,
          products: updatedProducts,
        };
        const { updatedTotal } = calculateServiceTotals(updatedService);
        return {
          ...updatedService,
          totalPrice: updatedTotal,
        };
      })
    );
  };

  // Manejar la eliminación del producto
  const handleProductDelete = (productId: string) => {
    // Eliminar producto de selectedServices
    removeProductFromState(setSelectedServices, productId);

    // Eliminar producto de originalServices
    removeProductFromState(setOriginalServices, productId);
  };


  // Función generica para agregar un producto a un servicio
  const addProductToService = (
    stateUpdater: React.Dispatch<React.SetStateAction<Service[]>>,
    serviceId: string,
    product: any,
    isSelectedState: boolean,
    setIsRepeated: (isRepeated: boolean) => void // Usar un callback para manejar isRepeated
  ) => {
    stateUpdater((prevServices) =>
      prevServices.map((service) => {
        if (service._id === serviceId) {
          const existingProduct = service.products.find(
            (p) => p.product._id === product._id
          );

          if (existingProduct) {
            setIsRepeated(true); 
            return service; // Si el producto ya existe, no hacer nada
          }

          // Convertir el precio si la moneda es "Bs" solo en selectedServices
          const convertedProduct = isSelectedState
            ? {
                ...product,
                price:
                  currency === "Bs"
                    ? parseFloat((product.price * exchangeRate).toFixed(2))
                    : product.price,
              }
            : product; // No convertir si es originalServices

          const updatedProducts = [
            ...service.products,
            { product: convertedProduct, quantity: 1 },
          ];

          const updatedService = { ...service, products: updatedProducts };
          const { updatedTotal } = calculateServiceTotals(updatedService);
          return {
            ...updatedService,
            totalPrice: updatedTotal,
          };
        }
        return service;
      })
    );
  };

  // Agregar producto
  const handleAddProduct = (product: Product) => {
    let isRepeated = false;
    
    const setIsRepeated = (repeated: boolean) => {
      isRepeated = repeated; // Actualiza el estado de isRepeated
    };

    if (activeServiceId) {
      // Actualizar lista original
      addProductToService(setOriginalServices, activeServiceId, product, false, setIsRepeated);

      // Actualizar lista seleccionada
      addProductToService(setSelectedServices, activeServiceId, product, true, setIsRepeated);

      setIsProductTableVisible(false);

      // Mostrar alerta si el producto ya existe
      if (isRepeated) {
        toast.info("¡Este producto ya está agregado!");
      }
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