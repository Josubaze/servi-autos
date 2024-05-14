'use client'

import { useFormState } from "react-dom"
import { Signup } from "src/actions"

const initialState = {
  errors: [],
  errorMessage: "",
}; 
export const SignupForm = () => {
  const [ status, formAction ] = useFormState(Signup , initialState);
    return (
      <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            className="mx-auto h-28 w-auto"
            src="/svg/logo.svg"
            alt="Your Company"
          />
          <h2 className=" text-center text-2xl font-bold leading-9 tracking-tight ring-gray-300">
            Registrar cuenta
          </h2>
        </div>

        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" action={formAction} method="POST">

          <div>
              <label htmlFor="username" className="block text-sm font-medium leading-6 ring-gray-300">
                Nombre de usuario
              </label>
              <div className="mt-2">
                <input
                  id="username"
                  placeholder="Ej. Fernan"
                  name="username"
                  required
                  className="block w-full rounded-md border-0 py-1 pl-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 focus:placeholder-gray-50"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium leading-6 ring-gray-300">
                Correo Electrónico
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  placeholder="Anafer@example.com"
                  name="email"
                  //type="email"
                  autoComplete="email"
                  required
                  className="block w-full rounded-md border-0 py-1 pl-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 focus:placeholder-gray-50"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium leading-6 ring-gray-300">
                  Contraseña
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  placeholder="adakk125#1"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="block w-full rounded-md border-0 py-1 pl-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 focus:placeholder-gray-50"
                />
              </div>
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium leading-6 ring-gray-300">
                Rol
              </label>
              <div className="mt-2">
                <select
                  id="role"
                  name="role"
                  required
                  className="block w-full rounded-md border-0 py-1.5 pl-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 focus:placeholder-gray-50"
                  >
                    <option value="administrador">Adminstrador</option>
                    <option value="lider">Lider de equipo</option>
                </select>
              </div>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label htmlFor="secret-question" className="block text-sm font-medium leading-6 ring-gray-300">
                Pregunta Secreta
              </label>
              <div className="mt-2">
                <input
                  required
                  placeholder="¿Nombre de tu mascota?"
                  name="secret-question"
                  id="secret-question"
                  className="block w-full rounded-md border-0 py-1 pl-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 focus:placeholder-gray-50"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="secret-answer" className="block text-sm font-medium leading-6 ring-gray-300">
              Respuesta
              </label>
              <div className="mt-2">
                <input
                  required
                  placeholder="Neron"
                  name="secret-answer"
                  id="secret-answer"
                  className="block w-full rounded-md border-0 py-1 pl-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 focus:placeholder-gray-50"
                />
              </div>
            </div>
            </div>
            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Registrar
              </button>
            </div>
            {status?.errors ? status.errors.map((error: any, index: number) => <p className="text-sm text-center" key={`${error.message}-${index}`}>{error.message}</p>) : null}
            {status?.error ? <p className="text-sm text-center">{ status.error }</p> : null	}
          </form>
        </div>
      </div>
    </>
    )
  }