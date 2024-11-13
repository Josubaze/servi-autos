import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ProductSchema } from 'src/utils/validation.zod';
import { useUpdateProductMutation } from 'src/redux/services/productsApi';
import TextField from '@mui/material/TextField';
import {  ThemeProvider } from "@mui/material/styles";
import { TextFieldTheme } from 'src/styles/themes/themeTextField';
import { CloseButton } from 'src/components/Common/Buttons/CloseButton';

type FormProductProps = {
  onClose: () => void;
  product: Product; // El producto seleccionado para editar
};

export const UpdateProductForm = ({
  onClose,
  product,
}: FormProductProps) => {
  const { register, handleSubmit, formState: { errors } } = useForm<Product>({
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

  const [updateProduct, { isError }] = useUpdateProductMutation();

  const onSubmit: SubmitHandler<Product> = async (data) => {
    await updateProduct( { ...data, _id: product._id } ).unwrap();
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-lg mx-auto bg-black-nav p-8 rounded-md shadow-md border-2 border-x-gray-600 ">
        <h2 className="text-2xl text-center font-bold mb-6">Modificar Producto</h2>
        <div className="mb-4">
          <ThemeProvider theme={TextFieldTheme}>
            <TextField 
              label="ID" 
              variant="outlined"
              fullWidth
              type="text" 
              {...register('_id')} 
              error={!!errors._id}
              helperText={errors._id?.message}
              InputProps={{
                readOnly: true,
              }}
            />
          </ThemeProvider>
        </div>

        <div className="mb-4">
          <ThemeProvider theme={TextFieldTheme}>
            <TextField 
                label="Nombre" 
                variant="outlined"
                fullWidth
                type="text" 
                {...register('name')} 
                error={!!errors.name}
                helperText={errors.name?.message}  
              />
          </ThemeProvider>
        </div>

        <div className="mb-4">
          <ThemeProvider theme={TextFieldTheme}>
            <TextField 
                label="Modelo de Vehículo" 
                variant="outlined"
                fullWidth
                type="text" 
                {...register('vehicleType')} 
                error={!!errors.vehicleType}
                helperText={errors.vehicleType?.message}  
              />
          </ThemeProvider>
        </div>

        <div className="mb-4">
          <ThemeProvider theme={TextFieldTheme}>
            <TextField 
                label="Descripción" 
                variant="outlined"
                fullWidth
                type="text" 
                {...register('description')} 
                error={!!errors.description}
                helperText={errors.description?.message}  
              />
          </ThemeProvider>
        </div>
        
        <div className="mb-4">
          <ThemeProvider theme={TextFieldTheme}>
            <TextField 
                label="Categoría" 
                variant="outlined"
                fullWidth
                type="text" 
                {...register('category')} 
                error={!!errors.category}
                helperText={errors.category?.message}  
              />
          </ThemeProvider>
        </div>
        
        <div className="mb-4">
          <ThemeProvider theme={TextFieldTheme}>
            <TextField 
                label="Cantidad" 
                variant="outlined"
                fullWidth
                type="number" 
                {...register('quantity')} 
                error={!!errors.quantity}
                helperText={errors.quantity?.message}  
              />
          </ThemeProvider>
        </div>

        <div className="mb-4">
          <ThemeProvider theme={TextFieldTheme}>
            <TextField 
                label="Precio" 
                variant="outlined"
                fullWidth
                type="number" 
                {...register('price')} 
                error={!!errors.price}
                helperText={errors.price?.message}  
              />
          </ThemeProvider>
        </div>

        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-orange-600 text-white px-4 py-2 rounded transition ease-in-out delay-150 hover:scale-90 hover:bg-orange-700 duration-300"
          >
            Modificar Producto
          </button>

          <CloseButton onClose={() => onClose()}></CloseButton>
        </div>
        {isError && <p className='text-red-600 pt-2 text-center'>Hubo un error al actualizar el producto</p>}
      </form>
    </div>
  );
};
