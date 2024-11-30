import React from "react";
import { FaPlus, FaTools } from "react-icons/fa";
import { TbArrowBadgeLeftFilled } from "react-icons/tb";
import Tooltip from "@mui/material/Tooltip";
import { motion } from "framer-motion";

// Se añade la propiedad setIsTableVisible
interface BudgetAddLineButtonProps {
  onTableVisible: () => void;
  onAddEmptyService: () => void;
}

export const BudgetAddLineButton: React.FC<BudgetAddLineButtonProps> = ({onTableVisible, onAddEmptyService}) => {

  return (
      <div className="gap-x-4 flex justify-start items-center py-4 px-8">
        <Tooltip title="Agregar Fila" arrow color="bg-green-600">
          <button className="w-16 h-16 rounded-full bg-transparent border-2 border-green-600 flex justify-center items-center transition-all ease-in-out delay-150 hover:scale-110 hover:bg-green-600  duration-300"
          onClick={onAddEmptyService}>
            <FaPlus className="w-16 h-16 p-4" />
          </button>
        </Tooltip>

        <Tooltip title="Agregar Servicio" arrow>
          <button
            className="w-16 h-16 rounded-full bg-transparent border-2 border-green-600 flex justify-center items-center transition-all ease-in-out delay-150 hover:scale-110 hover:bg-green-600 duration-300"
            onClick={onTableVisible} 
          >
            <FaTools className="w-16 h-16 p-4" />
          </button>
        </Tooltip>

        <div>
          <motion.div
            animate={{
              x: ["0px", "20px", "0px"], 
            }}
            transition={{
              duration: 1, 
              repeat: 5,
              ease: "easeInOut",
            }}
            className="flex gap-x-2 justify-center items-center"
          >
            <TbArrowBadgeLeftFilled className="text-5xl" />
            <span className="font-knewave text-4xl">AGREGAR</span>
          </motion.div> 
        </div>
      </div>
  
  );
};
