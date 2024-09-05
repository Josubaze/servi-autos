
import { SectionTitle } from "src/components/Common/SectionTitle";

export const QuickAddClient = () => {

  return (
    <div className="bg-black-nav rounded-xl p-4 mt-4">
    <SectionTitle > Agregar Cliente </SectionTitle>
    <div className="flex mt-2">
        <div className="h-14 w-14 cursor-pointer primary-self-text flex justify-center items-center overflow-hidden  rounded-xl  border-dashed border-2 border-indigo-600 ">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-indigo-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
        </div>
        <div className="flex-1 pl-3">
            <input
              placeholder="Nombre del Cliente"
              className="bg-black-nav border-solid border-2 border-gray-700 h-14 pl-2 w-full rounded-md cursor-text focus:outline-none"
            />
        </div>
    </div>

    <div className="flex mt-2">
      <div className="flex-1">
          <input
            placeholder="Correo Electrónico"
            className="bg-black-nav border-solid border-2 border-gray-700 h-14 pl-2 w-full rounded-md cursor-text focus:outline-none"
          />
      </div>
    </div>

    <>
      <div className="flex mt-2">
        <div className="flex-1">
            <input
              placeholder="Nº de Móvil"
              className="bg-black-nav border-solid border-2 border-gray-700 h-14 pl-2 w-full rounded-md cursor-text focus:outline-none"
            />
        </div>
      </div>
      <div className="flex mt-2">
        <div className="flex-1">
          
            <input
              placeholder="Dirección de Facturación"
              className="bg-black-nav border-solid border-2 border-gray-700 h-14 pl-2 w-full rounded-md cursor-text focus:outline-none"
            />
        </div>
      </div>
    </>

    <div className="mt-3">
      <button  className="rounded-xl font-titl flex flex-row items-center justify-center w-full  h-12 px-4 transition ease-in-out delay-150 bg-indigo-600 text-white rounded-s-lg hover:-translate-y-1 hover:scale-110 hover:bg-indigo-700 duration-300">
        Enviar 
      </button>
    </div>
  </div>
  );
}

