import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ProviderSchema } from 'src/utils/validation.zod';
import { useCreateProviderMutation } from 'src/redux/services/providersApi';
import TextField from '@mui/material/TextField';
import {  ThemeProvider } from "@mui/material/styles";
import { TextFieldTheme } from 'src/styles/themes/themeTextField';
import { CloseButton } from 'src/components/Common/Buttons/CloseButton';

type FormProviderProps = {
  onClose: () => void;
};

export const ProviderForm = ({ onClose }: FormProviderProps) => {
  const { register, handleSubmit, formState: { errors } } = useForm<Omit<Provider, '_id'>>({
    resolver: zodResolver(ProviderSchema),
  });
  const [createProvider, { isError }] = useCreateProviderMutation();

  const onSubmit: SubmitHandler<Omit<Provider, '_id'>> = async (data) => {
    await createProvider(data).unwrap();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-lg mx-auto bg-black-nav p-8 rounded-md shadow-md border-2 border-x-gray-600">
        <h2 className="text-2xl text-center font-bold mb-6">Nuevo Proveedor</h2>

        <div className="mb-4">
          <ThemeProvider theme={TextFieldTheme}>
            <TextField 
                label="Cédula | RIF" 
                variant="outlined"
                fullWidth
                type="text" 
                {...register('id_card')} 
                error={!!errors.id_card}
                helperText={errors.id_card?.message}  
              />
          </ThemeProvider>
        </div>
        
        <div className="mb-4">
          <ThemeProvider theme={TextFieldTheme}>
            <TextField 
                label="Nombre de Proveedor" 
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
                label="Nombre de Contacto" 
                variant="outlined"
                fullWidth
                type="text" 
                {...register('contactName')} 
                error={!!errors.contactName}
                helperText={errors.contactName?.message}  
              />
          </ThemeProvider>
        </div>

        <div className="mb-4">
          <ThemeProvider theme={TextFieldTheme}>
            <TextField 
                label="Correo Electrónico" 
                variant="outlined"
                fullWidth
                type="text" 
                {...register('email')} 
                error={!!errors.email}
                helperText={errors.email?.message}  
              />
          </ThemeProvider>
        </div>
        
        <div className="mb-4">
          <ThemeProvider theme={TextFieldTheme}>
            <TextField 
                label="Teléfono"  
                variant="outlined"
                fullWidth
                type="text" 
                {...register('phone')} 
                error={!!errors.phone}
                helperText={errors.phone?.message}  
              />
          </ThemeProvider>
        </div>

        <div className="mb-4">
          <ThemeProvider theme={TextFieldTheme}>
            <TextField 
                label="Dirección"  
                variant="outlined"
                fullWidth
                type="text" 
                {...register('address')} 
                error={!!errors.address}
                helperText={errors.address?.message}  
              />
          </ThemeProvider>
        </div>

        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded transition ease-in-out delay-150 hover:scale-90 hover:bg-green-700 duration-300"
          >
            Agregar Proveedor
          </button>
      
          <CloseButton onClose={() => onClose()}></CloseButton>
        </div>
        {isError && <p className='text-red-500 pt-2 text-center'>Hubo un error al tratar de crear el proveedor</p>}
      </form>
    </div>
  );
};
