import React from 'react';

interface CloseButtonProps {
  onClose: () => void;
}

export const CloseButton: React.FC<CloseButtonProps> = ({ onClose }) => {
  return (
    <button
      type="button"
      onClick={onClose}
      className="bg-gray-600 text-white px-4 py-2 rounded transition ease-in-out delay-150 hover:scale-90 hover:bg-red-700 duration-300"
    >
      Cancelar
    </button>
  );
};

