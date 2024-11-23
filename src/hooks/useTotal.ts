import { useState, useEffect } from "react";

// Hook para calcular el total
export const useTotal = (subtotal: number, iva: number) => {
  const [total, setTotal] = useState<number>(0);

  useEffect(() => {
    setTotal(subtotal + iva);
  }, [subtotal, iva]);

  return total;
};
