import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { UpdatePasswordSchema } from 'src/utils/validation.zod';
import { Button, Input } from '@nextui-org/react';
import { toast } from 'react-toastify';
import { useUpdateUserMutation } from 'src/redux/services/usersApi';
import { useState } from 'react';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';

type FormUserProps = {
  user: User;
};

export const ProfileForm = ({ user }: FormUserProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<User>({
    resolver: zodResolver(UpdatePasswordSchema),
    defaultValues: {
      _id: user._id,
      username: user.username,
      password: '',
      repeatedPassword: '',
      secret_question: '',
      secret_answer: '',
    },
  });

  const [updateUser, { isLoading }] = useUpdateUserMutation();

  const [visibility, setVisibility] = useState({
    password: false,
    repeatedPassword: false,
    secret_question: false,
    secret_answer: false,
  });

  const toggleVisibility = (field: keyof typeof visibility) => {
    setVisibility((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const onSubmit: SubmitHandler<User> = async (data) => {
    try {
      const updatedData = {
        id: data._id,
        password: data.password,
        secret_question: data.secret_question,
        secret_answer: data.secret_answer,
      };
      console.log(updatedData);
      await updateUser(updatedData).unwrap();
      toast.success('Usuario modificado exitosamente!');
    } catch (error: any) {
      toast.error(error.message || 'Error al modificar el usuario');
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto bg-black-nav/50 rounded-lg p-4">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <Input
            label="Nombre de Usuario"
            {...register('username')}
            variant="underlined"
            fullWidth
            type="text"
            errorMessage={errors.username?.message}
            isInvalid={!!errors.username}
            disabled
          />
        </div>

        <div className="mb-4">
          <Input
            label="Nueva Contraseña"
            {...register('password')}
            variant="underlined"
            endContent={
              <button
                aria-label="toggle password visibility"
                className="focus:outline-none"
                type="button"
                onClick={() => toggleVisibility('password')}
              >
                {visibility.password ? <FaRegEyeSlash /> : <FaRegEye />}
              </button>
            }
            type={visibility.password ? 'text' : 'password'}
            errorMessage={errors.password?.message}
            isInvalid={!!errors.password}
          />
        </div>

        <div className="mb-4">
          <Input
            label="Repetir Nueva Contraseña"
            {...register('repeatedPassword')}
            variant="underlined"
            endContent={
              <button
                aria-label="toggle password visibility"
                className="focus:outline-none"
                type="button"
                onClick={() => toggleVisibility('repeatedPassword')}
              >
                {visibility.repeatedPassword ? <FaRegEyeSlash /> : <FaRegEye />}
              </button>
            }
            type={visibility.repeatedPassword ? 'text' : 'password'}
            errorMessage={errors.repeatedPassword?.message}
            isInvalid={!!errors.repeatedPassword}
          />
        </div>

        <div className="mb-4">
          <Input
            label="Pregunta Secreta"
            {...register('secret_question')}
            variant="underlined"
            endContent={
              <button
                aria-label="toggle visibility"
                className="focus:outline-none"
                type="button"
                onClick={() => toggleVisibility('secret_question')}
              >
                {visibility.secret_question ? <FaRegEyeSlash /> : <FaRegEye />}
              </button>
            }
            type={visibility.secret_question ? 'text' : 'password'}
            errorMessage={errors.secret_question?.message}
            isInvalid={!!errors.secret_question}
          />
        </div>

        <div className="mb-4">
          <Input
            label="Respuesta Secreta"
            {...register('secret_answer')}
            variant="underlined"
            endContent={
              <button
                aria-label="toggle visibility"
                className="focus:outline-none"
                type="button"
                onClick={() => toggleVisibility('secret_answer')}
              >
                {visibility.secret_answer ? <FaRegEyeSlash /> : <FaRegEye />}
              </button>
            }
            type={visibility.secret_answer ? 'text' : 'password'}
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
            Aceptar
          </Button>
        </div>
      </form>
    </div>
  );
};
