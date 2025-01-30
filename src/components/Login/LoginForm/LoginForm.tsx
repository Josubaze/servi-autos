import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginSchema } from 'src/utils/validation.zod';

export const LoginForm = () => {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors }, setError } = useForm<LoginFormValues>({
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
      setError('password', { message: res?.error || "Error en el inicio de sesión" });
    } else {
      router.push('/dashboard');
      router.refresh();
    }
    setIsLoading(false); 
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium leading-6 xl:text-xl">
          Correo Electrónico
        </label>
        <div className="mt-2">
          <input
            id="email"
            type="email"
            {...register('email')}
            className="block w-full rounded-md px-3 py-1.5 pl-1.5 focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-indigo-600 sm:text-sm sm:leading-6 xl:py-2 xl:text-xl"
          />
          {errors.email?.message && <p className="text-red-500 pt-2 text-sm lg:text-lg">{errors.email.message}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium leading-6 xl:text-xl">
          Contraseña
        </label>
        <div className="mt-2">
          <input
            id="password"
            type="password"
            {...register('password')}
            className="block w-full rounded-md px-3 py-1.5 pl-1.5 focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-indigo-600 sm:text-sm sm:leading-6 xl:py-2 xl:text-xl"
          />
          {errors.password?.message && <p className="text-red-500 pt-2 text-sm lg:text-lg">{errors.password.message}</p>}
        </div>
      </div>

      <div>
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full flex items-center justify-center bg-indigo-600 py-1.5 lg:py-2 text-sm font-semibold text-white rounded-md shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 xl:text-xl transition ease-in-out ${
            isLoading ? 'cursor-not-allowed opacity-50' : ''
          }`}
        >
          {isLoading && (
            <svg className="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
            </svg>
          )}
          {isLoading ? 'Procesando...' : 'Iniciar Sesión'}
        </button>
      </div>
    </form>
  );
};
