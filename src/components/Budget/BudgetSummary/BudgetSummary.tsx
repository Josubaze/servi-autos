import React, { useState } from "react";
import { ThemeProvider } from "@mui/material/styles";
import { TextFieldTheme } from "src/styles/themes/themeTextField";
import { TextField } from "@mui/material";
import { NumericFormat } from "react-number-format";
import { useIva } from "src/hooks/useIva";
import { useTotal } from "src/hooks/useTotal";

interface BudgetSummaryProps {
  subtotal: number; // Recibimos el subtotal como prop
}

export const BudgetSummary = ({ subtotal }: BudgetSummaryProps) => {
  const [ivaPercentage, setIvaPercentage] = useState<number>(16); // IVA predeterminado al 16%
  const calculatedIva = useIva(subtotal, ivaPercentage);
  const total = useTotal(subtotal, calculatedIva);

  return (
    <>
      {/* IVA % */}
      <div className="grid grid-cols-12 rounded-lg w-full px-8 pt-4 gap-x-6">
        <div className="col-start-9 font-bold content-center text-right">
          <label htmlFor="tax">IVA % :</label>
        </div>
        <div className="bg-black-nav">
          <ThemeProvider theme={TextFieldTheme}>
            <NumericFormat
              customInput={TextField}
              value={ivaPercentage} 
              onValueChange={(values) => setIvaPercentage(values.floatValue || 0)} // Actualiza el IVA cuando cambia
              placeholder="IVA %"
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
        <div className="bg-black-nav col-span-2">
          <ThemeProvider theme={TextFieldTheme}>
            <NumericFormat
              customInput={TextField}
              value={calculatedIva} 
              placeholder="IVA Calculado"
              variant="outlined"
              fullWidth
              type="text"
              allowNegative={false}
              decimalScale={2}
              fixedDecimalScale={true}
              decimalSeparator=","
              thousandSeparator="."
              sx={{ input: { textAlign: "right" } }}
              disabled 
            />
          </ThemeProvider>
        </div>
      </div>

      {/* Subtotal */}
      <div className="grid grid-cols-4 rounded-lg w-full px-8 pt-4 gap-x-6">
        <div className="col-start-3 font-bold content-center text-right">
          <label htmlFor="subtotal">Subtotal :</label>
        </div>
        <div className="bg-black-nav">
          <ThemeProvider theme={TextFieldTheme}>
            <NumericFormat
              customInput={TextField}
              value={subtotal}  // Muestra el subtotal
              variant="outlined"
              fullWidth
              type="text"
              allowNegative={false}
              decimalScale={2}
              fixedDecimalScale={true}
              decimalSeparator=","
              thousandSeparator="."
              sx={{ input: { textAlign: "right" } }}
              disabled
            />
          </ThemeProvider>
        </div>
      </div>

      <div className="grid grid-cols-4 w-full pt-4">
        <div className="col-start-3 col-span-2 py-3 pr-8 gap-x-6 bg-indigo-700 rounded-lg grid grid-cols-2">
          <div className="content-center font-bold text-right">Total :</div>
          <div className="content-center font-bold text-right pr-3">
            <NumericFormat
              value={total}  
              displayType="text"
              thousandSeparator="."
              decimalSeparator=","
              fixedDecimalScale={true}
              decimalScale={2}
              renderText={(formattedValue) => <label>{formattedValue}</label>}  // Renderiza el valor formateado
            />
          </div>
        </div>
      </div>
    </>
  );
};
