import { SectionTitle } from "src/components/Common/SectionTitle";
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { UserSchema } from 'src/utils/validation.zod'; // Asegúrate de tener un esquema Zod para validación
import { Button, Input } from '@nextui-org/react';
import { toast } from 'react-toastify';
import { useUpdateUserMutation } from 'src/redux/services/usersApi';

type FormUserProps = {
  user: User; // Asegúrate de que esta sea la interfaz correcta
};

export const ProfileForm = ({
  user,
}: FormUserProps) => {
  const { register, handleSubmit, formState: { errors } } = useForm<User>({
    resolver: zodResolver(UserSchema),
    defaultValues: {
      _id: user._id,
      username: user.username,
      email: user.email,
      password: '', // No se pre-llena la contraseña por razones de seguridad
      secret_question: user.secret_question,
      secret_answer: '',
    }
  });

  const [updateUser, { isError, isLoading }] = useUpdateUserMutation();

  const onSubmit: SubmitHandler<User> = async (data) => {
    const { _id, ...updatedData } = data;
    await updateUser({ id: _id, updatedData }).unwrap();
    toast.success('Usuario Modificado exitosamente!');
  };

  return (
    <div className="bg-transparent p-4">
      <SectionTitle>ACTULIZAR DATOS</SectionTitle>
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-lg mx-auto">
        <div className="mb-4">
          <Input 
            label="Nombre de Usuario" 
            {...register('username')} 
            variant="underlined"
            fullWidth
            type="text" 
            errorMessage={errors.username?.message}  
            isInvalid={!!errors.username}
          />
        </div>

        <div className="mb-4">
          <Input 
            label="Correo Electrónico" 
            {...register('email')} 
            variant="underlined"
            fullWidth
            type="email" 
            errorMessage={errors.email?.message}  
            isInvalid={!!errors.email}
          />
        </div>

        <div className="mb-4">
          <Input 
            label="Nueva Contraseña" 
            {...register('password')} 
            variant="underlined"
            fullWidth
            type="password" 
            errorMessage={errors.password?.message}  
            isInvalid={!!errors.password}
          />
        </div>

        <div className="mb-4">
          <Input 
            label="Pregunta Secreta" 
            {...register('secret_question')} 
            variant="underlined"
            fullWidth
            type="text" 
            errorMessage={errors.secret_question?.message}  
            isInvalid={!!errors.secret_question}
          />
        </div>

        <div className="mb-4">
          <Input 
            label="Respuesta Secreta" 
            {...register('secret_answer')} 
            variant="underlined"
            fullWidth
            type="text" 
            errorMessage={errors.secret_answer?.message}  
            isInvalid={!!errors.secret_answer}
          />
        </div>

        <div className="flex items-center justify-between">
          <Button
            type="submit"
            variant="solid"
            color="success"
            isLoading={isLoading}
            fullWidth
          >
            Modificar Usuario
          </Button>
        </div>

        {isError && <p className="text-red-500 pt-2 text-center">Hubo un error al actualizar el usuario</p>}
      </form>
    </div>
  );
};
