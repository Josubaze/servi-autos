import { useMemo } from 'react';

export const useDynamicFilter = <T>(
  data: T[], 
  searchTerm: string, 
  filterKeys: string[] // Ahora aceptamos rutas como 'budgetForm.n_budget'
) => {
  const lowercasedSearchTerm = useMemo(() => searchTerm.toLowerCase(), [searchTerm]);

  const getNestedValue = (obj: any, path: string) => {
    return path.split('.').reduce((value, key) => value?.[key], obj);
  };

  const filteredData = useMemo(() => {
    return data.filter(item =>
      filterKeys.some(keyPath => {
        const value = getNestedValue(item, keyPath); // Acceder a la propiedad anidada
        return String(value || '').toLowerCase().includes(lowercasedSearchTerm);
      })
    );
  }, [lowercasedSearchTerm, data, filterKeys]);

  return filteredData;
};
