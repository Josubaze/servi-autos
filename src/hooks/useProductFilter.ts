import { useMemo } from 'react';

export const useDynamicFilter = <T>(
  data: T[], 
  searchTerm: string, 
  filterKeys: (keyof T)[]
) => {
  const lowercasedSearchTerm = useMemo(() => searchTerm.toLowerCase(), [searchTerm]);

  const filteredData = useMemo(() => {
    return data.filter(item =>
      filterKeys.some(key => 
        String(item[key]).toLowerCase().includes(lowercasedSearchTerm)
      )
    );
  }, [lowercasedSearchTerm, data, filterKeys]);

  return filteredData;
};
