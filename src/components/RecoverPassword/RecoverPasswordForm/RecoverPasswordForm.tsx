import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { RecoverPasswordSchema } from 'src/utils/validation.zod';
import { Button, Input } from '@nextui-org/react';
import { toast } from 'react-toastify';
import { useRecoverPasswordMutation } from 'src/redux/services/recoverPassword.Api';
import { useState } from 'react';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

export const RecoverPasswordForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<User>({
    resolver: zodResolver(RecoverPasswordSchema),
    defaultValues: {
      email: '',
      password: '',
      repeatedPassword: '',
      secret_question: '',
      secret_answer: '',
    },
  });

  const [recoverPassword, { isLoading }] = useRecoverPasswordMutation();
  const router = useRouter();
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
        email: data.email,
        password: data.password,
        secret_question: data.secret_question,
        secret_answer: data.secret_answer,
      };
      console.log(updatedData);
      await recoverPassword(updatedData).unwrap();
      router.push('/login');
      toast.success('Contraseña actualizada exitosamente!');
    } catch (error: any) {
      toast.error(error.message || 'Los datos ingresados no son correctos');
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto rounded-lg p-4">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <Input
            size='lg'
            label="Correo Electrónico"
            {...register('email')}
            variant="bordered"
            fullWidth
            type="text"
            errorMessage={errors.email?.message}
            isInvalid={!!errors.email}
          />
        </div>

        <div className="mb-4">
          <Input
            size='lg'
            label="Nueva Contraseña"
            {...register('password')}
            variant="bordered"
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
            size='lg'
            label="Repetir Nueva Contraseña"
            {...register('repeatedPassword')}
            variant="bordered"
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
            size='lg'
            label="Pregunta Secreta"
            {...register('secret_question')}
            variant="bordered"
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
            size='lg'
            label="Respuesta Secreta"
            {...register('secret_answer')}
            variant="bordered"
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
            size='lg'
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
