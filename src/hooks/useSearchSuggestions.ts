import { useMemo } from 'react';
import { type Product } from '@/services/productService';

// Términos populares predefinidos
const POPULAR_SEARCH_TERMS = [
  'clothing', 'electronics', 'jewelry', 'men', 'women',
  'backpack', 'shirt', 'jacket', 'ring', 'necklace'
];

export const useSearchSuggestions = (products: Product[], searchTerm: string) => {
  const suggestions = useMemo(() => {
    if (!searchTerm.trim() || searchTerm.length < 2) {
      return {
        categories: [],
        relatedTerms: [],
        popularProducts: [],
        showPopularTerms: false
      };
    }

    const term = searchTerm.toLowerCase();
    
    // Obtener categorías únicas que coincidan
    const matchingCategories = [...new Set(
      products
        .filter(product => product.category.toLowerCase().includes(term))
        .map(product => product.category)
    )].slice(0, 3);

    // Obtener términos relacionados de títulos de productos
    const relatedTerms = [...new Set(
      products
        .filter(product => 
          product.title.toLowerCase().includes(term) || 
          product.description.toLowerCase().includes(term)
        )
        .flatMap(product => {
          const words = product.title.toLowerCase().split(/[\s,-]+/);
          return words.filter(word => 
            word.length > 3 && 
            word.includes(term) && 
            word !== term &&
            /^[a-zA-Z]+$/.test(word) // Solo palabras sin números o símbolos
          );
        })
    )].slice(0, 4);

    // Si no hay términos relacionados suficientes, agregar términos populares que coincidan
    if (relatedTerms.length < 3) {
      const popularMatches = POPULAR_SEARCH_TERMS.filter(popularTerm => 
        popularTerm.includes(term) && !relatedTerms.includes(popularTerm)
      );
      relatedTerms.push(...popularMatches.slice(0, 3 - relatedTerms.length));
    }

    // Productos populares (basado en rating)
    const popularProducts = products
      .filter(product => 
        product.title.toLowerCase().includes(term) ||
        product.category.toLowerCase().includes(term)
      )
      .sort((a, b) => b.rating.rate - a.rating.rate)
      .slice(0, 3);

    return {
      categories: matchingCategories,
      relatedTerms,
      popularProducts,
      showPopularTerms: relatedTerms.length > 0 || matchingCategories.length > 0 || popularProducts.length > 0
    };
  }, [products, searchTerm]);

  return suggestions;
};