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
import { useSortableData } from 'src/hooks/useSortableData';
import { Loading } from 'src/components/Common/Loading';
import { useDynamicFilter } from 'src/hooks/useProductFilter';
import { useMediaQuery } from '@mui/material';
import { toast } from 'react-toastify';

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
      <div className="flex justify-center items-center h-[500px]">
          <Loading />
      </div>
    );
  }

  if (isError) {
    return (
      toast.error('Ha ocurrido un error al cargar los servicios')
    );
  }

  if (!isSuccess) {
    return null; // Optionally handle other states
  }

  return (
    <ThemeProvider theme={darkTheme}>
      <TableContainer component={Paper}>
        <Table aria-label="collapsible table" className='p-4'>
          <TableHead>
            <TableRow>
                <TableCell colSpan={6} sx={{
                  fontSize: '1.25rem',
                  textAlign: 'left', 
                  backgroundColor: '#161616', 
                }}>
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
              <TableCell align="center">Acciones</TableCell>
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
