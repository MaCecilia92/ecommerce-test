import { useState, useMemo } from 'react';
import { type Product } from '@/services/productService';

export const useProductSearch = (products: Product[]) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = useMemo(() => {
    if (!searchTerm.trim()) {
      return products;
    }

    return products.filter(product =>
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  return {
    searchTerm,
    setSearchTerm,
    filteredProducts,
    hasResults: filteredProducts.length > 0,
    resultsCount: filteredProducts.length
  };
};