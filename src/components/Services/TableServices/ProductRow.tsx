import * as React from 'react';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';

export const ProductRow: React.FC<ProductInService> = ( { product, quantity, showPrices }) => (
  <TableRow>
    <TableCell component="th" scope="row">{product._id}</TableCell>
    <TableCell>{product.name}</TableCell>
    <TableCell>{product.category}</TableCell>
    <TableCell align="right">{quantity}</TableCell>
    {
      showPrices && (
        <TableCell align="right">{(product.price).toFixed(2)}</TableCell>
      )
    }
  </TableRow>
);

