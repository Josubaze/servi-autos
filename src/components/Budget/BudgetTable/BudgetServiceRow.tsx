import React from "react";
import { MdDelete, MdVisibility } from "react-icons/md";
import { ThemeProvider, Tooltip, TextField } from "@mui/material";
import { TextFieldTheme } from "src/styles/themes/themeTextField";
import { NumericFormat } from "react-number-format";
import { BudgetProductTable } from "../BudgetProductTable";

export const BudgetServiceRow: React.FC<{
  service: Service;
  serviceDetailsVisible: boolean;
  onViewDetails: (service: Service) => void;
  onDeleteRow: (id: string) => void;
  onNameChange: (value: string, id: string) => void;
  onQuantityChange: (value: string, id: string) => void;
  onPriceChange: (id: string, newPrice: number) => void;
  onProductQuantityChange: (serviceId: string, productId: string, newQuantity: number) => void;
  onProductDelete: (productId: string) => void;
  onShowProductTable: (serviceId: string) => void;
}> = ({
  service,
  serviceDetailsVisible,
  onViewDetails,
  onDeleteRow,
  onNameChange,
  onQuantityChange,
  onPriceChange,
  onProductQuantityChange,
  onProductDelete,
  onShowProductTable,
}) => {
  return (
    <div className="px-8 pt-4">
      <div  className=" bg-black-nav rounded-none rounded-tl-lg rounded-tr-lg p-4 border-t-2 border-gray-500  ">

        <div className="grid grid-cols-12 rounded-lg w-full gap-x-4">

            <div className="col-span-5">
              <ThemeProvider theme={TextFieldTheme}>
                <TextField
                  value={service.name}
                  variant="outlined"
                  fullWidth
                  type="text"
                  className="text-right"
                  onChange={(e) => onNameChange(service._id, e.target.value)}
                />
              </ThemeProvider>
            </div>

            <div className="col-span-2">
              <ThemeProvider theme={TextFieldTheme}>
                <NumericFormat
                  value={service.serviceQuantity}
                  customInput={TextField}
                  variant="outlined"
                  fullWidth
                  type="text"
                  allowNegative={false}
                  decimalScale={0}
                  fixedDecimalScale={false}
                  decimalSeparator=","
                  thousandSeparator="."
                  sx={{ input: { textAlign: "right" } }}
                  onValueChange={({ value }) => onQuantityChange(value, service._id)}
                  isAllowed={(values) => {
                    const { floatValue } = values;
                    return floatValue !== undefined && floatValue > 0;
                  }}
                />
              </ThemeProvider>
            </div>

            <div className="col-span-2">
              <ThemeProvider theme={TextFieldTheme}>
                <NumericFormat
                  value={service.totalPrice.toFixed(2)}
                  customInput={TextField}
                  variant="outlined"
                  fullWidth
                  type="text"
                  decimalSeparator=","
                  thousandSeparator="."
                  decimalScale={2}
                  fixedDecimalScale
                  allowNegative={false}
                  sx={{ input: { textAlign: "right" } }}
                  disabled
                />
              </ThemeProvider>
            </div>

            <div className="col-span-2">
              <ThemeProvider theme={TextFieldTheme}>
                <NumericFormat
                  value={(service.totalPrice * service.serviceQuantity).toFixed(2)}
                  customInput={TextField}
                  variant="outlined"
                  fullWidth
                  type="text"
                  decimalSeparator=","
                  thousandSeparator="."
                  decimalScale={2}
                  fixedDecimalScale
                  allowNegative={false}
                  sx={{ input: { textAlign: "right" } }}
                  disabled
                />
              </ThemeProvider>
            </div>

            <div className="flex justify-center items-center gap-x-2 ">
              <Tooltip title="Ver Detalles" arrow>
                <button
                  className="w-10 h-10 xl:w-12 xl:h-12 rounded-full bg-transparent border-2 border-blue-600 flex justify-center items-center text-white transition-all ease-in-out delay-150 hover:scale-110 hover:bg-blue-600 hover:text-white duration-300"
                  onClick={() => onViewDetails(service)}
                >
                  <MdVisibility className="w-10 h-10 xl:w-12 xl:h-12 p-1 xl:p-2 text-blue-600 hover:text-white transition-all ease-in-out delay-150 hover:scale-110" />
                </button>
              </Tooltip>
              <Tooltip title="Eliminar Fila" arrow>
                <button
                  className="w-10 h-10 xl:w-12 xl:h-12 rounded-full bg-transparent border-2 border-red-600 flex justify-center items-center text-white transition-all ease-in-out delay-150 hover:scale-110 hover:bg-red-600 hover:text-white duration-300"
                  onClick={() => onDeleteRow(service._id)}
                >
                  <MdDelete className="w-10 h-10 xl:w-12 xl:h-12 p-1 xl:p-2 text-red-600 hover:text-white transition-all ease-in-out delay-150 hover:scale-110" />
                </button>
              </Tooltip>
            </div>
        </div>
      </div>

      {serviceDetailsVisible && (
        <BudgetProductTable
          productos={service.products}
          servicePrice={service.servicePrice || 0}
          onServicePriceChange={(newPrice) => onPriceChange(service._id, newPrice)}
          onProductQuantityChange={(productId, newQuantity) =>
            onProductQuantityChange(service._id, productId, newQuantity)
          }
          onProductDelete={(productId) => onProductDelete(productId)}
          onProductTableVisible={() => onShowProductTable(service._id)}
        />
      )}
    </div>
  );
};
