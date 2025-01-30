
import { SectionTitle } from "src/components/Common/SectionTitle";
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CustomerSchema } from 'src/utils/validation.zod'; 
import { Button, Input } from "@nextui-org/react";
import { toast } from "react-toastify";
import { useCreateCustomerMutation } from "src/redux/services/customersApi";


export const QuickAddClient = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<Company>({
    resolver: zodResolver(CustomerSchema),
  });
  const [createCustomer, { isError, isLoading }] = useCreateCustomerMutation();
  
  const onSubmit: SubmitHandler<Omit<Customer, '_id'>> = async (data) => {
    await createCustomer(data).unwrap();
    toast.success('Cliente Creado exitosamente!')
  };
  return (
    <div className="bg-black-nav/50 rounded-xl p-4 mt-4">
    <SectionTitle > AGREGAR CLIENTE </SectionTitle>
    <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-lg pt-2 mx-auto ">
        <div className="mb-4">
          <Input 
              label="Cédula | RIF" 
              variant="underlined"
              fullWidth
              {...register('id_card')}
              isInvalid={!!errors.name}
              errorMessage={errors.name?.message} 
            />
        </div>

        <div className="mb-4">
          <Input
            label="Nombre"
            variant="underlined"
            fullWidth
            {...register('name')}
            isInvalid={!!errors.name}
            errorMessage={errors.name?.message}
          />
        </div>

        <div className="mb-4">
          <Input 
              label="Correo Electrónico" 
              variant="underlined"
              fullWidth
              {...register('email')}
              isInvalid={!!errors.email}
              errorMessage={errors.email?.message}
            />
        </div>
        
        <div className="mb-4">
          <Input 
            label="Telefono" 
            variant="underlined"
            fullWidth
            {...register('phone')}
            isInvalid={!!errors.phone}
            errorMessage={errors.phone?.message}  
          />
        </div>

        <div className="mb-4">
          <Input 
            label="Dirección" 
            variant="underlined"
            fullWidth
            {...register('address')}
            isInvalid={!!errors.address}
            errorMessage={errors.address?.message}  
          />
        </div>
        <div className="flex items-center justify-between">
          <Button
              color="success"
              variant="solid"
              fullWidth
              isLoading={isLoading}
              type="submit"
          >
              Agregar
          </Button>
        
        </div>
        {isError && <p className='text-red-500 pt-2 text-center'>Hubo un error al tratar de agregar cliente</p>}
      </form>
  </div>
  );
}

