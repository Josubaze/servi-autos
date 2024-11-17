import React from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Tooltip, ThemeProvider } from "@mui/material";
import { MdDelete } from "react-icons/md";
import { motion } from "framer-motion";
import { darkTheme } from "src/styles/themes/themeTable";

interface Producto {
  id: number;
  nombre: string;
  categoria: string;
  cantidad: number;
  precio: number;
}

interface ProductTableProps {
  productos: Producto[];
}

export const BudgetProductTable = ({ productos }: ProductTableProps) => {
  return (
    <div className="px-12">
        <ThemeProvider theme={darkTheme}>
            <TableContainer component={Paper}>
            <motion.div
                initial={{ maxHeight: 0, opacity: 0 }}   
                animate={{ maxHeight: "500px", opacity: 1 }}  
                exit={{ maxHeight: 0, opacity: 0 }}      
                transition={{ duration: 0.5 }}        
                style={{ overflow: "hidden" }}           
            >
                <Table size="small">
                <TableHead>
                    <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Nombre</TableCell>
                    <TableCell>Categoría</TableCell>
                    <TableCell>Cantidad</TableCell>
                    <TableCell>Precio</TableCell>
                    <TableCell>Acciones</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {productos.map((product) => (
                    <motion.tr
                        key={product.id}
                        initial={{ opacity: 0, y: -20 }}    // Inicia desde arriba
                        animate={{ opacity: 1, y: 0 }}       // Se despliega
                        exit={{ opacity: 0, y: 20 }}         // Se desvanece hacia abajo
                        transition={{ duration: 0.4 }}
                    >
                        <TableCell>{product.id}</TableCell>
                        <TableCell>{product.nombre}</TableCell>
                        <TableCell>{product.categoria}</TableCell>
                        <TableCell>{product.cantidad}</TableCell>
                        <TableCell>${product.precio.toLocaleString()}</TableCell>
                        <TableCell className="flex justify-center items-center">
                        <Tooltip title="Eliminar Producto">
                            <button
                            className="w-6 h-6 rounded-full bg-transparent border border-red-600 flex justify-center items-center text-red-600 transition-all ease-in-out delay-150 hover:bg-red-600 hover:text-white"
                            >
                            <MdDelete className="w-5 h-5" />
                            </button>
                        </Tooltip>
                        </TableCell>
                    </motion.tr>
                    ))}
                </TableBody>
                </Table>
            </motion.div>
            </TableContainer>
        </ThemeProvider>
    </div>
  );
};
