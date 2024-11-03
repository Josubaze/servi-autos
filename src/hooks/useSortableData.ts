import { useState, useMemo } from 'react';

type Order = 'asc' | 'desc';

interface SortableData<T> {
  sortedData: T[];
  order: Order;
  orderBy: keyof T | null;
  handleRequestSort: (property: keyof T) => void;
}

export function useSortableData<T>(data: T[], initialOrderBy: keyof T): SortableData<T> {
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<keyof T | null>(initialOrderBy);

  const sortedData = useMemo(() => {
    return data.slice().sort((a, b) => {
      if (orderBy && a[orderBy] != null && b[orderBy] != null) {
        if (a[orderBy] < b[orderBy]) return order === 'asc' ? -1 : 1;
        if (a[orderBy] > b[orderBy]) return order === 'asc' ? 1 : -1;
        return 0;
      }
      return 0; // Si alguno es null o undefined, no cambiamos su orden
    });
  }, [data, order, orderBy]);

  const handleRequestSort = (property: keyof T) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  return { sortedData, order, orderBy, handleRequestSort };
}
