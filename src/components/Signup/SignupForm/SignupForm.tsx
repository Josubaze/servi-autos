'use client';

import Image from 'next/image';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { UserSchema } from 'src/utils/validation.zod';
import { useCreateUserMutation } from 'src/redux/services/usersApi';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export const SignupForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<UserSinId>({
   resolver: zodResolver(UserSchema),
  });
  const [isLoading, setIsLoading] = useState(false);
  const [ createUser, {isError} ] = useCreateUserMutation();
  const router = useRouter();

  const onSubmit: SubmitHandler<UserSinId> = async (data) => {
    setIsLoading(true);
    await createUser(data).unwrap();
    router.push('/login'); 
    setIsLoading(false);
  };

  return (
    <div className="flex flex-grow flex-col justify-center px-6 py-6 md:py-40 lg:pt-16 lg:pb-20 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <div className="flex flex-shrink-0 items-center">
          <Image
            src="/svg/gear-icon.svg"
            alt="Tools"
            width={400} 
            height={400} 
            className="mx-auto h-22 md:h-44 w-auto"
          />
        </div>
        <h2 className="text-center pb-2 text-2xl font-bold leading-9 tracking-tight ring-gray-300 xl:text-4xl">
          Registrar cuenta
        </h2>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-2" onSubmit={handleSubmit(onSubmit)}>
          {/* Nombre de usuario */}
          <div>
            <label htmlFor="username" className="block text-sm font-medium leading-6 ring-gray-300 xl:text-xl">
              Nombre de usuario
            </label>
            <div className="mt-2">
              <input
                id="username"
                placeholder="Ej. Fernan"
                {...register('username')}
                className="block w-full rounded-md px-3 py-1.5 pl-1.5 text-gray-900 focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-indigo-600 sm:text-sm sm:leading-6 xl:py-2 xl:text-xl"
              />
              {errors.username?.message && <p className="text-red-500 pt-2 text-sm">{errors.username.message}</p>}
            </div>
          </div>

          {/* Correo Electrónico */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium leading-6 ring-gray-300 xl:text-xl">
              Correo Electrónico
            </label>
            <div className="mt-2">
              <input
                id="email"
                placeholder="Anafer@example.com"
                {...register('email')}
                className="block w-full rounded-md px-3 py-1.5 pl-1.5 text-gray-900 focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-indigo-600 sm:text-sm sm:leading-6 xl:py-2 xl:text-xl"
              />
              {errors.email?.message && <p className="text-red-500 pt-2 text-sm">{errors.email.message}</p>}
            </div>
          </div>

          {/* Contraseña */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium leading-6 ring-gray-300 xl:text-xl">
              Contraseña
            </label>
            <div className="mt-2">
              <input
                id="password"
                type="password"
                placeholder="adakk125#1"
                {...register('password')}
                className="block w-full rounded-md px-3 py-1.5 pl-1.5 text-gray-900 focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-indigo-600 sm:text-sm sm:leading-6 xl:py-2 xl:text-xl"
              />
              {errors.password?.message && <p className="text-red-500 pt-2 text-sm">{errors.password.message}</p>}
            </div>
          </div>

          {/* Rol */}
          <div>
            <label htmlFor="role" className="block text-sm font-medium leading-6 ring-gray-300 xl:text-xl">
              Rol
            </label>
            <div className="mt-2">
              <select
                id="role"
                {...register('role')}
                className="block w-full rounded-md px-3 py-1.5 pl-1.5 text-gray-900 focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-indigo-600 sm:text-sm sm:leading-6 xl:py-2 xl:text-xl"
              >
                <option value="administrador">Administrador</option>
                <option value="lider">Líder de equipo</option>
              </select>
              {errors.role?.message && <p className="text-red-500 pt-2 text-sm">{errors.role.message}</p>}
            </div>
          </div>

          {/* Pregunta y Respuesta secreta */}
          <div className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label htmlFor="secret-question" className="block text-sm font-medium leading-6 ring-gray-300 xl:text-xl">
                Pregunta Secreta
              </label>
              <div className="mt-2">
                <input
                  id="secret-question"
                  placeholder="¿Nombre de tu mascota?"
                  {...register('secret_question')}
                  className="block w-full rounded-md px-3 py-1.5 pl-1.5 text-gray-900 focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-indigo-600 sm:text-sm sm:leading-6 xl:py-2 xl:text-xl placeholder:text-sm"
                />
                {errors.secret_question?.message && <p className="text-red-500 pt-2 text-sm">{errors.secret_question.message}</p>}
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="secret-answer" className="block text-sm font-medium leading-6 ring-gray-300 xl:text-xl">
                Respuesta
              </label>
              <div className="mt-2">
                <input
                  id="secret-answer"
                  placeholder="Neron"
                  {...register('secret_answer')}
                  className="block w-full rounded-md px-3 py-1.5 pl-1.5 text-gray-900 focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-indigo-600 sm:text-sm sm:leading-6 xl:py-2 xl:text-xl"
                />
                {errors.secret_answer?.message && <p className="text-red-500 pt-2 text-sm">{errors.secret_answer.message}</p>}
              </div>
            </div>
          </div>

          {/* Botón de registro */}
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex items-center justify-center bg-indigo-600 mt-4 py-1.5 lg:py-2 text-sm font-semibold text-white rounded-md shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 xl:text-xl transition ease-in-out ${
                isLoading ? 'cursor-not-allowed opacity-50' : ''
              }`}
            >
              {isLoading && (
                <svg className="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                </svg>
              )}
              {isLoading ? 'Procesando...' : 'Registrar'}
            </button>
          </div>
          {isError && <p className='text-red-500 pt-2 text-center'>Ocurrió un error al tratar de registrar el usuario</p>} 
        </form>
      </div>
    </div>
  );
};
