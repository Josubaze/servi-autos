import React from 'react';
import { Tooltip } from '@mui/material';
import { MdDelete } from "react-icons/md";

interface DeleteButtonProps {
  onClick: () => void;
}

export const DeleteButton: React.FC<DeleteButtonProps> = ({ onClick }) => {
  return (
    <Tooltip title="Eliminar">
      <span>
        <MdDelete 
          className="cursor-pointer text-2xl text-gray-600 hover:text-red-600 transition ease-in-out delay-150 rounded hover:-translate-y-1 hover:scale-150 duration-300" 
          onClick={onClick}
        />
      </span>
    </Tooltip>
  );
};

