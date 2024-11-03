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

export const Row: React.FC<RowProps> = ({ row, handleEdit, handleDelete }) => {
  const [open, setOpen] = React.useState(false);

  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">{row.name}</TableCell>
        <TableCell align="right">{row.serviceQuantity}</TableCell>
        <TableCell align="right">{row.servicePrice}</TableCell>
        <TableCell align="right">{row.totalPrice}</TableCell>
        <TableCell>
          <div className='flex justify-end  py-2 gap-5'>
            <Tooltip title="Editar proveedor">
              <span>
                <IoPencil className="cursor-pointer text-2xl text-gray-600 hover:text-indigo-500 transition ease-in-out delay-150 rounded hover:-translate-y-1 hover:scale-150 duration-300" 
                
                />
              </span>
            </Tooltip>
            <Tooltip title="Eliminar proveedor">
              <span>
                <MdDelete
                className="cursor-pointer text-2xl text-gray-600 hover:text-indigo-500 transition ease-in-out delay-150 rounded hover:-translate-y-1 hover:scale-150 duration-300"
                
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
                  {row.products.map((product) => (
                    <ProductRow key={product.product._id} product={product} />
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
};

