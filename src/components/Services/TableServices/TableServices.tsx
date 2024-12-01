import React, { useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import TableSortLabel from '@mui/material/TableSortLabel';
import Paper from '@mui/material/Paper';
import { darkTheme } from 'src/styles/themes/themeTable';
import { ServiceRow } from './ServiceRow'; 
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import { useSortableData } from 'src/hooks/useSortableData';
import { Loading } from 'src/components/Common/Loading';
import { useDynamicFilter } from 'src/hooks/useProductFilter';
import { useMediaQuery } from '@mui/material';

export const TableServices: React.FC<TableServicesProps> = ({
  data,
  searchTerm,
  isLoading,
  isError,
  isSuccess,
  handleDelete,
  handleEdit,
}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const filteredData = useDynamicFilter(data, searchTerm, ['_id', 'name', 'serviceQuantity', 'servicePrice', 'totalPrice']);
  const { sortedData, order, orderBy, handleRequestSort } = useSortableData(filteredData, 'serviceQuantity');
  const isMobile = useMediaQuery('(max-width:600px)');

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const rowsToShow = sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', margin: '20px' }}>
        <Loading/>
      </div>
    );
  }

  if (isError) {
    return (
      <Typography variant="h6" color="error" style={{ textAlign: 'center', margin: '20px' }}>
        Ha ocurrido un error al cargar los servicios.
      </Typography>
    );
  }

  if (!isSuccess) {
    return null; // Optionally handle other states
  }

  return (
    <ThemeProvider theme={darkTheme}>
      <TableContainer component={Paper}>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
                <TableCell colSpan={5} className='text-xl text-start bg-black-nav '>
                    Lista de Servicios
                </TableCell>
            </TableRow>
          </TableHead>
          <TableHead>
            <TableRow>
              <TableCell />
              {!isMobile && (
                <TableCell>
                  <TableSortLabel
                    active={orderBy === '_id'}
                    direction={orderBy === '_id' ? order : 'asc'}
                    onClick={() => handleRequestSort('_id')}
                  >
                    ID
                  </TableSortLabel>
                </TableCell>
              )}
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'name'}
                  direction={orderBy === 'name' ? order : 'asc'}
                  onClick={() => handleRequestSort('name')}
                >
                  Nombre
                </TableSortLabel>
              </TableCell>
              <TableCell align="right">
                <TableSortLabel
                  active={orderBy === 'servicePrice'}
                  direction={orderBy === 'servicePrice' ? order : 'asc'}
                  onClick={() => handleRequestSort('servicePrice')}
                >
                  Precio por Servicio
                </TableSortLabel>
              </TableCell>
              <TableCell align="right">
                <TableSortLabel
                  active={orderBy === 'totalPrice'}
                  direction={orderBy === 'totalPrice' ? order : 'asc'}
                  onClick={() => handleRequestSort('totalPrice')}
                >
                  Precio Total
                </TableSortLabel>
              </TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rowsToShow.map((service: Service) => (
              <ServiceRow key={service._id} service={service} handleEdit={handleEdit} handleDelete={handleDelete} />
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={filteredData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Filas por página"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`} 
        />
      </TableContainer>
    </ThemeProvider>
  );
};
