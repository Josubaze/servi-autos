import { useState, useEffect } from "react";

// Hook para calcular el IGFT
export const useIgft = (subtotalWithIva: number, igftPercentage: number) => {
  const [calculatedIgft, setCalculatedIgft] = useState<number>(0);

  useEffect(() => {
    const roundedIgft = Number(
      ((subtotalWithIva * igftPercentage) / 100).toFixed(2)
    );
    setCalculatedIgft(roundedIgft);
  }, [subtotalWithIva, igftPercentage]);

  return calculatedIgft;
};
