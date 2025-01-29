import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CustomerSchema } from 'src/utils/validation.zod';
import { useCreateCustomerMutation } from 'src/redux/services/customersApi';
import { CloseButton } from 'src/components/Common/Buttons/CloseButton';
import { toast } from 'react-toastify';
import { Button, Input } from '@nextui-org/react';

type FormCustomerProps = {
  onClose: () => void;
};

export const CustomerForm = ({
  onClose,
}: FormCustomerProps) => {
  const { register, handleSubmit, formState: { errors } } = useForm<Omit<Customer, '_id'>>({
    resolver: zodResolver(CustomerSchema),
  });
  const [createCustomer, { isError, isLoading }] = useCreateCustomerMutation();

  const onSubmit: SubmitHandler<Omit<Customer, '_id'>> = async (data) => {
    await createCustomer(data).unwrap();
    onClose();
    toast.success('Cliente Creado exitosamente!')
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-lg mx-auto bg-[#101010] p-8 rounded-xl shadow-md">
        <h2 className="text-2xl text-center font-bold mb-6">Nuevo Cliente</h2>
        
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
            label="Cédula | RIF"
            {...register('id_card')} 
            variant="underlined"
            fullWidth
            type="text" 
            errorMessage={errors.id_card?.message} 
            isInvalid={!!errors.id_card}  
          />
        </div>

        <div className="mb-4">
          <Input 
            label="Correo Electrónico" 
            {...register('email')} 
            variant="underlined"
            fullWidth
            type="text" 
            errorMessage={errors.email?.message}  
            isInvalid={!!errors.email}
          />
        </div>
        
        <div className="mb-4">
          <Input 
            label="Telefono" 
            {...register('phone')} 
            variant="underlined"
            fullWidth
            type="text" 
            errorMessage={errors.phone?.message} 
            isInvalid={!!errors.phone} 
          />
        </div>

        <div className="mb-4">
          <Input 
            label="Dirección"
            {...register('address')} 
            variant="underlined"
            fullWidth
            type="text" 
            errorMessage={errors.address?.message}  
            isInvalid={!!errors.address} 
          />
        </div>
        
        <div className="flex items-center justify-between">
          <Button
            type="submit"
            variant="solid"
            color='success'
            isLoading={isLoading}
          >
            Agregar Cliente
          </Button>
      
          <CloseButton onClose={() => onClose()}></CloseButton>
        </div>
        {isError && <p className='text-red-500 pt-2 text-center'>Hubo un error al tratar de crear el cliente</p>}
      </form>
    </div>
  );
};
