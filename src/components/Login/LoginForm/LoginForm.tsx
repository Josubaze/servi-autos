'use client'

import { useFormState } from "react-dom"
import { signIn } from "next-auth/react";
import { loginSchema } from "src/utils/validation.zod";
import {useRouter} from 'next/navigation'
import { z } from "zod"
import { useEffect } from "react";
import Image from 'next/image'

const initialState = {
  errors: [],
  shouldRedirect: false,
}; 

const Login = async (prevState: any, formData: FormData) => {
  try {
    const parsedData = loginSchema.parse({
      email: formData.get('email'),
      password: formData.get('password')
      });
  
      const res = await signIn("credentials", {
      email: parsedData.email,
      password: parsedData.password,
      redirect: false,
    }) 

    if (!res?.ok) {
      let errorMessage = res?.error|| "Ha ocurrido un error";
      throw new Error(errorMessage)
    } else {
      return { ...prevState, shouldRedirect: true };
    }
    
  } catch (error) {
    let errorMessage = "Ha ocurrido un error";
    if (error instanceof z.ZodError) {{
      return {
          errors: error.errors.map((err) => {
              return {
                  field: err.path.join('.'),
                  message: err.message
              } 
          })
      }
  }}
    if(error instanceof Error) {
      errorMessage = `${error.message}`;       
      return {
        error: errorMessage
      } 
    }
}
}

export const LoginForm = () => {
  const router = useRouter();
  const [ status, formAction ] = useFormState(Login, initialState);
  useEffect(() => {
    if (status.shouldRedirect) {
      router.push('/dashboard');
      router.refresh();
    }
  }, [status.shouldRedirect, router]);

  return (
    <>
      <div className="flex flex-grow flex-col justify-center  px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <div className="flex flex-shrink-0 items-center">
            <Image
              src="svg/logo.svg"
              alt="Your Company"
              width={500} 
              height={500} 
              className="mx-auto "
            />
          </div>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" action={formAction}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium leading-6 ring-gray-300 xl:text-xl">
                Correo Electrónico
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="block w-full rounded-md border-0 py-1.5 pl-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 xl:text-xl"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium leading-6 ring-gray-300 xl:text-xl">
                  Contraseña
                </label>
                <div className="text-sm">
                  <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500 xl:text-lg">
                  ¿Olvidaste la contraseña?
                  </a>
                </div>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  //pattern= "^[A-Za-z0-9]{8,40}$"
                  className="block w-full rounded-md border-0 py-1.5 pl-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 xl:text-xl"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 xl:text-xl"
              >
                Iniciar Sesión
              </button>
            </div>
            {status?.errors ? status.errors.map((error: any, index: number) => <p className="text-sm text-center" key={`${error.message}-${index}`}>{error.message}</p>) : null}
            {status?.error ? <p className="text-sm text-center">{ status.error }</p> : null	} 
          </form>
          <p className="mt-10 text-center text-sm text-gray-500 xl:text-lg">
            No eres miembro?{' '}
            <a href="/signup" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
            Registrate aquí!
            </a>
          </p>  
        </div>
      </div>
    </>
  );
}