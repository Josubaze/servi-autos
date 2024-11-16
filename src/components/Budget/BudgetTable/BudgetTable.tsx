import React from "react";
import { FaPlus } from "react-icons/fa";
import { MdDelete, MdVisibility } from "react-icons/md"; 
import TextField from "@mui/material/TextField";
import { ThemeProvider } from "@mui/material/styles";
import { TextFieldTheme } from "src/styles/themes/themeTextField";
import { NumericFormat } from "react-number-format";
import Tooltip from "@mui/material/Tooltip"; 
import { FaBoxes } from "react-icons/fa";
import { FaTools } from "react-icons/fa";
import { FaArrowLeftLong } from "react-icons/fa6";

export const BudgetTable = () => {
  return (
    <>
      {/* columnas de tabla */}
      <div className="grid grid-cols-6 rounded-lg w-full bg-indigo-700 px-8 py-3"> {/* Cambiar grid-cols-4 a grid-cols-6 */}
        <div className="font-bold text-start pl-3 col-span-2">Descripción</div> {/* Columna más ancha para Descripción */}
        <div className="font-bold text-end pr-6">Cantidad</div>
        <div className="font-bold text-end pr-4">Precio Unitario</div>
        <div className="font-bold text-end pr-3">Precio Total</div>
        <div className="font-bold text-center">Acciones</div> {/* Columna más estrecha para Acciones */}
      </div>

      {/* datos de tabla */}
      <div className="grid grid-cols-6 rounded-lg w-full px-8 pt-4 gap-x-6"> {/* Cambiar grid-cols-4 a grid-cols-6 */}
        <div className="bg-black-nav col-span-2">
          <ThemeProvider theme={TextFieldTheme}>
            <TextField
              placeholder="Descripción"
              variant="outlined"
              fullWidth
              type="text"
              className="text-right"
            />
          </ThemeProvider>
        </div>

        <div className="bg-black-nav">
          <ThemeProvider theme={TextFieldTheme}>
            <NumericFormat
              customInput={TextField}
              placeholder="Cantidad"
              variant="outlined"
              fullWidth
              type="text"
              allowNegative={false}
              decimalScale={0}
              fixedDecimalScale={false}
              decimalSeparator=","
              thousandSeparator="."
              sx={{ input: { textAlign: "right" } }}
            />
          </ThemeProvider>
        </div>

        <div className="bg-black-nav">
          <ThemeProvider theme={TextFieldTheme}>
            <NumericFormat
              customInput={TextField}
              placeholder="Precio Unitario"
              variant="outlined"
              fullWidth
              type="text"
              decimalSeparator=","
              thousandSeparator="."
              decimalScale={2}
              fixedDecimalScale
              allowNegative={false}
              sx={{ input: { textAlign: "right" } }}
            />
          </ThemeProvider>
        </div>

        <div className="bg-black-nav">
          <ThemeProvider theme={TextFieldTheme}>
            <NumericFormat
              customInput={TextField}
              placeholder="Precio Total"
              variant="outlined"
              fullWidth
              type="text"
              decimalSeparator=","
              thousandSeparator="."
              decimalScale={2}
              fixedDecimalScale
              allowNegative={false}
              sx={{ input: { textAlign: "right" } }}
            />
          </ThemeProvider>
        </div>

        {/* Columna de botones */}
        <div className="flex justify-center items-center gap-4">
          {/* Botón Ver Detalles */}
            <Tooltip title="Ver Detalles" arrow>
                <button className="w-12 h-12 rounded-full bg-transparent border-2 border-blue-600 flex justify-center items-center text-white transition-all ease-in-out delay-150 hover:scale-110 hover:bg-blue-600 hover:text-white duration-300">
                    <MdVisibility className="w-12 h-12 p-2 text-blue-600 hover:text-white transition-all ease-in-out delay-150 hover:scale-110" />
                </button>
            </Tooltip>

          {/* Botón Eliminar */}
          <Tooltip title="Eliminar Fila" arrow>
            <button className="w-12 h-12 rounded-full bg-transparent border-2 border-red-600 flex justify-center items-center text-white transition-all ease-in-out delay-150 hover:scale-110 hover:bg-red-600 hover:text-white duration-300">
              <MdDelete className="w-12 h-12 p-2 text-red-600 hover:text-white transition-all ease-in-out delay-150 hover:scale-110" />
            </button>
          </Tooltip>
        </div>
      </div>

      {/* opciones de agregar linea de factura */}
        <div className="grid grid-cols-6 rounded-lg w-full px-8 pt-4 gap-x-6">
            {/* Columna para los botones */}
            <div className="col-span-2 gap-x-4 flex justify-center items-center">
                <Tooltip title="Agregar Fila" arrow>
                <button className="w-12 h-12 rounded-full bg-transparent border-2 border-green-600 flex justify-center items-center text-white transition-all ease-in-out delay-150 hover:scale-110 hover:bg-green-600 hover:text-white duration-300">
                    <FaPlus className="w-12 h-12 p-2 text-green-600 hover:text-white transition-all ease-in-out delay-150 hover:scale-110" />
                </button>
                </Tooltip>

                <Tooltip title="Agregar Servicio" arrow>
                <button className="w-12 h-12 rounded-full bg-transparent border-2 border-green-600 flex justify-center items-center text-white transition-all ease-in-out delay-150 hover:scale-110 hover:bg-green-600 hover:text-white duration-300">
                    <FaTools className="w-12 h-12 p-2 text-green-600 hover:text-white transition-all ease-in-out delay-150 hover:scale-110" />
                </button>
                </Tooltip>

                <Tooltip title="Agregar Producto" arrow>
                <button className="w-12 h-12 rounded-full bg-transparent border-2 border-green-600 flex justify-center items-center text-white transition-all ease-in-out delay-150 hover:scale-110 hover:bg-green-600 hover:text-white duration-300">
                    <FaBoxes className="w-12 h-12 p-2 text-green-600 hover:text-white transition-all ease-in-out delay-150 hover:scale-110" />
                </button>
                </Tooltip>

                {/* Flecha y texto */}
                <div className="flex gap-x-2">
                    <FaArrowLeftLong className="text-3xl animate-bounce"/>
                    <span className="text-lg font-semibold text-green-600" >Agregar</span>
                    
                </div>
            </div>
        </div>
    </>
  );
};
