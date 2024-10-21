'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import TablePagination from '@mui/material/TablePagination';
import { ThemeProvider } from '@mui/material/styles';
import { darkTheme } from 'src/styles/themes/themeTable';

function Row(props: { row: Service; handleEdit: (service: Service) => void; handleDelete: (id: string) => void; }) {
  const { row, handleEdit, handleDelete } = props;
  const [open, setOpen] = React.useState(false);

  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {row.serviceName}
        </TableCell>
        <TableCell align="right">{row.serviceQuantity}</TableCell>
        <TableCell align="right">{row.servicePrice}</TableCell>
        <TableCell align="right">{row.totalPrice}</TableCell>
        <TableCell align="right">
          <button onClick={() => handleEdit(row)}>Editar</button>
          <button onClick={() => handleDelete(row._id)}>Eliminar</button>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Detalles del Servicio
              </Typography>
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
                      <TableRow key={product.product._id}> {/* Usa el _id del producto */}
                        <TableCell component="th" scope="row">
                          {product.product._id} {/* ID del producto */}
                        </TableCell>
                        <TableCell>{product.product.name}</TableCell> 
                        <TableCell>{product.product.category}</TableCell> 
                        <TableCell align="right">{product.quantity}</TableCell> 
                        <TableCell align="right">{product.product.price}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

interface TableServicesProps {
  data: Service[];
  searchTerm: string;
  isLoading: boolean;
  isError: boolean;
  isFetching: boolean;
  isSuccess: boolean;
  handleDelete: (id: string) => void;
  handleEdit: (service: Service) => void;
}

export const TableServices: React.FC<TableServicesProps> = ({ data, searchTerm, isLoading, isError, isFetching, isSuccess, handleDelete, handleEdit }) => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const rowsToShow = data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <ThemeProvider theme={darkTheme}>
      <TableContainer component={Paper}>
        {isLoading && <Typography variant="h6">Cargando...</Typography>}
        {isError && <Typography variant="h6">Error al cargar los datos</Typography>}
        {!isLoading && !isError && (
          <Table aria-label="collapsible table">
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell>Nombre</TableCell>
                <TableCell align="right">Cantidad</TableCell>
                <TableCell align="right">Precio por Servicio</TableCell>
                <TableCell align="right">Precio Total</TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rowsToShow.map((row) => (
                <Row key={row._id} row={row} handleEdit={handleEdit} handleDelete={handleDelete} />
              ))}
            </TableBody>
          </Table>
        )}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
    </ThemeProvider>
  );
  
};
