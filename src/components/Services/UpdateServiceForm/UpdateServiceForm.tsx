import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ServiceSchema } from 'src/utils/validation.zod';
import { useUpdateServiceMutation } from 'src/redux/services/servicesApi';
import { useGetProductsQuery } from 'src/redux/services/productsApi';
import TextField from '@mui/material/TextField';
import {  ThemeProvider } from "@mui/material/styles";
import { TextFieldTheme } from 'src/styles/themes/themeTextField';
import { Notification } from 'src/components/Common/Notification';
import { CloseButton } from 'src/components/Common/Buttons/CloseButton';
import { SelectedTableProducts } from '../SelectedTableProducts';
import { SelectProducts } from 'src/components/Common/SelectProducts';

type FormServiceProps = {
  onClose: () => void;
  service: Service; // Servicio seleccionado para editar
};

export const UpdateServiceForm = ({ onClose, service }: FormServiceProps) => {
  const { register, handleSubmit, formState: { errors }, watch } = useForm<Omit<Service, '_id'>>({
    resolver: zodResolver(ServiceSchema),
    defaultValues: {
      name: service.name,
      servicePrice: service.servicePrice,
      products: service.products,
    },
  });

  const { data: productsData = [], isError: isErrorProducts  } = useGetProductsQuery();
  const [updateService, { isError }] = useUpdateServiceMutation();
  const [selectedProducts, setSelectedProducts] = useState<Product[]>(
    service.products.map((product) => ({
      _id: product.product._id,
      name: product.product.name,
      description: '',
      vehicleType: '',
      category: product.product.category,
      price: product.product.price,
      quantity: product.quantity
    }))
  );
  const [isProductTableVisible, setIsProductTableVisible] = useState(false);

  const handleProductSelect = (product: Product) => {
    setSelectedProducts((prev) => [...prev, { ...product, quantity: 1 }]);
    setIsProductTableVisible(false);
  };

  const handleQuantityChange = (index: number, newQuantity: number) => {
    const updatedProducts = [...selectedProducts];
    updatedProducts[index].quantity = newQuantity;
    setSelectedProducts(updatedProducts);
  };

  const servicePrice =  Number(watch('servicePrice', service.servicePrice));

  const onSubmit: SubmitHandler<Omit<Service, '_id'>> = async (data) => {
    const formData = {
      ...data,
      products: selectedProducts.map(product => ({
        product: product._id,
        quantity: product.quantity,
      })),
    };
    await updateService({ ...formData, _id: service._id }).unwrap();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md">
        {isProductTableVisible ? (
            <SelectProducts 
            data={productsData}
            isError={isErrorProducts}
            onAddProduct={handleProductSelect}
            onCloseTable={() => setIsProductTableVisible(false)}
        />
        ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-full  md:max-w-2xl lg:max-w-3xl mx-auto bg-black-nav p-8 rounded-md shadow-md border-2 border-x-gray-600"> 
        <h2 className="text-2xl text-center font-bold mb-6">Modificar Servicio</h2> 

        <div className="mb-4"> 
            <ThemeProvider theme={TextFieldTheme}>
                <TextField 
                label="Nombre del Servicio" 
                variant="outlined"
                fullWidth
                {...register('name')} 
                error={!!errors.name}
                helperText={errors.name?.message}
                />
            </ThemeProvider>
        </div>

        <div className="mb-4"> 
            <ThemeProvider theme={TextFieldTheme}>
            <TextField 
                label="Precio del Servicio" 
                variant="outlined"
                fullWidth
                type="number" 
                {...register('servicePrice')} 
                error={!!errors.servicePrice}
                helperText={errors.servicePrice?.message}  
                />
            </ThemeProvider>
        </div>

        <button 
            type="button" 
            onClick={() => setIsProductTableVisible(true)} 
            className="bg-gray-600 text-white px-4 py-2 rounded transition ease-in-out delay-150 hover:scale-110 hover:bg-blue-700 duration-300" 
        > 
            Seleccionar Productos 
        </button>

        {/* Lista de productos seleccionados */}
        <SelectedTableProducts
          selectedProducts={selectedProducts}
          handleQuantityChange={handleQuantityChange}
          setSelectedProducts={setSelectedProducts }
          servicePrice={servicePrice}
        />

        {isErrorProducts && <Notification message='Error al cargar productos!' /> }
        {isError && <Notification message='Error al cargar el Servicio!' /> }
        
        <div className="flex justify-between mt-6"> 
            <button 
                type="submit" 
                className="bg-orange-600 text-white px-8 py-2 rounded transition ease-in-out delay-150 hover:scale-110 hover:bg-orange-700 duration-300" 
            > 
                Modificar Servicio 
            </button> 
            <CloseButton onClose={() => onClose()}></CloseButton>
            </div>
        </form>
        )}
    </div>
    );
};
