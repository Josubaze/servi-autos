import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ProductSchema } from 'src/utils/validation.zod';
import { useUpdateProductMutation } from 'src/redux/services/productsApi';
import { CloseButton } from 'src/components/Common/Buttons/CloseButton';
import { Button, Input } from '@nextui-org/react';
import { toast } from 'react-toastify';

type FormProductProps = {
  onClose: () => void;
  product: Product; // El producto seleccionado para editar
};

export const UpdateProductForm = ({
  onClose,
  product,
}: FormProductProps) => {
  const { register, handleSubmit, formState: { errors }, watch, setValue, clearErrors} = useForm<Product>({
    resolver: zodResolver(ProductSchema),
    defaultValues: {
      _id: product._id,
      name: product.name,
      vehicleType: product.vehicleType,
      description: product.description,
      category: product.category,
      quantity: product.quantity,
      price: product.price,
    }
  });

  const [updateProduct, { isError, isLoading}] = useUpdateProductMutation();

  const onSubmit: SubmitHandler<Product> = async (data) => {
    await updateProduct( { ...data, _id: product._id } ).unwrap();
    onClose();
    toast.success('Producto Modificado exitosamente!')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-lg mx-auto bg-[#101010] p-8 rounded-xl shadow-md">
        <h2 className="text-2xl text-center font-bold mb-6">Modificar Producto</h2>
        <div className="mb-4">
          <Input 
              label="Nombre" 
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
              label="Modelo de Vehículo" 
              {...register('vehicleType')} 
              variant="underlined"
              fullWidth
              type="text" 
              errorMessage={errors.vehicleType?.message} 
              isInvalid={!!errors.vehicleType} 
            />
        </div>

        <div className="mb-4">
            <Input 
                label="Descripción" 
                {...register('description')} 
                variant="underlined"
                fullWidth
                type="text" 
                errorMessage={errors.description?.message} 
                isInvalid={!!errors.description}  
              />
        </div>
        
        <div className="mb-4">
            <Input 
                label="Categoría" 
                {...register('category')} 
                variant="underlined"
                fullWidth
                type="text" 
                errorMessage={errors.category?.message}
                isInvalid={!!errors.category} 
              />
        </div>
        
        <div className="mb-4">
        <Input
          label="Cantidad" 
          value={watch("quantity") !== undefined ? Number(watch("quantity")).toLocaleString("de-DE", { minimumFractionDigits: 0 }) : ""}
          variant="underlined"
          fullWidth
          onChange={(e) => {
            const value = e.target.value.replace(/\./g, "").replace(/,/g, "");
            const numericValue = parseInt(value, 10);
          
            if (!isNaN(numericValue) && numericValue >= 1) {
              setValue("quantity", numericValue); // Se actualiza el valor solo si es válido
              clearErrors("quantity"); // Se limpia el error solo si es válido
            }
          }}
          style={{ textAlign: "right" }}
          type="text"
          inputMode="numeric"
          errorMessage={errors.quantity?.message}
          isInvalid={!!errors.quantity} 
        />
        </div>

        <div className="mb-4">
          <Input 
                label="Precio" 
                variant="underlined"
                fullWidth
                value={watch("price") !== undefined ? Number(watch("price")).toLocaleString("de-DE", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }) : ""}
                onChange={(e) => {
                  const inputValue = e.target.value.replace(/\./g, "").replace(/,/g, "");
                  const numericValue = parseInt(inputValue || "0", 10);
                  const adjustedValue = numericValue / 100;
                  setValue("price", adjustedValue); 
                  if (!isNaN(adjustedValue) && adjustedValue > 0) {
                    clearErrors("price"); // Limpia el error si el valor es válido
                  }
                }}
                style={{ textAlign: "right" }}
                type="text"
                inputMode="numeric"
                errorMessage={errors.price?.message}
                isInvalid={!!errors.price} 
            />
        </div>

        <div className="flex items-center justify-between">
          <Button
            type="submit"
            variant='solid'
            color='warning'
            isLoading={isLoading}
          >
            Modificar Producto
          </Button>

          <CloseButton onClose={() => onClose()}></CloseButton>
        </div>
        {isError && <p className='text-red-600 pt-2 text-center'>Hubo un error al actualizar el producto</p>}
      </form>
    </div>
  );
};
