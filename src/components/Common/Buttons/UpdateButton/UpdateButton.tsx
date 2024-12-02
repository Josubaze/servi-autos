import React from 'react';
import { Tooltip } from '@mui/material';
import { IoPencil } from 'react-icons/io5';

interface UpdateButtonProps {
  onClick: () => void;
}

export const UpdateButton: React.FC<UpdateButtonProps> = ({ onClick }) => {
  return (
    <Tooltip title="Modificar" arrow>
      <button
              className="w-8 h-8 rounded-full bg-transparent border-2 border-indigo-600 flex justify-center items-center transition-all ease-in-out delay-150 hover:scale-110 hover:bg-orange-600 hover:border-gray-100 duration-300"
              onClick={onClick}
            >
              <IoPencil className="w-8 h-8 p-1" />
      </button>
  </Tooltip>
  );
};

