import { useEffect, useState } from 'react';

export const useProductFilter = (products: Product[], searchTerm: string) => {
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  useEffect(() => {
    const lowercasedSearchTerm = searchTerm.toLowerCase();
    let filtered = products;
  
    if (lowercasedSearchTerm) {
      filtered = products.filter(product =>
        product._id.includes(lowercasedSearchTerm) ||
        product.name.toLowerCase().includes(lowercasedSearchTerm) ||
        product.category.toLowerCase().includes(lowercasedSearchTerm)
      );
    }
  
    // Crear una copia del arreglo antes de ordenarlo
    const sortedFilteredProducts = filtered.slice().sort((a, b) => a.name.localeCompare(b.name));
  
    setFilteredProducts(sortedFilteredProducts);
  }, [searchTerm, products]);

  return filteredProducts;
};
