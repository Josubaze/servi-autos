import { InvoiceTwoIcon } from "src/components/Icons/InvoiceTwoIcon";

export const ClientTable = () => {
  return (
    <>
      <div className="sm:bg-black-nav rounded-xl sm:px-3 sm:py-3">
        <div className="hidden sm:flex invisible sm:visible w-full flex-col sm:flex-row">
          <div className="sm:text-left font-title flex-1">
            Nombre
          </div>
          <div className="sm:text-left font-title flex-1">
            Móvil
          </div>
          <div className="sm:text-left font-title flex-1">
            Correo
          </div>
          <div className="sm:text-left font-title flex-1">
            Acción
          </div>
        </div>
        <div className="font-title flex flex-col justify-center items-center rounded-md py-5 text-gray-700 bg-gray-100">
            <InvoiceTwoIcon />
            Vacio Clientes
        </div>
      </div>
    </>
  );
}

