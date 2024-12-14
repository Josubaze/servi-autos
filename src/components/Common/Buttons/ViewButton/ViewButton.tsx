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
              className="w-8 h-8 rounded-full bg-transparent border-2 border-indigo-600 flex justify-center items-center transition-all ease-in-out delay-150 hover:scale-110 hover:bg-orange-600 hover:border-gray-100 duration-300"
              onClick={onClick}
            >
              <FaRegEye className="w-8 h-8 p-1" />
      </button>
  </Tooltip>
  );
};

