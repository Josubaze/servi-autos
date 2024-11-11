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
import { IoPencil } from "react-icons/io5";
import { MdDelete } from "react-icons/md";
import Tooltip from '@mui/material/Tooltip';
import { useMediaQuery } from '@mui/material';

export const ServiceRow: React.FC<RowProps> = ({ service, handleEdit, handleDelete }) => {
  const [open, setOpen] = React.useState(false);
  const isMobile = useMediaQuery('(max-width:600px)');

  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
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
        <TableCell align="right">{service.servicePrice}</TableCell>
        <TableCell align="right">{service.totalPrice}</TableCell>
        <TableCell>
          <div className='flex justify-end  py-2 gap-5'>
            <Tooltip title="Modificar Servicio">
              <span>
                <IoPencil className="cursor-pointer text-2xl text-gray-600 hover:text-orange-600 transition ease-in-out delay-150 rounded hover:-translate-y-1 hover:scale-150 duration-300" 
                onClick={() => handleEdit(service)}
                />
              </span>
            </Tooltip>
            <Tooltip title="Eliminar Servicio">
              <span>
                <MdDelete
                className="cursor-pointer text-2xl text-gray-600 hover:text-red-600 transition ease-in-out delay-150 rounded hover:-translate-y-1 hover:scale-150 duration-300"
                onClick={() => handleDelete(service._id)}
                />
              </span>
            </Tooltip>
          </div>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">Detalles del Servicio</Typography>
              <Table size="small" aria-label="productos">
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Nombre</TableCell>
                    <TableCell>Categoría</TableCell>
                    <TableCell align="right">Cantidad</TableCell>
                    <TableCell align="right">Precio</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {service.products.map((product) => {                  
                      return (
                        <ProductRow
                          key={product.product._id}
                          product={product.product}
                          quantity={product.quantity}
                        />
                      );
                    }                  
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

