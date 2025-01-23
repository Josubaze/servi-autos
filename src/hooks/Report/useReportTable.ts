// hooks/useBudgetTable.ts
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { useGetServicesQuery } from "src/redux/services/servicesApi";
import { useGetProductsQuery } from "src/redux/services/productsApi";
import { v4 as uuidv4 } from "uuid";
import { SERVICEVOID } from "src/utils/constanst";

export const useReportTable = ({ selectedServices, setSelectedServices, originalServices, setOriginalServices }: { 
  selectedServices: Service[]; 
  setSelectedServices: React.Dispatch<React.SetStateAction<Service[]>>;
  originalServices: Service[];  
  setOriginalServices: React.Dispatch<React.SetStateAction<Service[]>>;
}) => {
  const [serviceDetailsVisible, setServiceDetailsVisible] = useState<{ [key: string]: boolean }>({});
  const [isServiceTableVisible, setIsServiceTableVisible] = useState<boolean>(false);
  const [isProductTableVisible, setIsProductTableVisible] = useState<boolean>(false);
  const [activeServiceId, setActiveServiceId] = useState<string | null>(null);
  const { data: services = [], isLoading, isError, isSuccess } = useGetServicesQuery();
  const { data: products = [], isError: isErrorProducts, isFetching: isFetchingProducts, isLoading: isLoadingProducts, isSuccess: isSuccessProducts } = useGetProductsQuery();
  const [isInitialized, setIsInitialized] = useState(false); // Bandera de control

  // Actualización inicial de originalServices cuando se cargan los selectedServices
  useEffect(() => {
    if (!isInitialized && selectedServices.length > 0 && originalServices.length === 0) {
      setOriginalServices([...selectedServices]); // Clona solo al inicio
      setIsInitialized(true); // Marcamos como inicializado
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedServices]);

  
  const handleServiceSelect = (service: Service) => {
    let isRepeated = false;
  
    setSelectedServices((prev) => {
      const alreadyExists = prev.some((selectedService) => selectedService._id === service._id);
      if (alreadyExists) {
        isRepeated = true;
        return prev;
      }
      const newService = { ...service };
  
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


  // Calcular total unitario de servicios
  const calculateServiceUnitTotals = (service: Service) => {
    const productTotal = service.products.reduce(
      (sum, p) => sum + p.quantity * p.product.price,
      0
    );

    const updatedTotal = productTotal + (service.servicePrice || 0);

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
          const { updatedTotal } = calculateServiceUnitTotals(updatedService);
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
    updateServicePriceInState(setSelectedServices, serviceId, newPrice);
    updateServicePriceInState(setOriginalServices, serviceId, newPrice);
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
          const { updatedTotal } = calculateServiceUnitTotals(updatedService);
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
        const { updatedTotal } = calculateServiceUnitTotals(updatedService);
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
    setIsRepeated: (isRepeated: boolean) => void // Callback para manejar si está repetido
  ) => {
    stateUpdater((prevServices) =>
      prevServices.map((service) => {
        if (service._id === serviceId) {
          const existingProduct = service.products.find(
            (p) => p.product._id === product._id
          );
  
          if (existingProduct) {
            setIsRepeated(true); // Notificar si el producto ya existe
            return service; // No hacer cambios si el producto está repetido
          }
  
          // Agregar el producto si no está repetido
          return {
            ...service,
            products: [...service.products, { product: product, quantity: 1 }],
          };
        }
        return service; // Devolver el servicio sin cambios si no coincide el ID
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
      addProductToService(setOriginalServices, activeServiceId, product, setIsRepeated);

      // Actualizar lista seleccionada
      addProductToService(setSelectedServices, activeServiceId, product, setIsRepeated);

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
    originalServices,
    setOriginalServices,
    isServiceTableVisible,
    isProductTableVisible,
    activeServiceId,
    serviceDetailsVisible,
    isLoading,
    isError,
    isSuccess,
    isErrorProducts,
    isSuccessProducts,
    isFetchingProducts,
    isLoadingProducts,
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