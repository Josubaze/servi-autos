import { useMemo } from 'react';

export const useProductFilter = (products: Product[], searchTerm: string) => {
  const lowercasedSearchTerm = useMemo(() => searchTerm.toLowerCase(), [searchTerm]);

  const filteredProducts = useMemo(() => {
    return products.filter(product =>
      product._id.includes(lowercasedSearchTerm) ||
      product.name.toLowerCase().includes(lowercasedSearchTerm) ||
      product.category.toLowerCase().includes(lowercasedSearchTerm)
    );
  }, [lowercasedSearchTerm, products]);

  return filteredProducts;
};
