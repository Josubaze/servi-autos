import React, { useState } from "react";
import { ThemeProvider } from "@mui/material/styles";
import { TextFieldTheme } from "src/styles/themes/themeTextField";
import { NumericFormat } from "react-number-format";
import { BudgetProductTable } from "../BudgetProductTable";
import { BudgetAddLineButton } from "../BudgetAddLineButton";
import { TextField, Tooltip } from "@mui/material";
import { MdDelete, MdVisibility } from "react-icons/md";
import { useGetServicesQuery } from "src/redux/services/servicesApi"; // Importamos el query
import { SelectTableServices } from "../SelectTableServices";
import { SERVICEVOID } from "src/utils/constanst";

interface Producto {
  id: number;
  nombre: string;
  categoria: string;
  cantidad: number;
  precio: number;
}

export const BudgetTable = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedService, setSelectedService] = useState(SERVICEVOID);
  const [isTableVisible, setIsTableVisible] = useState<boolean>(false);

  const handleSelect = (service: Service) => {
    console.log('Servicio seleccionado:', service);
    setSelectedService(service); 
  };

  const { data = [], isLoading, isError, isSuccess } = useGetServicesQuery(); 

  const handleViewDetails = () => {
    setShowDetails((prev) => !prev);
  };

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
    setIsTableVisible(false);
  };



  return (
    <>
      <div className="grid grid-cols-6 rounded-lg w-full bg-indigo-700 px-8 py-3">
        <div className="font-bold text-start pl-3 col-span-2">Descripción</div>
        <div className="font-bold text-end pr-6">Cantidad</div>
        <div className="font-bold text-end pr-4">Precio Unitario</div>
        <div className="font-bold text-end pr-3">Precio Total</div>
        <div className="font-bold text-center">Acciones</div>
      </div>

      <div className="grid grid-cols-6 rounded-lg w-full px-8 py-2 mt-4 gap-x-6">
      <div className="col-span-2 bg-black-nav">
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
                    <MdVisibility className="w-12 h-12 p-2 text-blue-600 hover:text-white transition-all ease-in-out delay-150 hover:scale-110" 
                    onClick={handleViewDetails}/>
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


      {/* Tabla de productos */}
      {showDetails && <BudgetProductTable productos={productos} />}


      {isTableVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md">
          <SelectTableServices
            data={data}
            searchTerm=""
            isLoading={isLoading}
            isError={isError}
            isSuccess={isSuccess}
            handleSelect={handleSelect}
            onCloseTable={() => setIsTableVisible(false)}
          />
        </div>
      )}

      {/* Opciones de agregar línea de factura */}
      <BudgetAddLineButton setIsTableVisible={setIsTableVisible} />
    </>
  );
};