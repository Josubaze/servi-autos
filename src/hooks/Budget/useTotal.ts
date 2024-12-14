import { useState, useEffect } from "react";

// Hook para calcular el total
export const useTotal = (subtotal: number, iva: number, igft: number) => {
  const [total, setTotal] = useState<number>(0);

  useEffect(() => {
    const roundedTotal = Number((subtotal + iva + igft).toFixed(2));
    setTotal(roundedTotal);
  }, [subtotal, iva, igft]);

  return total;
};
