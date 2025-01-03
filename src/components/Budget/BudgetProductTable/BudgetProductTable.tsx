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
import { FaPlus } from "react-icons/fa6";

export const BudgetProductTable = ({
  productos,
  servicePrice,
  onServicePriceChange,
  onProductQuantityChange,
  onProductDelete,
  onProductTableVisible
}: ProductTableProps) => {
  
  return (
    <div className="">
      <ThemeProvider theme={darkTheme}>
        <TableContainer component={Paper} 
            className=" border-b-2 border-gray-500 rounded-none rounded-bl-lg rounded-br-lg">
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
                      <NumericFormat
                        value={productInService.product.price}
                        thousandSeparator="."
                        decimalSeparator=","
                        allowNegative={false}
                        decimalScale={2} // Mantener 2 decimales
                        fixedDecimalScale
                        className="bg-transparent"
                        displayType="text"
                      />
                    </TableCell>
                    <TableCell>
                      <NumericFormat
                        value={productInService.product.price * productInService.quantity}
                        thousandSeparator="."
                        decimalSeparator=","
                        allowNegative={false}
                        decimalScale={2} // Mantener 2 decimales
                        fixedDecimalScale
                        className="bg-transparent"
                        displayType="text"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="Eliminar Producto" arrow>
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
                    <NumericFormat
                      value={servicePrice}
                      thousandSeparator="."
                      decimalSeparator=","
                      allowNegative={false}
                      decimalScale={2} // Mantener 2 decimales
                      fixedDecimalScale
                      className="bg-transparent"
                      displayType="text"
                    />
                  </TableCell>
                  <TableCell></TableCell>
                </motion.tr>
              </TableBody>
            </Table>
          </motion.div>
        </TableContainer>
      </ThemeProvider>
      <div className="flex items-center justify-center pt-2">
        <Tooltip title="Agregar Fila" arrow>
            <button className="w-8 h-8 rounded-full bg-transparent border-2 border-gray-600 flex justify-center items-center text-white transition-all ease-in-out delay-150 hover:scale-110 hover:border-green-600 hover:bg-green-600 hover:text-white duration-300">
              <FaPlus className="w-6 h-6 p-1 text-gray-600 hover:text-white transition-all ease-in-out delay-150 hover:scale-110" 
              onClick={onProductTableVisible}
              />
            </button>
        </Tooltip>
      </div>
    </div>
  );
};
