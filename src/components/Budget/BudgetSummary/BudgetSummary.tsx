// InvoiceSummary.tsx
import React from "react";
import { ThemeProvider } from "@mui/material/styles";
import { TextFieldTheme } from "src/styles/themes/themeTextField";
import { TextField } from "@mui/material";
import { NumericFormat } from "react-number-format";

export const BudgetSummary = () => {
  return (
    <>
      {/* IVA */}
      <div className="grid grid-cols-4 rounded-lg w-full px-8 pt-4 gap-x-6">
        <div className="col-start-3 font-bold content-center text-right">
          <label htmlFor="tax">IVA % :</label>
        </div>
        <div className="bg-black-nav">
          <ThemeProvider theme={TextFieldTheme}>
            <NumericFormat
              customInput={TextField}
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
      </div>

      {/* SUBTOTAL */}
      <div className="grid grid-cols-4 rounded-lg w-full px-8 pt-4 gap-x-6">
        <div className="col-start-3 font-bold content-center text-right">
          <label htmlFor="subtotal">Subtotal :</label>
        </div>
        <div className="bg-black-nav">
          <ThemeProvider theme={TextFieldTheme}>
            <NumericFormat
              customInput={TextField}
              placeholder="SubTotal" 
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
      </div>

      {/* TOTAL */}
      <div className="grid grid-cols-4 w-full mt-4">
        <div className="col-start-3 col-span-2 py-3 pr-8 gap-x-6 bg-indigo-700 rounded-lg grid grid-cols-2">
          <div className="content-center font-bold text-right">Total :</div>
          <div className="content-center font-bold text-right">
            <label>0.00 $</label>
          </div>
        </div>
      </div>
    </>
  );
};

