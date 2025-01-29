import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ProviderSchema } from 'src/utils/validation.zod';
import { useUpdateProviderMutation } from 'src/redux/services/providersApi'; 
import { CloseButton } from 'src/components/Common/Buttons/CloseButton';
import { Button, Input } from '@nextui-org/react';
import { toast } from 'react-toastify';


type FormProviderProps = {
  onClose: () => void;
  provider: Provider; 
};

export const ProviderUpdateForm = ({
  onClose,
  provider,
}: FormProviderProps) => {
  const { register, handleSubmit, formState: { errors } } = useForm<Provider>({
    resolver: zodResolver(ProviderSchema),
    defaultValues: {
      _id: provider._id,
      id_card: provider.id_card,
      name: provider.name,
      contactName: provider.contactName,
      email: provider.email,
      phone: provider.phone,
      address: provider.address,
    }
  });

  const [updateProvider, { isError, isLoading }] = useUpdateProviderMutation();

  const onSubmit: SubmitHandler<Provider> = async (data) => {
    await updateProvider({
      ...data,
      _id: provider._id
    }).unwrap();
    onClose();
    toast.success('Preveedor Modificado Exitosamente!')
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-lg mx-auto bg-[#101010] p-8 rounded-xl shadow-md">
        <h2 className="text-2xl text-center font-bold mb-6">Modificar Proveedor</h2>   

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
            label="Nombre de Contacto" 
            {...register('contactName')} 
            variant="underlined"
            fullWidth
            type="text" 
            errorMessage={errors.contactName?.message} 
            isInvalid={!!errors.contactName} 
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
            variant='solid'
            color='warning'
            isLoading={isLoading}
          >
            Modificar Proveedor
          </Button>

          <CloseButton onClose={() => onClose()}></CloseButton>
        </div>
        {isError && <p className='text-red-500 pt-2 text-center'>Hubo un error al actualizar el proveedor</p>}
      </form>
    </div>
  );
};
