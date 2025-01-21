import { Tooltip } from '@nextui-org/react';
import React from 'react';
import { PiNoteBold } from "react-icons/pi";

interface CreditNoteButtonProps {
  onClick: () => void;
}

export const CreditNoteButton: React.FC<CreditNoteButtonProps> = ({ onClick }) => {
  return (
    <Tooltip content="Nota de Crédito">
      <button
              className="w-9 h-9 rounded-full bg-transparent flex justify-center items-center transition-all ease-in-out delay-150 hover:scale-110 hover:bg-gray-600/20 hover:text-indigo-500 duration-300"
              onClick={onClick}
            >
              <PiNoteBold className="w-8 h-8 p-1" />
      </button>
    </Tooltip>
  );
};

