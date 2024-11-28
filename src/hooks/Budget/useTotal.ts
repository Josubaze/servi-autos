import { useState, useEffect } from "react";

// Hook para calcular el total
export const useTotal = (subtotal: number, iva: number, igft: number) => {
  const [total, setTotal] = useState<number>(0);

  useEffect(() => {
    setTotal(subtotal + iva + igft);
  }, [subtotal, iva, igft]);

  return total;
};
