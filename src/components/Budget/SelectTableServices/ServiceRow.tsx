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
import { ProductRow } from '../../Services/TableServices/ProductRow'; 
import { useMediaQuery } from '@mui/material';

export const ServiceRow: React.FC<SelectRowProps> = ({ service, handleSelect }) => {
    const [open, setOpen] = React.useState(false);
    const isMobile = useMediaQuery('(max-width:600px)');
    const totalProductos = service.products.reduce((total, product) => {
        return total + product.product.price * product.quantity;
    }, 0);
    const handleRowClick = () => {
        handleSelect(service); 
    };
    return (
    <React.Fragment>
        <TableRow
                sx={{
                    '& > *': { borderBottom: 'unset' },
                    cursor: 'pointer',
                    '&:hover': {
                        background: 'rgba(75, 85, 99, 0.3)', 
                    }
                }}
                onClick={handleRowClick} 
        >
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
                    <TableRow className='border-y-4 border-gray-600'>
                        <TableCell colSpan={4} align="right" sx={{ fontWeight: 'bold' }}>
                        Total de Productos
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                        {totalProductos.toFixed(2)}
                        </TableCell>
                    </TableRow>
                    </TableBody>
                </Table>
                </Box>
            </Collapse>
            </TableCell>
        </TableRow>
        </React.Fragment>
    );
};

