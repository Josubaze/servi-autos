'use client'

import Image from 'next/image'
import {Typewriter} from 'src/components/Typewriter' 

export const Hero = () => {
  const words = ["HOLA ESTIMADOS! BIENVENIDOS A ESTA PROPUESTA.", "APLICACIÓN PARA LA AUTOMATIZACIÓN DE LOS SERVICIOS EN LA EMPRESA AUTOMOTRIZ SERVIAUTOS BAEZ C.A"];

  return (
    <div className="relative bg-cover bg-center flex flex-grow">
      <div className="relative isolate lg: w-full">
        <div className="h-full grid grid-cols-1 lg:grid-cols-2 gap-8 ">
          <div className="flex flex-col py-4 px-8 md:py-12 justify-center">
            <div className="justify-center mb-8 flex">
              <div className="flex rounded-full px-3 py-1 text-sm leading-6 text-gray-400 ring-1 ring-gray-900/10 hover:ring-gray-900/20 md:text-md xl:text-xl">
                El repositorio de esta aplicación lo puedes encontrar.{' '}
                <a href="https://github.com/Josubaze/servi-autos" className="flex gap-1 justify-center items-center font-semibold text-indigo-600 hover:text-indigo-400 cursor-pointer">
                  <span aria-hidden="true" />
                  Aquí! <span aria-hidden="true">&rarr;</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 flex"
                    fill="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                </a>
              </div>
            </div>
            <div className="text-center lg:text-left">
              <div className='min-h-52 mx-auto sm:min-h-80'>
                <Typewriter words={words}></Typewriter>
              </div>
              {/* <h1 className="text-4xl  text-center font-bold tracking-tight text-indigo-700 md:text-6xl xl:text-7xl">
                Aplicación de Automatización de los Servicios en la Empresa Automotriz ServiAutos Baez
              </h1> */}
              <p className="mt-2 text-lg leading-8 text-gray-200 text-justify md:text-2xl xl:text-3xl">
                Gestiona facturas, presupuestos e inventario de manera eficiente. 
                Simplifica tus operaciones y optimiza el taller automotriz llevandolo a un siguiente nivel!
              </p>
              <div className="relative h-64 w-full mt-8 md:h-80 lg:hidden">
                <Image
                  src="/images/hero.png"
                  alt="Descriptive Alt Text"
                  layout='fill'
                  objectFit="cover"
                  style={{ filter: 'opacity(70%)' }}
                  className='rounded-lg shadow-xl shadow-zinc-700'
                />
              </div>
              <div className="py-8 flex items-center justify-center">
                <a
                  href="/signup"
                  className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-md font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 lg:text-xl"
                >
                  Empezar!
                </a>
              </div>
            </div>
            
          </div>
          <div className="relative h-full hidden lg:block">
            <Image
              src="/images/hero.png"
              alt="Descriptive Alt Text" 
              layout="fill"
              objectFit="cover"
              style={{ filter: 'opacity(70%)' }}
            />
          </div>
        </div>
      </div>
    </div>
    
  )
  
}

