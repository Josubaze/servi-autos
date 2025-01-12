import React from "react";
import { IoCloseOutline } from "react-icons/io5";
import { Market } from "../../Market"; // Asegúrate de tener esta importación correcta

interface MarketModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MarketModal: React.FC<MarketModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed top-0 left-0 z-50 w-full h-full bg-black bg-opacity-50 flex justify-center items-center"
      onClick={onClose}
    >
      <div
        className="bg-black-nav p-4 rounded-lg w-full sm:w-9/12"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-end items-center">
          <button
            className="relative text-gray-500 rounded-full overflow-hidden group w-10 h-10 flex justify-center items-center hover:text-white"
            onClick={onClose}
          >
            <span className="absolute w-full h-full rounded-full bg-gray-600 opacity-0 scale-0 transition-all duration-300 group-hover:opacity-100 group-hover:scale-100 z-0"></span>
            <span className="relative z-10">
              <IoCloseOutline className="h-6 w-6" />
            </span>
          </button>
        </div>
        {/* Aquí está el componente Market directamente dentro del modal */}
        <Market />
      </div>
    </div>
  );
};
