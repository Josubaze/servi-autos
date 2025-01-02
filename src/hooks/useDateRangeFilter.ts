import { useMemo } from 'react';

interface DateRange {
  start: { calendar: string; era: string; year: number; month: number; day: number };
  end: { calendar: string; era: string; year: number; month: number; day: number };
}

export const useDateRangeFilter = <T>(
  data: T[], 
  selectedRange: DateRange | null 
) => {
  const filterByDateRange = useMemo(() => {
    // Comprobamos que selectedRange no sea null y que tanto start como end existan
    if (!selectedRange?.start || !selectedRange?.end) {
      return data; 
    }

    // Convierte las fechas de inicio y fin del rango a objetos Date con la hora configurada a las 00:00:00
    const startDate = new Date(
      selectedRange.start.year,
      selectedRange.start.month - 1, // El mes es 0-based
      selectedRange.start.day
    );
    startDate.setHours(0, 0, 0, 0); // Asegura que la hora sea 00:00:00

    const endDate = new Date(
      selectedRange.end.year,
      selectedRange.end.month - 1,
      selectedRange.end.day
    );
    endDate.setHours(23, 59, 59, 999); // Asegura que el final del día sea 23:59:59

    // Filtra los presupuestos por la fecha de creación
    return data.filter((item: any) => {
      // Si item.budgetForm.dateCreation es un string, debes convertirlo a Date:
      const creationDate = new Date(item.form.dateCreation);
      creationDate.setHours(0, 0, 0, 0); // Asegura que la hora de la fecha de creación sea 00:00:00

      // Verifica si la fecha de creación está dentro del rango
      return creationDate >= startDate && creationDate <= endDate;
    });
  }, [data, selectedRange]);

  return filterByDateRange;
};
