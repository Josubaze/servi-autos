
import { SectionTitle } from "src/components/Common/SectionTitle";
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CompanySchema, CustomerSchema } from 'src/utils/validation.zod'; 
import { useUpdateCustomerMutation } from 'src/redux/services/customersApi'; 
import TextField from '@mui/material/TextField';
import {  ThemeProvider } from "@mui/material/styles";
import { TextFieldTheme } from 'src/styles/themes/themeTextField';
import { CloseButton } from 'src/components/Common/Buttons/CloseButton';
import { useGetCompanyQuery } from "src/redux/services/company.Api";


export const QuickAddClient = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<Company>({
    resolver: zodResolver(CompanySchema),
  });

  const onSubmit: SubmitHandler<Customer> = async (data) => {

  };
  return (
    <div className="bg-black-nav rounded-xl p-4 mt-4">
    <SectionTitle > Agregar Cliente </SectionTitle>
    <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-lg pt-2 mx-auto bg-black-nav rounded-md ">
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
            className="bg-green-600 text-white px-4 py-2 w-full rounded-full transition ease-in-out delay-150 hover:scale-90 hover:bg-green-700 duration-300"
          >
            Agregar Cliente
          </button>
        
        </div>
        {/* {isErrorUpdate && <p className='text-red-500 pt-2 text-center'>Hubo un error al actualizar la Empresa</p>} */}

      </form>
  </div>
  );
}

