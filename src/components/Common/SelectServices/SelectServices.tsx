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
import { darkThemeSolid } from 'src/styles/themes/themeTable';
import { ServiceRow } from './ServiceRow'; 
import TableCell from '@mui/material/TableCell';
import { useSortableData } from 'src/hooks/useSortableData';
import { Loading } from 'src/components/Common/Loading';
import { useMediaQuery } from '@mui/material';
import { IoExitOutline } from "react-icons/io5";
import { toast } from 'react-toastify';
import { useDynamicFilter } from 'src/hooks/useProductFilter';
import { SearchBar } from '../SearchBar';
import { Tooltip } from '@nextui-org/react';

export const SelectServices: React.FC<SelectServicesProps> = ({
    data,
    isLoading,
    isError,
    isSuccess,
    onServiceSelect,
    onCloseTable,
    showPrices = true, // Nuevo prop con valor por defecto
}) => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const isMobile = useMediaQuery('(max-width:600px)');
    const [searchTerm, setSearchTerm] = useState('');
    const filteredData = useDynamicFilter(data, searchTerm, ['_id', 'name', 'serviceQuantity', 'servicePrice', 'totalPrice']);
    const { sortedData, order, orderBy, handleRequestSort } = useSortableData(filteredData, 'serviceQuantity');

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
            toast.error('Ha ocurrido un error')
        );
    }

    if (!isSuccess) {
        return null; // Optionally handle other states
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md">
            {/* Botón Cerrar */}
            <Tooltip content='Salir'>
                <button
                    onClick={onCloseTable}
                    className="absolute top-4 right-4 shadow-xl shadow-gray-600 bg-black-nav hover:bg-black-nav/80 rounded-full w-10 h-10 flex items-center justify-center hover:scale-110 transition-colors duration-200"
                >
                    <span className="text-xl"><IoExitOutline className='flex w-6 h-6'/></span>
                </button>
            </Tooltip>

            <ThemeProvider theme={darkThemeSolid}>
                <div className="relative w-full max-h-[700px] overflow-y-auto">
                    <TableContainer component={Paper}>
                        <Table aria-label="collapsible table" className='p-4'>
                        <TableHead>
                                <TableRow>
                                    {/* Lista de Servicios */}
                                    <TableCell
                                        colSpan={isMobile ? 1 : 2}
                                        sx={{
                                            fontSize: "1.25rem",
                                            textAlign: "left",
                                        }}
                                    >
                                        <span>Lista de Servicios</span>
                                    </TableCell>

                                    {/* Espaciador dinámico */}
                                    {!isMobile && showPrices && (
                                        <TableCell colSpan={1} />
                                    )}

                                    {/* Buscador */}
                                    <TableCell
                                        colSpan={showPrices ? (isMobile ? 3 : 2) : (isMobile ? 2 : 1)}
                                        sx={{
                                            textAlign: isMobile || !showPrices ? "center" : "left",
                                        }}
                                    >
                                        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm}></SearchBar>
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
                                    {showPrices && (
                                        <>
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
                                        </>
                                    )}
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {rowsToShow.map((service: Service) => (
                                    <ServiceRow 
                                        key={service._id} 
                                        service={service}
                                        showPrices={showPrices}
                                        onServiceSelect={onServiceSelect}
                                    />
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
        </div>
    );
};
