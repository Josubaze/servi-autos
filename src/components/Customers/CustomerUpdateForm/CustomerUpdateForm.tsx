import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CustomerSchema } from 'src/utils/validation.zod'; 
import { useUpdateCustomerMutation } from 'src/redux/services/customersApi'; 
import TextField from '@mui/material/TextField';
import {  ThemeProvider } from "@mui/material/styles";
import { TextFieldTheme } from 'src/styles/themes/themeTextField';
import { CloseButton } from 'src/components/Common/Buttons/CloseButton';


type FormCustomerProps = {
  onClose: () => void;
  customer: Customer; 
};

export const CustomerUpdateForm = ({
  onClose,
  customer,
}: FormCustomerProps) => {
  const { register, handleSubmit, formState: { errors } } = useForm<Customer>({
    resolver: zodResolver(CustomerSchema),
    defaultValues: {
      _id: customer._id,
      id_card: customer.id_card,
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
    }
  });

  const [updateCustomer, { isError }] = useUpdateCustomerMutation();

  const onSubmit: SubmitHandler<Customer> = async (data) => {
    await updateCustomer({ ...data, _id: customer._id }).unwrap();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-lg mx-auto bg-black-nav p-8 rounded-md shadow-md border-2 border-x-gray-600">
        <h2 className="text-2xl text-center font-bold mb-6">Modificar Cliente</h2>

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
                label="Telefono" 
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
            className="bg-orange-600 text-white px-4 py-2 rounded transition ease-in-out delay-150 hover:scale-90 hover:bg-orange-700 duration-300"
          >
            Modificar Cliente
          </button>

          <CloseButton onClose={() => onClose()}></CloseButton>
        </div>
        {isError && <p className='text-red-500 pt-2 text-center'>Hubo un error al actualizar el cliente</p>}
      </form>
    </div>
  );
};
