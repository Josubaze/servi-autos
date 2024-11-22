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
import { useMediaQuery } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Tooltip from "@mui/material/Tooltip";


export const SelectServices: React.FC<SelectServicesProps> = ({
    data,
    isLoading,
    isError,
    isSuccess,
    onServiceSelect,
    onCloseTable,
}) => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const { sortedData, order, orderBy, handleRequestSort } = useSortableData(data, 'serviceQuantity');
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
            <Loading color="#3730a3" size={100} justify="center" pt={32} />
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
            <div className="relative w-full max-h-[750px] overflow-y-auto">
                <Tooltip title="Cerrar">
                    <IconButton
                        onClick={onCloseTable}
                        className='absolute top-2 right-2 z-50 bg-black-nav'
                    >
                        <CloseIcon/>
                    </IconButton>
                </Tooltip>

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
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {rowsToShow.map((service: Service) => (
                            <ServiceRow 
                                key={service._id} 
                                service={service} 
                                onServiceSelect={onServiceSelect}/>
                            ))}
                        </TableBody>
                    </Table>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25, 50]}
                        component="div"
                        count={data.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        labelRowsPerPage="Filas por página"
                        labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`} 
                    />
                </TableContainer>
            </div>
        </ThemeProvider>
    );
};
