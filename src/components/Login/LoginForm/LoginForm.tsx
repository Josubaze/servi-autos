import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginSchema } from 'src/utils/validation.zod';
import { Button, Input } from '@nextui-org/react';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';
import { toast } from 'react-toastify';

export const LoginForm = () => {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit: SubmitHandler<LoginFormValues> = async (data) => {
    setIsLoading(true); 
    const res = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (!res?.ok) {
      toast.error("Credenciales incorrectas!");
    } else {
      router.push('/dashboard');
      router.refresh();
    }
    setIsLoading(false); 
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium leading-6 pl-2 xl:text-xl">
          Correo Electrónico
        </label>
        <div className="mt-2">
          <Input
            size='lg'
            id="email"
            {...register('email')}
            errorMessage={errors.email?.message}
            isInvalid={!!errors.email}
            variant="bordered"
          />
        </div>
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium leading-6 pl-2 xl:text-xl">
          Contraseña
        </label>
        <div className="mt-2">
          <Input
            id="password"
            size="lg"
            {...register('password')}
            endContent={
              <button
                aria-label="toggle password visibility"
                className="focus:outline-none"
                type="button"
                onClick={toggleVisibility}
              >
                {isVisible ? <FaRegEyeSlash /> : <FaRegEye />}
              </button>
            }
            type={isVisible ? "text" : "password"}
            variant="bordered"
            errorMessage={errors.password?.message}
            isInvalid={!!errors.password}
          />
        </div>
      </div>

      <div>
        <Button
          size='lg'
          type="submit"
          isLoading={isLoading}
          className="bg-indigo-600 hover:bg-indigo-700 text-white"
          fullWidth
        >
          {isLoading ? 'Procesando...' : 'Iniciar Sesión'}
        </Button>
      </div>

    </form>
  );
};
