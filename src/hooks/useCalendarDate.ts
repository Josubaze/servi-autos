import { parseDate, CalendarDate } from "@internationalized/date";

export const useCalendarDate = () => {
  /**
   * Transforma una fecha (Date | string | null | undefined) a CalendarDate
   * @param date - Fecha en formato Date, string o null/undefined
   * @returns CalendarDate o null
   */
  const transformToCalendarDate = (date: Date | string | null | undefined): CalendarDate | null => {
    if (!date) return null; // Si es null o undefined, retornamos null

    const jsDate = new Date(date.toString());
    // Ajustar la zona horaria para UTC
    jsDate.setMinutes(jsDate.getMinutes() - jsDate.getTimezoneOffset());
    // Convertir la fecha a CalendarDate
    return parseDate(jsDate.toISOString().split("T")[0]);
  };

  return { transformToCalendarDate };
};
