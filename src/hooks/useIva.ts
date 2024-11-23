import { useState, useEffect } from "react";

// Hook para calcular el IVA
export const useIva = (subtotal: number, ivaPercentage: number) => {
  const [calculatedIva, setCalculatedIva] = useState<number>(0);

  useEffect(() => {
    setCalculatedIva((subtotal * ivaPercentage) / 100);
  }, [subtotal, ivaPercentage]);

  return calculatedIva;
};
