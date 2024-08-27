import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: '#000',
  color: '#fff',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

interface BasicModalProps {
  open: boolean;
  onClose: () => void;
  message: string;
}

export const BasicModal: React.FC<BasicModalProps> = ({ open, onClose, message }) => {

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2" align="center">
          ¡Ha ocurrido un error!
        </Typography>
        <Typography id="modal-modal-description" align="center" sx={{ mt: 2, mb: 2 }}>
          {message}
        </Typography>
        <Button onClick={onClose} sx={{ 
            mt: 2, 
            display: 'block',  
            margin: '0 auto', 
            bgcolor: 'red',   
            color: 'white',    
            '&:hover': {       
              bgcolor: 'darkred',
            }
        }}>Cerrar</Button>
      </Box>
    </Modal>
  );
};
