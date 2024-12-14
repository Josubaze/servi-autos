import React from 'react';
import { Tooltip } from '@mui/material';
import { PiFilePdfBold } from "react-icons/pi";

interface ExportButtonProps {
  onClick: () => void;
}

export const ExportButton: React.FC<ExportButtonProps> = ({ onClick }) => {
  return (
    <Tooltip title="Exportar PDF" arrow>
      <button
              className="w-8 h-8 rounded-full bg-transparent border-2 border-indigo-600 flex justify-center items-center transition-all ease-in-out delay-150 hover:scale-110 hover:bg-red-600 hover:border-gray-100 duration-300"
              onClick={onClick}
            >
              <PiFilePdfBold className="w-8 h-8 p-1" />
      </button>
    </Tooltip>
  );
};

