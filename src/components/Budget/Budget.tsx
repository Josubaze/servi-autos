'use client'

export const Budget = () => {
    return (
        <div className='relative flex flex-col py-6 px-0 sm:px-12'>   
            {/* Background de presupuesto */}    
            <div className="py-9 bg-center bg-black-nav rounded-xl flex flex-col sm:flex-row justify-between items-center">
                <div className="flex flex-col px-8 sm:flex-row items-center">
                    <div className="text-gray-100 font-title text-center sm:text-left">
                        <p className="font-bold mb-2">Nombre de la empresa</p>
                        <p className="text-sm font-medium">Por favor, añada los datos de la empresa</p>
                        <p className="text-sm font-medium">dirección de la empresa</p>
                        <p className="text-sm font-medium">Empresa@email.com</p>
                    </div>
                </div>

                <div className="text-white px-8 font-title font-bold text-5xl mt-5 sm:mt-0">Presupuesto</div>
            </div>




            {/* Segmento de formularios */}
            <div className="flex flex-col sm:flex-row pt-3 px-8">
            {/* Formulario de cliente */}
            <div className="flex-1">
                <div className="flex items-center">
                <p className="font-title font-bold">Presupuestar a</p>
                <div className="relative ml-3">
                    <button
                    type="button"
                    className="rounded-xl font-title text-white flex items-center justify-center text-sm h-8 px-2 primary-self-text border border-blue-400"
                    >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                        />
                    </svg>{" "}
                    Cargar
                    </button>
                </div>
                </div>

                {/* Ajuste de inputs */}
                <div className="flex flex-wrap gap-y-2 pt-4 w-full">
                <div className="w-full">
                    <input
                    placeholder="Nombre del cliente"
                    className="w-1/2 px-2 block border-solid border-2 border-gray-500 rounded-xl bg-gray-800 focus:outline-none focus:border-indigo-600 h-8"
                    />
                </div>

                <div className="w-full">
                    <input
                    placeholder="Dirección del cliente"
                    className="w-3/4 px-2 block border-solid border-2 border-gray-500 rounded-xl bg-gray-800 focus:outline-none focus:border-indigo-600 h-8"
                    />
                </div>

                <div className="w-full">
                    <input
                    placeholder="Móvil del cliente"
                    className="w-1/2 px-2 block border-solid border-2 border-gray-500 rounded-xl bg-gray-800 focus:outline-none focus:border-indigo-600 h-8"
                    />
                </div>

                <div className="w-full">
                    <input
                    placeholder="Correo del cliente"
                    className="w-3/4 px-2 block border-solid border-2 border-gray-500 rounded-xl bg-gray-800 focus:outline-none focus:border-indigo-600 h-8"
                    />
                </div>
                </div>
            </div>




            {/* Formulario de factura */}
            <div className="flex-1">
                <div className="flex flex-col gap-y-2 my-12 mx-4">
                    <div className="flex flex-row justify-between items-center">
                        <div className="font-title font-bold flex-1">Presupuesto</div>
                        <div className="flex-1 text-right">
                            <input
                            placeholder="Nº de Presupuesto"
                            className="px-2 w-full border-solid border-2 rounded-xl bg-indigo-950 focus:outline-none border-indigo-600 focus:border-indigo-300 h-8 text-right"
                            />
                        </div>
                    </div>

                    <div className="flex flex-row justify-between items-center">
                    <div className="font-title font-bold flex-1">Fecha de Creación</div>
                        <div className="flex-1 text-right">
                            <input
                                placeholder="12/09/2024"
                                className="px-2 w-3/4 border-solid border-2 rounded-xl bg-indigo-950 focus:outline-none border-indigo-600 focus:border-indigo-300 h-8 text-right"
                            />
                        </div>
                    </div>

                    <div className="flex flex-row justify-between items-center">
                    <div className="font-title font-bold flex-1">Fecha de Vencimiento</div>
                        <div className="font-title flex-1 text-right">
                            <input
                                placeholder="30/09/2024"
                                className="px-2 w-full border-solid border-2 rounded-xl bg-indigo-950 focus:outline-none border-indigo-600 focus:border-indigo-300 h-8 text-right"
                            />
                        </div>
                    </div>

                    <div className="flex flex-row justify-between items-center">
                    <div className="font-title font-bold flex-1">Cambiar Moneda</div>
                        <div className="font-title flex-1 text-right">
                            <input
                                placeholder="$"
                                className="px-2 w-3/4 border-solid border-2 rounded-xl bg-indigo-950 focus:outline-none border-indigo-600 focus:border-indigo-300 h-8 text-right"
                            />
                        </div>
                    </div>
                </div>
            </div>







            {/* termina segmento formulario */}
            </div>
        </div>
    );
}
