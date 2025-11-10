import { useState, useEffect } from 'react';
import { getAllProducts, type Product } from '@/services/productService';

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getAllProducts();
        setProducts(data);
      } catch (err) {
        setError('Error al cargar los productos');
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return {
    products,
    loading,
    error,
    refetch: () => {
      const fetchProducts = async () => {
        try {
          setLoading(true);
          setError(null);
          const data = await getAllProducts();
          setProducts(data);
        } catch (err) {
          setError('Error al cargar los productos');
          console.error('Error fetching products:', err);
        } finally {
          setLoading(false);
        }
      };
      fetchProducts();
    }
  };
};