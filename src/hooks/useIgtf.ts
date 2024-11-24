import { useState, useEffect } from "react";

// Hook para calcular el IVA
export const useIgft = (subtotalWithIva: number, igftPercentage: number) => {
  const [calculatedIgft, setCalculatedIgft] = useState<number>(0);

  useEffect(() => {
    setCalculatedIgft((subtotalWithIva * igftPercentage) / 100);
  }, [subtotalWithIva, igftPercentage]);

  return calculatedIgft;
};
