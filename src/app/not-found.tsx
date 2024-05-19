
export default function NotFound() {
    return (
      <>
        <main className="flex min-h-screen items-center justify-center px-6 py-24 sm:py-32 lg:px-8">
          <div className="text-center">
            <p className="text-5xl font-semibold text-indigo-600">404</p>
            <h1 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">Página no encontrada</h1>
            <p className="mt-6 text-base leading-7 text-gray-500">Lo sentimos, no pudimos encontrar la página que estás buscando.</p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <a
                href="/"
                className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Volver al Home
              </a>
              <a href="/" className="rounded-md bg-indigo-600  px-3.5 py-2.5 text-sm font-semibold text-white">
                Contact support <span aria-hidden="true">&rarr;</span>
              </a>
            </div>
          </div>
        </main>
      </>
    )
  }
  