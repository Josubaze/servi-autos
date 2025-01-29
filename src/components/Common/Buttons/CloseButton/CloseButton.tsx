import { Button } from '@nextui-org/react';
import React from 'react';

interface CloseButtonProps {
  onClose: () => void;
}

export const CloseButton: React.FC<CloseButtonProps> = ({ onClose }) => {
  return (
    <Button
      type="button"
      onClick={onClose}
      variant='light'
      color='danger'
    >
      Cancelar
    </Button>
  );
};

