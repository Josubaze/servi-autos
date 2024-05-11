
export const SignupForm = () => {
    return (
      <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            className="mx-auto h-28 w-auto"
            src="/svg/logo.svg"
            alt="Your Company"
          />
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight ring-gray-300">
            Registrar cuenta
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" action="#" method="POST">
            <div>
              <label htmlFor="email" className="block text-sm font-medium leading-6 ring-gray-300">
                Correo Electrónico
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  placeholder="Ej. Anafer@example.com"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="block w-full rounded-md border-0 py-1.5 pl-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 focus:placeholder-gray-50"
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
                  className="block w-full rounded-md border-0 py-1.5 pl-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 focus:placeholder-gray-50"
                />
              </div>
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium leading-6 ring-gray-300">
                Rol
              </label>
              <div className="mt-2">
                <input
                  id="role"
                  placeholder="Adminstrador o Lider"
                  name="role"
                  type="role"
                  autoComplete="role"
                  required
                  className="block w-full rounded-md border-0 py-1.5 pl-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 focus:placeholder-gray-50"
                />
              </div>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label htmlFor="secret-question" className="block text-sm font-medium leading-6 ring-gray-300">
                Pregunta Secreta
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  placeholder="¿Nombre de tu mascota?"
                  name="secret-question"
                  id="secret-question"
                  autoComplete="given-name"
                  className="block w-full rounded-md border-0 py-1.5 pl-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 focus:placeholder-gray-50"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="secret-answer" className="block text-sm font-medium leading-6 ring-gray-300">
              Respuesta
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  placeholder="Neron"
                  name="secret-answer"
                  id="secret-answer"
                  autoComplete="family-name"
                  className="block w-full rounded-md border-0 py-1.5 pl-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 focus:placeholder-gray-50"
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
          </form>
        </div>
      </div>
    </>
    )
  }