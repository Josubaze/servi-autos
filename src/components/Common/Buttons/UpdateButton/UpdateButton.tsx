import React from 'react';
import { Tooltip } from '@mui/material';
import { IoPencil } from 'react-icons/io5';

interface UpdateButtonProps {
  onClick: () => void;
}

export const UpdateButton: React.FC<UpdateButtonProps> = ({ onClick }) => {
  return (
    <Tooltip title="Modificar">
      <span>
        <IoPencil 
          className="cursor-pointer text-2xl text-gray-600 hover:text-orange-600 transition ease-in-out delay-150 rounded hover:-translate-y-1 hover:scale-150 duration-300" 
          onClick={onClick}
        />
      </span>
    </Tooltip>
  );
};

