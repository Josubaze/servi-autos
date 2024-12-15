export const useBudgetSummary = () => {
  // Función para calcular el Subtotal
  const calculateSubtotal = (selectedServices: Service[]) => {
    return selectedServices.reduce((acc, service) => {
      const serviceTotal = (service.serviceQuantity || 1) * (service.totalPrice || 0);
      return acc + serviceTotal;
    }, 0);
  };

  // Función para calcular el IVA
  const calculateIva = (subtotal: number, ivaPercentage: number) => {
    return Math.round((subtotal * ivaPercentage) / 100 * 100) / 100;
  };

  // Función para calcular el IGFT
  const calculateIgft = (subtotalWithIva: number, igftPercentage: number) => {
    return Math.round((subtotalWithIva * igftPercentage) / 100 * 100) / 100;
  };

  // Función para calcular el Total
  const calculateTotal = (subtotal: number, iva: number, igft: number) => {
    return Math.round((subtotal + iva + igft) * 100) / 100;
  };

  return {
    calculateSubtotal,
    calculateIva,
    calculateIgft,
    calculateTotal,
  };
};
