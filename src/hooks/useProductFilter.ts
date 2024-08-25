import { useEffect, useState, useMemo } from 'react';

export const useProductFilter = (products: Product[], searchTerm: string) => {
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);

  const lowercasedSearchTerm = useMemo(() => searchTerm.toLowerCase(), [searchTerm]);

  useEffect(() => {
    const filtered = products.filter(product =>
      product._id.includes(lowercasedSearchTerm) ||
      product.name.toLowerCase().includes(lowercasedSearchTerm) ||
      product.category.toLowerCase().includes(lowercasedSearchTerm)
    );
    setFilteredProducts(filtered);
  }, [lowercasedSearchTerm, products]);

  return filteredProducts;
};
