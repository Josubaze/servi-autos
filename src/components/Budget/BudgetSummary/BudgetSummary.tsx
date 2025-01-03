import { ThemeProvider } from "@mui/material/styles";
import { TextFieldTheme } from "src/styles/themes/themeTextField";
import { TextField } from "@mui/material";
import { NumericFormat } from "react-number-format";
import { AnimatePresence, motion } from 'framer-motion';

interface BudgetSummaryProps {
  subtotal: number;
  currency: string;
  ivaPercentage: number;
  igtfPercentage: number;
  calculatedIva: number;
  calculatedIgtf: number;
  total: number;
  totalWithIgft: number;
  setIvaPercentage: React.Dispatch<React.SetStateAction<number>>;  
  setIgtfPercentage: React.Dispatch<React.SetStateAction<number>>;  
}

export const BudgetSummary = ({
  subtotal,
  currency,
  ivaPercentage,
  igtfPercentage,
  calculatedIva,
  calculatedIgtf,
  total,
  totalWithIgft,
  setIvaPercentage,
  setIgtfPercentage,
}: BudgetSummaryProps) => {

  return (
    <>
      <div className="flex justify-end items-end w-full px-8">
        <div className="w-full rounded-lg max-w-xl bg-black-nav p-4 border-y-2 border-gray-500">

          {/* Subtotal */}
          <div className="grid grid-cols-4 rounded-lg w-full px-8 gap-x-6">
            <div className="font-bold content-center text-right">
              <label htmlFor="subtotal">Subtotal :</label>
            </div>
            <div className="col-span-3">
              <ThemeProvider theme={TextFieldTheme}>
                <NumericFormat
                  customInput={TextField}
                  value={subtotal} 
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

          {/* IVA % */}
          <div className="grid grid-cols-4 rounded-lg w-full px-8 pt-4 gap-x-6">
            <div className=" font-bold content-center text-right">
              <label htmlFor="tax">IVA % :</label>
            </div>
            <div className="">
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
            <div className=" col-span-2">
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

          {/* IGTF % */}
          <AnimatePresence>
            {currency === '$' && (
              <motion.div
                className="grid grid-cols-4 rounded-lg w-full px-8 pt-4 gap-x-6"
                initial={{ opacity: 0, y: -20 }} 
                animate={{ opacity: 1, y: 0 }}    
                exit={{ opacity: 0, y: -20 }}    
                transition={{ duration: 0.5 }}
              >
                <div className="font-bold content-center text-right">
                  <label htmlFor="tax">IGTF % :</label>
                </div>            
                <ThemeProvider theme={TextFieldTheme}>
                  <NumericFormat
                    customInput={TextField}
                    value={igtfPercentage}
                    onValueChange={(values) => setIgtfPercentage(values.floatValue || 0)} // Actualiza el IVA cuando cambia
                    placeholder="IGTF %"
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
               
                <div className="col-span-2">
                  <ThemeProvider theme={TextFieldTheme}>
                    <NumericFormat
                      customInput={TextField}
                      value={calculatedIgtf}
                      placeholder="IGTF Calculado"
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
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Total */}
      <div className="flex justify-end items-end w-full">
      <div className="grid grid-cols-4 w-full pt-4">
        <div className="col-start-3 col-span-2 py-3 pr-8 gap-x-6 bg-indigo-700 rounded-lg grid grid-cols-2">
          <div className="content-center font-bold text-right">Total :</div>
          <div className="content-center font-bold text-right pr-3">
            <NumericFormat
              value={currency == '$' ? totalWithIgft : total }
              displayType="text"
              thousandSeparator="."
              decimalSeparator=","
              fixedDecimalScale={true}
              decimalScale={2}
              renderText={(formattedValue) => 
                (currency === '$' ? <label>{'$ '+formattedValue}</label> : <label>{'Bs '+formattedValue}</label>)
              }
            />
          </div>
        </div>
      </div>
      </div>



    </>
    
  );
};
