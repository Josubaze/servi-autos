import React from "react";
import { FaPlus, FaTools, FaBoxes } from "react-icons/fa";
import { FaArrowLeftLong } from "react-icons/fa6";
import Tooltip from "@mui/material/Tooltip";

// Se añade la propiedad setIsTableVisible
interface BudgetAddLineButtonProps {
  setIsTableVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

export const BudgetAddLineButton = ({ setIsTableVisible }: BudgetAddLineButtonProps) => {
  const handleShowServiceTable = () => {
    setIsTableVisible(true); // Cambia el estado para mostrar la tabla
  };

  return (
    <div className="grid grid-cols-6 rounded-lg w-full px-8 pt-4 gap-x-6">
      <div className="col-span-2 gap-x-4 flex justify-center items-center">
        <Tooltip title="Agregar Fila">
          <button className="w-12 h-12 rounded-full bg-transparent border-2 border-green-600 flex justify-center items-center text-white transition-all ease-in-out delay-150 hover:scale-110 hover:bg-green-600 hover:text-white duration-300">
            <FaPlus className="w-12 h-12 p-2 text-green-600 hover:text-white transition-all ease-in-out delay-150 hover:scale-110" />
          </button>
        </Tooltip>

        <Tooltip title="Agregar Servicio">
          <button
            className="w-12 h-12 rounded-full bg-transparent border-2 border-green-600 flex justify-center items-center text-white transition-all ease-in-out delay-150 hover:scale-110 hover:bg-green-600 hover:text-white duration-300"
            onClick={handleShowServiceTable} // Llama a la función para mostrar la tabla
          >
            <FaTools className="w-12 h-12 p-2 text-green-600 hover:text-white transition-all ease-in-out delay-150 hover:scale-110" />
          </button>
        </Tooltip>

        <Tooltip title="Agregar Producto">
          <button className="w-12 h-12 rounded-full bg-transparent border-2 border-green-600 flex justify-center items-center text-white transition-all ease-in-out delay-150 hover:scale-110 hover:bg-green-600 hover:text-white duration-300">
            <FaBoxes className="w-12 h-12 p-2 text-green-600 hover:text-white transition-all ease-in-out delay-150 hover:scale-110" />
          </button>
        </Tooltip>

        <div className="flex gap-x-2">
          <FaArrowLeftLong className="text-3xl animate-bounce" />
          <span className="text-lg font-semibold text-green-600">Agregar</span>
        </div>
      </div>
    </div>
  );
};
