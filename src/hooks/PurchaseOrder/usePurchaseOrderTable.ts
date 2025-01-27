import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import { useGetProductsQuery } from "src/redux/services/productsApi";
import { PRODUCTVOID } from "src/utils/constanst";


export const usePurchaseOrderTable = ({
  selectedProducts,
  setSelectedProducts,
  originalProducts,
  setOriginalProducts,
  currency,
  exchangeRate,
}: {
  selectedProducts: Product[];
  setSelectedProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  originalProducts: Product[];
  setOriginalProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  currency: string;
  exchangeRate: number;
}) => {
  const [isProductTableVisible, setIsProductTableVisible] = useState<boolean>(false);
  const { data: products = [], isLoading, isError, isSuccess , isFetching} = useGetProductsQuery();
  const [isInitialized, setIsInitialized] = useState(false);

  // Actualización inicial de `originalProducts` cuando se cargan los `selectedProducts`
  useEffect(() => {
    if (!isInitialized && selectedProducts.length > 0 && originalProducts.length === 0) {
      setOriginalProducts([...selectedProducts]); // Clona solo al inicio
      setIsInitialized(true);
    }
  }, [selectedProducts, originalProducts, isInitialized, setOriginalProducts]);

  // Recalcular productos seleccionados cuando cambia la moneda o la tasa de cambio
  useEffect(() => {
    if (originalProducts.length > 0) {
      if (currency === "Bs") {
        setSelectedProducts(
          originalProducts.map((product) => ({
            ...product,
            price: parseFloat((product.price * exchangeRate).toFixed(2)),
          }))
        );
      } else if (currency === "$") {
        setSelectedProducts([...originalProducts]); // Restablece valores originales
      }
    }
  }, [currency, exchangeRate, originalProducts, setSelectedProducts]);

  // Seleccionar un producto
  const handleProductSelect = (product: Product) => {
    const isRepeated = selectedProducts.some(
      (selectedProduct) => selectedProduct._id === product._id
    );

    if (isRepeated) {
      toast.info("¡Este producto ya está agregado!");
      return;
    }

     // Crear un nuevo producto con la cantidad establecida en 1
    const newProduct = { ...product, quantity: 1 };

    // Convertir precio si está en "Bs"
    if (currency === "Bs") {
      newProduct.price = parseFloat((product.price * exchangeRate).toFixed(2));
    }

    setSelectedProducts((prev) => [...prev, newProduct]);
    setOriginalProducts((prev) => [...prev, newProduct]);
    setIsProductTableVisible(false);
  };

  // Función genérica para agregar un producto vacío a un estado
const addProductToState = (
    stateUpdater: React.Dispatch<React.SetStateAction<Product[]>>,
    product: Product
  ) => {
    stateUpdater((prevProducts) => [...prevProducts, product]);
  };
  
  // Manejar la adición de un producto vacío
  const handleAddEmptyProduct = () => {
    const newProduct = {
      ...PRODUCTVOID, // Objeto vacío base para un producto
      _id: uuidv4(),
      name: "Nuevo Producto",
      price: 0,
      quantity: 1,
      totalPrice: 0,
    };
  
    addProductToState(setSelectedProducts, newProduct);
    addProductToState(setOriginalProducts, newProduct);
  };
  
  // Función genérica para eliminar un producto de un estado
  const removeProductFromState = (
    stateUpdater: React.Dispatch<React.SetStateAction<Product[]>>,
    productId: string
  ) => {
    stateUpdater((prevProducts) =>
      prevProducts.filter((product) => product._id !== productId)
    );
  };
  
  // Manejar la eliminación de un producto
  const handleDeleteRow = (productId: string) => {
    removeProductFromState(setSelectedProducts, productId);
    removeProductFromState(setOriginalProducts, productId);
  };
  
  // Función genérica para actualizar el nombre de un producto
  const updateProductNameInState = (
    stateUpdater: React.Dispatch<React.SetStateAction<Product[]>>,
    productId: string,
    newName: string
  ) => {
    stateUpdater((prevProducts) =>
      prevProducts.map((product) =>
        product._id === productId ? { ...product, name: newName } : product
      )
    );
  };
  
  // Manejar el cambio de nombre del producto
  const handleNameChange = (id: string, newName: string) => {
    updateProductNameInState(setSelectedProducts, id, newName);
    updateProductNameInState(setOriginalProducts, id, newName);
  };
  
  // Función genérica para actualizar la cantidad de un producto
  const updateProductQuantityInState = (
    stateUpdater: React.Dispatch<React.SetStateAction<Product[]>>,
    productId: string,
    quantity: number
  ) => {
    stateUpdater((prevProducts) =>
      prevProducts.map((product) =>
        product._id === productId
          ? {
              ...product,
              quantity,
              totalPrice: parseFloat((product.price * quantity).toFixed(2)), // Actualizar total
            }
          : product
      )
    );
  };
  
  // Manejar el cambio de cantidad de un producto
  const handleQuantityChange = (value: string, productId: string) => {
    const quantity = parseInt(value.replace(/\D/g, ""), 10) || 1;
    updateProductQuantityInState(setSelectedProducts, productId, quantity);
    updateProductQuantityInState(setOriginalProducts, productId, quantity);
  };
  
  // Función genérica para actualizar el precio de un producto
  const updateProductPriceInState = (
    stateUpdater: React.Dispatch<React.SetStateAction<Product[]>>,
    productId: string,
    newPrice: number
  ) => {
    stateUpdater((prevProducts) =>
      prevProducts.map((product) =>
        product._id === productId
          ? {
              ...product,
              price: newPrice,
              totalPrice: parseFloat((newPrice * product.quantity).toFixed(2)), // Actualizar total
            }
          : product
      )
    );
  };
  
  // Manejar el cambio de precio del producto
  const handlePriceChange = (productId: string, newPrice: number) => {
    updateProductPriceInState(setSelectedProducts, productId, newPrice);
  
    // Solo actualizar originalProducts si currency es "$"
    if (currency === "$") {
      updateProductPriceInState(setOriginalProducts, productId, newPrice);
    }
  };

  const toggleProductTableVisibility = () => {
    setIsProductTableVisible((prev) => !prev);
  };
  

  return {
    selectedProducts,
    isProductTableVisible,
    products,
    isLoading,
    isFetching,
    isError,
    isSuccess,
    handleProductSelect,
    handleAddEmptyProduct,
    handleDeleteRow,
    handleNameChange,
    handleQuantityChange,
    handlePriceChange,
    toggleProductTableVisibility,
  };
};
