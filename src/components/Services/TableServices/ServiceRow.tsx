import * as React from 'react';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { ProductRow } from './ProductRow'; 
import { useMediaQuery } from '@mui/material';
import { UpdateButton } from 'src/components/Common/Buttons/UpdateButton';
import { DeleteButton } from 'src/components/Common/Buttons/DeleteButton';
import { Divider } from '@nextui-org/react';
import { AiOutlineCheck, AiOutlineClose } from 'react-icons/ai';

export const ServiceRow: React.FC<RowProps> = ({ service , handleEdit, handleDelete, isLider }) => {
  const [open, setOpen] = React.useState(false);
  const isMobile = useMediaQuery('(max-width:600px)');
  const [confirmDelete, setConfirmDelete] = React.useState(false);
  const totalProductos = service.products.reduce((total, product) => {
    return total + product.product.price * product.quantity;
  }, 0);

  return (
    <React.Fragment>
      <TableRow sx={{
                    '& > *': { borderBottom: 'unset' },
                    '&:hover': {
                        background: 'rgba(75, 85, 99, 0.3)', 
                    }
                }}>
        <TableCell>
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        {!isMobile && 
        <TableCell 
          sx={{
            maxWidth: '150px', 
            overflow: 'hidden', 
            textOverflow: 'ellipsis', 
            wordWrap: 'break-word',
            padding: '4px 8px'
          }}>
          {service._id}
        </TableCell>}
        <TableCell >{service.name}</TableCell>
        {
          !isLider && (
            <>
              <TableCell align="right">{service.servicePrice}</TableCell>
              <TableCell align="right">{service.totalPrice}</TableCell>
              <TableCell>
                  <div className="flex gap-x-5 justify-center items-center">                                             
                    <UpdateButton onClick={() => handleEdit(service)} />
                    <DeleteButton onClick={() => handleDelete(service._id)} />                                              
                  </div>
              </TableCell>
            </>
          )
        }
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ padding: '40px'}}>
              <Typography variant="h6" gutterBottom component="div">Detalles del Servicio</Typography>
              <Table size="small" aria-label="productos">
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Nombre</TableCell>
                    <TableCell>Categoría</TableCell>
                    <TableCell align="right">Cantidad</TableCell>                    
                    {!isLider && <TableCell align="right">Precio</TableCell> }
                  </TableRow>
                </TableHead>
                <TableBody>
                  {service.products.map((product) => {                  
                      return (
                        <ProductRow
                          key={product.product._id}
                          product={product.product}
                          quantity={product.quantity}
                          showPrices={isLider ? false : true}
                        />
                      );
                    }                  
                  )}
                  <TableRow>
                        <TableCell colSpan={5}>
                            <Divider orientation="horizontal"></Divider>
                        </TableCell>
                    </TableRow>
                    {!isLider && (                      
                      <TableRow>
                          <TableCell colSpan={4} align="right" sx={{ fontWeight: 'bold' }}>
                              Total de Productos
                          </TableCell>
                          <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                              {totalProductos.toFixed(2)}
                          </TableCell>
                      </TableRow>
                    )}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
};

