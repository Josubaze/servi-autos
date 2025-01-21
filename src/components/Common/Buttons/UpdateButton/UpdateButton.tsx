import { Tooltip } from '@nextui-org/react';
import React from 'react';
import { IoPencil } from 'react-icons/io5';

interface UpdateButtonProps {
  onClick: () => void;
}

export const UpdateButton: React.FC<UpdateButtonProps> = ({ onClick }) => {
  return (
    <Tooltip content="Modificar">
      <button
              className="w-9 h-9 rounded-full bg-transparent flex justify-center items-center transition-all ease-in-out delay-150 hover:scale-110 hover:bg-gray-600/20 hover:text-indigo-500 duration-300"
              onClick={onClick}
            >
              <IoPencil className="w-8 h-8 p-1" />
      </button>
  </Tooltip>
  );
};

