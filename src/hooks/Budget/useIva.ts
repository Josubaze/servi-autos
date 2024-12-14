import { useState, useEffect } from "react";

// Hook para calcular el IVA
export const useIva = (subtotal: number, ivaPercentage: number) => {
  const [calculatedIva, setCalculatedIva] = useState<number>(0);

  useEffect(() => {
    const roundedIva = Number(((subtotal * ivaPercentage) / 100).toFixed(2));
    setCalculatedIva(roundedIva);
  }, [subtotal, ivaPercentage]);

  return calculatedIva;
};
