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
    // Ordenar los productos filtrados por nombre
    filtered = filtered.sort((a, b) => a.name.localeCompare(b.name));
    setFilteredProducts(filtered);
  }, [searchTerm, products]);

  return filteredProducts;
};
