    import React from "react";
    import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    ThemeProvider,
    Typography,
    } from "@mui/material";
    import { MdDelete } from "react-icons/md";
    import { motion } from "framer-motion";
    import { darkThemeSolid } from "src/styles/themes/themeTable";
    import { FaPlus } from "react-icons/fa6";
    import { Button, Input, Tooltip } from "@nextui-org/react";

    export const ReportProductTable = ({
    productos,
    onProductQuantityChange,
    onProductDelete,
    onProductTableVisible
    }: ProductTableProps) => {
    
    return (
        <div>
        <ThemeProvider theme={darkThemeSolid}>
            <TableContainer component={Paper} 
                className="rounded-none rounded-bl-lg rounded-br-lg bg-black-nav/50">
            <motion.div
                initial={{ maxHeight: 0, opacity: 0 }}
                animate={{ maxHeight: "500px", opacity: 1 }}
                exit={{ maxHeight: 0, opacity: 0 }}
                transition={{ duration: 0.5 }}
                style={{ overflow: "hidden" }}
            >
                <Typography variant="h6" component="div">Detalles del Servicio</Typography>
                <Table className="pt-2" size="small">
                    <TableHead>
                    <TableRow>
                    <TableCell style={{ width: "20%" }}>ID</TableCell>
                    <TableCell style={{ width: "25%" }}>Nombre</TableCell>
                    <TableCell style={{ width: "20%" }}>Categoría</TableCell>
                    <TableCell style={{ width: "20%" }} align="right">Cantidad</TableCell>
                    <TableCell style={{ width: "15%" }} align="center">Acciones</TableCell>
                    </TableRow>
                    </TableHead>
                <TableBody>
                    {productos.map((productInService) => (
                    <motion.tr
                        key={productInService.product._id}
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{ duration: 0.4 }}
                    >
                        <TableCell>{productInService.product._id}</TableCell>
                        <TableCell>{productInService.product.name}</TableCell>
                        <TableCell>{productInService.product.category}</TableCell>
                        <TableCell>
                        <Input
                            size="sm"
                            value={Number(productInService.quantity).toLocaleString("de-DE", {
                            minimumFractionDigits: 0,
                            })} 
                            style={{ textAlign: "right" }}
                            variant="underlined"
                            fullWidth
                            onChange={(e) => {
                            const value = e.target.value.replace(/\./g, "").replace(/,/g, "");
                            if (!isNaN(Number(value)) && Number(value) >= 0) {
                                onProductQuantityChange(productInService.product._id, Number(value) || 1)
                            }
                            }}                
                            type="text" 
                            inputMode="numeric"              
                        />
                        </TableCell>
                        <TableCell align="center">
                        <Tooltip content="Eliminar Producto">
                            <Button
                                color="danger"
                                variant="flat"
                                isIconOnly
                                className="w-6 h-6 min-w-6 rounded-full"
                                onClick={() => onProductDelete(productInService.product._id)}
                            >
                                <MdDelete className="w-5 h-5" />
                            </Button>
                        </Tooltip>
                        </TableCell>
                    </motion.tr>
                    ))}
                </TableBody>
                </Table>
            </motion.div>
            </TableContainer>
        </ThemeProvider>
        <div className="flex items-center justify-center pt-2">
            <Tooltip content="Agregar Producto">
            <Button
                color="success"
                variant="flat"
                isIconOnly
                className="w-8 h-8 min-w-8 rounded-full"
                onClick={onProductTableVisible}
            >
                <FaPlus className="w-6 h-6" />
            </Button>
            </Tooltip>
        </div>
        </div>
    );
};
