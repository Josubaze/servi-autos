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
import { Button, Input } from '@nextui-org/react';
import { toast } from 'react-toastify';

type FormServiceProps = {
  onClose: () => void;
  service: Service; // Servicio seleccionado para editar
};

export const UpdateServiceForm = ({ onClose, service }: FormServiceProps) => {
  const { register, handleSubmit, formState: { errors }, watch, setValue, clearErrors } = useForm<Omit<Service, '_id'>>({
    resolver: zodResolver(ServiceSchema),
    defaultValues: {
      name: service.name,
      servicePrice: service.servicePrice,
      products: service.products,
    },
  });

  const { data: productsData = [], isError: isErrorProducts , isFetching, isLoading, isSuccess } = useGetProductsQuery();
  const [updateService, { isError, isLoading: isLoadingUpdate }] = useUpdateServiceMutation();
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
    toast.success('Modificado Exitosamente!'); 
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md">
        {isProductTableVisible ? (
          <SelectProducts 
            data={productsData}
            isError={isErrorProducts}
            isFetching={isFetching}
            isSuccess={isSuccess}
            isLoading={isLoading}
            onAddProduct={handleProductSelect}
            onCloseTable={() => setIsProductTableVisible(false)}
          />
        ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-full  md:max-w-2xl lg:max-w-3xl mx-auto bg-[#101010] p-8 rounded-xl"> 
          <h2 className="text-2xl text-center font-bold mb-6">Modificar Servicio</h2> 

          <div className="mb-4"> 
              <Input 
                label="Nombre del Servicio" 
                {...register('name')} 
                variant="underlined"
                fullWidth
                type="text" 
                errorMessage={errors.name?.message}
                isInvalid={!!errors.name}
              />
            </div>


            <div className="mb-4"> 
              <Input 
                label="Precio del Servicio"  
                variant="underlined"
                fullWidth
                value={watch("servicePrice") !== undefined ? Number(watch("servicePrice")).toLocaleString("de-DE", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }) : "0,00"}
                onChange={(e) => {
                  const inputValue = e.target.value.replace(/\./g, "").replace(/,/g, "");
                  const numericValue = parseInt(inputValue || "0", 10);
                  const adjustedValue = numericValue / 100;
                  setValue("servicePrice", adjustedValue); 
                  if (!isNaN(adjustedValue) && adjustedValue > 0) {
                    clearErrors("servicePrice"); // Limpia el error si el valor es válido
                  }
                }}             
                style={{ textAlign: "right" }}
                type="text"
                inputMode="numeric"
                errorMessage={errors.servicePrice?.message}
                isInvalid={!!errors.servicePrice}
              />
            </div>
          

            <Button
              type="button"
              variant="solid"
              color='default'
              isLoading={isLoading}
              onClick={() => setIsProductTableVisible(true)} 
            >
              Cargar Producto
            </Button>

            {/* Lista de productos seleccionados */}
            <SelectedTableProducts
              selectedProducts={selectedProducts}
              handleQuantityChange={handleQuantityChange}
              setSelectedProducts={setSelectedProducts }
              servicePrice={servicePrice}
            />

            {isErrorProducts && toast.error('Error al cargar productos!')}
            {isError && toast.error('Error al cargar el Servicio!')}
            
            <div className="flex justify-between mt-6"> 
              <Button
                type="submit"
                variant="solid"
                color='warning'
                isLoading={isLoadingUpdate}
              >
                Modificar Servicio  
              </Button>
              <CloseButton onClose={() => onClose()}></CloseButton>
            </div>
        </form>
        )}
    </div>
    );
};
