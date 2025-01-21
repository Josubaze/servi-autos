import { NumericFormat } from "react-number-format";
import { AnimatePresence, motion } from 'framer-motion';
import { Input } from "@nextui-org/react";

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
        <div className="w-full rounded-lg max-w-xl bg-black-nav/50 p-4">

          {/* Subtotal */}
          <div className="grid grid-cols-4 rounded-lg w-full px-8 gap-x-6">
            <div className="font-bold content-center text-right">
              <label htmlFor="subtotal">Subtotal :</label>
            </div>
            <div className="col-span-3">
              <Input
                size="md"
                value={Number(subtotal).toLocaleString("de-DE", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
                variant="underlined"
                fullWidth
                disabled
                style={{ textAlign: "right" }}
                type="text"
                inputMode="numeric"
              />
            </div>
          </div>

          {/* IVA % */}
          <div className="grid grid-cols-4 rounded-lg w-full px-8 pt-4 gap-x-6">
            <div className=" font-bold content-center text-right">
              <label htmlFor="tax">IVA % :</label>
            </div>
            <div>           
              <Input
                size="md"
                value={Number(ivaPercentage).toLocaleString("de-DE", {
                  minimumFractionDigits: 0,
                })}
                onChange={(e) => {
                  const value = e.target.value.replace(/\./g, "").replace(/,/g, "");
                  if (!isNaN(Number(value)) && Number(value) >= 0) {
                    setIvaPercentage(Number(value));
                  }
                }}
                variant="underlined"
                fullWidth
                style={{ textAlign: "right" }}
                type="text"
                inputMode="numeric"
              />
            </div>
            <div className="col-span-2">
              <Input
                size="md"
                value={Number(calculatedIva).toLocaleString("de-DE", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
                variant="underlined"
                fullWidth
                disabled
                style={{ textAlign: "right" }}
                type="text"
                inputMode="numeric"
              />
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
                <div>
                  <Input
                    size="md"
                    value={Number(igtfPercentage).toLocaleString("de-DE", {
                      minimumFractionDigits: 0,
                    })}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\./g, "").replace(/,/g, "");
                      if (!isNaN(Number(value)) && Number(value) >= 0) {
                        setIgtfPercentage(Number(value));
                      }
                    }}
                    variant="underlined"
                    fullWidth
                    style={{ textAlign: "right" }}
                    type="text"
                    inputMode="numeric"
                  />
                </div>     
          
                <div className="col-span-2">
                  <Input
                    size="md"
                    value={Number(calculatedIgtf).toLocaleString("de-DE", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                    variant="underlined"
                    fullWidth
                    disabled
                    style={{ textAlign: "right" }}
                    type="text"
                    inputMode="numeric"
                  />
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
