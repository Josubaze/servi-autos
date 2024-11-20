import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tooltip,
  ThemeProvider,
  Typography,
} from "@mui/material";
import { MdDelete } from "react-icons/md";
import { motion } from "framer-motion";
import { darkTheme } from "src/styles/themes/themeTable";
import { NumericFormat } from "react-number-format";

export const BudgetProductTable = ({
  productos,
  servicePrice,
  onServicePriceChange,
  onProductQuantityChange,
  onProductDelete,
}: ProductTableProps) => {
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
            <Typography className="pl-4" variant="h6" component="div">Detalles del Servicio</Typography>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Categoría</TableCell>
                  <TableCell>Cantidad</TableCell>
                  <TableCell>Precio Unitario</TableCell>
                  <TableCell>Precio Total</TableCell>
                  <TableCell>Acciones</TableCell>
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
                      <NumericFormat
                        value={productInService.quantity}
                        thousandSeparator="."
                        decimalSeparator=","
                        allowNegative={false}
                        decimalScale={0} // No decimales para cantidad
                        className="bg-transparent w-16"
                        onValueChange={({ value }) =>
                          onProductQuantityChange(productInService.product._id, parseInt(value) || 1)
                        }
                      />
                    </TableCell>
                    <TableCell>
                      {new Intl.NumberFormat("es-ES", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                      }).format(productInService.product.price)}
                    </TableCell>
                    <TableCell>
                      {new Intl.NumberFormat("es-ES", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }).format(productInService.product.price * productInService.quantity)}
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="Eliminar Producto">
                        <button
                          className="w-6 h-6 rounded-full bg-transparent border border-red-600 flex justify-center items-center text-red-600 transition-all ease-in-out delay-150 hover:bg-red-600 hover:text-white"
                          onClick={() => onProductDelete(productInService.product._id)}
                        >
                          <MdDelete className="w-5 h-5" />
                        </button>
                      </Tooltip>
                    </TableCell>
                  </motion.tr>
                ))}
                {/* Agregar la fila de Mano de Obra */}
                <motion.tr
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.4 }}
                >
                  <TableCell colSpan={1}></TableCell>
                  <TableCell>Mano de Obra</TableCell>
                  <TableCell></TableCell>
                  <TableCell>1</TableCell>
                  <TableCell>
                  <ThemeProvider theme={darkTheme}>
                    <NumericFormat
                      value={servicePrice.toFixed(2)}
                      thousandSeparator="."
                      decimalSeparator=","
                      decimalScale={2}
                      fixedDecimalScale
                      allowNegative={false}
                      className="bg-transparent w-16"
                      onValueChange={({ value }) => onServicePriceChange(parseFloat(value) || 0)}
                    />
                  </ThemeProvider>
                  </TableCell>
                  <TableCell>
                    {new Intl.NumberFormat("es-ES", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    }).format(servicePrice)}
                  </TableCell>
                  <TableCell></TableCell>
                </motion.tr>
              </TableBody>
            </Table>
          </motion.div>
        </TableContainer>
      </ThemeProvider>
    </div>
  );
};
