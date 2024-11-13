import { useState } from 'react'; 
import { useForm, SubmitHandler } from 'react-hook-form'; 
import { zodResolver } from '@hookform/resolvers/zod'; 
import { ServiceSchema } from 'src/utils/validation.zod'; 
import { useCreateServiceMutation } from 'src/redux/services/servicesApi'; 
import { TableProducts } from '../TableProducts'; 
import { useGetProductsQuery } from 'src/redux/services/productsApi'; 
import { Notification } from 'src/components/Common/Notification';
import TextField from '@mui/material/TextField';
import {  ThemeProvider } from "@mui/material/styles";
import { TextFieldTheme } from 'src/styles/themes/themeTextField';
import { CloseButton } from 'src/components/Common/Buttons/CloseButton';
import { SelectedTableProducts } from '../SelectedTableProducts';

type FormServiceProps = { onClose: () => void; };

export const ServiceForm = ({ onClose }: FormServiceProps) => { 
  const { register, handleSubmit, formState: { errors }, watch } = useForm<Omit<Service, '_id'>>({
    resolver: zodResolver(ServiceSchema),
  });
  const { data = [], isError: isErrorProducts } = useGetProductsQuery(); 
  const [createService, { isError }] = useCreateServiceMutation(); 
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]); 
  const [isProductTableVisible, setIsProductTableVisible] = useState(false); 

  const handleProductSelect = (product: Product) => { 
    if (!product.name) { 
      console.error("El producto seleccionado no tiene un 'name'"); 
    } 
    setSelectedProducts((prev) => [...prev, { ...product, quantity: 1 }]); 
    setIsProductTableVisible(false); 
  }; 

  const handleQuantityChange = (index: number, newQuantity: number) => { 
    const updatedProducts = [...selectedProducts]; 
    updatedProducts[index].quantity = newQuantity; 
    setSelectedProducts(updatedProducts);
  }; 
  const servicePrice =  Number(watch('servicePrice', 0));
  const onSubmit: SubmitHandler<Omit<Service, '_id'>> = async (data) => { 
    const formData = {
      ...data,
      products: selectedProducts.map(product => ({
        product: product._id, 
        quantity: product.quantity,
      })),
    };
    await createService(formData).unwrap();
    onClose();
  };

  return ( 
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md"> 
      {isProductTableVisible ? ( 
        <TableProducts 
          data={data} 
          onSelectProduct={handleProductSelect} 
          onCloseTable={() => setIsProductTableVisible(false)} 
        /> 
      ) : ( 
        <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-full  md:max-w-2xl lg:max-w-3xl mx-auto bg-black-nav p-8 rounded-md shadow-md border-2 border-x-gray-600"> 
          <h2 className="text-2xl text-center font-bold mb-6">Nuevo Servicio</h2> 

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
            className="bg-gray-600 text-white px-4 py-2 rounded transition ease-in-out delay-150 hover:scale-90 hover:bg-blue-700 duration-300" 
          > 
            Seleccionar Productos 
          </button>

          {/* Lista de productos seleccionados */}
          <SelectedTableProducts
              selectedProducts={selectedProducts}
              handleQuantityChange={handleQuantityChange}
              setSelectedProducts={setSelectedProducts}
              servicePrice={servicePrice}
          />

          {isErrorProducts && <Notification message='Error al cargar productos!' /> }
          {isError && <Notification message='Error al cargar el Servicio!' /> }
          <div className="flex justify-between mt-6"> 
            <button 
              type="submit" 
              className="bg-green-600 text-white px-11 py-2 rounded transition ease-in-out delay-150 hover:scale-90 hover:bg-green-700 duration-300" 
            > 
              Crear Servicio 
            </button> 
            <CloseButton onClose={() => onClose()}></CloseButton>
          </div>
        </form> 
      )} 
    </div> 
  ); 
};
