import * as React from 'react';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';

export const ProductRow: React.FC<any> = ( product) => (
  <TableRow>
    <TableCell component="th" scope="row">{product.product._id}</TableCell>
    <TableCell>{product.product.name}</TableCell>
    <TableCell>{product.product.category}</TableCell>
    <TableCell align="right">{product.quantity}</TableCell>
    <TableCell align="right">{product.product.price}</TableCell>
  </TableRow>
);

