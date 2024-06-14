
import { Button } from "src/components/Common/Button";
import { SectionTitle } from "src/components/Common/SectionTitle";


export const QuickEditCompany = () => {

  return (
    <div className="bg-black-nav rounded-xl p-4 mt-4">
    <SectionTitle> Editar empresa </SectionTitle>
    <div className="flex mt-2">
        <div className="h-14 w-14 cursor-pointer flex justify-center items-center overflow-hidden  rounded-xl  border-dashed border-2 border-indigo-600 ">
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
              placeholder="Nombre de la empresa"
              className="bg-black-nav border-solid border-2 border-gray-700 h-14 pl-2 w-full rounded-md cursor-text focus:outline-none"
            />
        </div>
    </div>

    <div className="flex mt-2">
      <div className="flex-1">
          <input
            placeholder="Dirección de la empresa"
            className="bg-black-nav border-solid border-2 border-gray-700 h-14 pl-2 w-full rounded-md cursor-text focus:outline-none"
          />
      </div>
    </div>

    <>
      <div className="flex mt-2">
        <div className="flex-1">
            <input
              placeholder="Email de la empresa"
              className="bg-black-nav border-solid border-2 border-gray-700 h-14 pl-2 w-full rounded-md cursor-text focus:outline-none"
            />
        </div>
      </div>
      <div className="flex mt-2">
        <div className="flex-1">
          
            <input
              placeholder="Teléfono de empresa"
              className="bg-black-nav border-solid border-2 border-gray-700 h-14 pl-2 w-full rounded-md cursor-text focus:outline-none"
            />
        </div>
      </div>
    </>
    
    <div className="mt-3">
      <Button block >
        <span className="inline-block ml-2"> Enviar </span>
      </Button>
    </div>
  </div>
  );
}

