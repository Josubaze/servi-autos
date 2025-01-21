import React from "react";
import { FaPlus, FaTools } from "react-icons/fa";
import { TbArrowBadgeLeftFilled } from "react-icons/tb";
import { motion } from "framer-motion";
import {Tooltip, Button} from "@nextui-org/react";

// Se añade la propiedad setIsTableVisible
interface BudgetAddLineButtonProps {
  onTableVisible: () => void;
  onAddEmptyService: () => void;
}

export const BudgetAddLineButton: React.FC<BudgetAddLineButtonProps> = ({onTableVisible, onAddEmptyService}) => {

  return (
      <div className="gap-x-4 flex justify-start items-center py-4 px-8">
        <Tooltip content="Agregar Servicio Vacio">
          <Button
              color="success"
              variant="flat"
              isIconOnly
              className="w-16 h-16 min-w-16 rounded-full"
              onClick={onAddEmptyService}
          >
              <FaPlus className="w-10 h-10" />
          </Button>
        </Tooltip>

        <Tooltip content="Agregar Servicio">
          <Button
              color="success"
              variant="flat"
              isIconOnly
              className="w-16 h-16 min-w-16 rounded-full"
              onClick={onTableVisible} 
          >
              <FaTools className="w-10 h-10 p-1"/>
          </Button>
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
