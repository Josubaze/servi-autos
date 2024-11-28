import { useMemo } from "react";

export const useBudgetSubtotal = (selectedServices: Service[]) => {
// Usamos useMemo para evitar cálculos innecesarios en cada renderizado
const subtotal = useMemo(() => {
    return selectedServices.reduce((acc, service) => {
    // Asegúrate de que service.quantity y service.totalPrice existan y sean números
    const serviceTotal = (service.serviceQuantity || 1) * (service.totalPrice || 0);
    return acc + serviceTotal;
    }, 0);
}, [selectedServices]);

return subtotal;
};
