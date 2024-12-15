import React from 'react';
import { Tooltip } from '@mui/material';
import { FaRegEye } from "react-icons/fa";

interface ViewButtonProps {
  onClick: () => void;
}

export const ViewButton: React.FC<ViewButtonProps> = ({ onClick }) => {
  return (
    <Tooltip title="Ver" arrow>
      <button
              className="w-9 h-9 rounded-full bg-transparent flex justify-center items-center transition-all ease-in-out delay-150 hover:scale-110 hover:bg-gray-600/20 hover:text-indigo-500 duration-300"
              onClick={onClick}
            >
              <FaRegEye className="w-8 h-8 p-1" />
      </button>
  </Tooltip>
  );
};

