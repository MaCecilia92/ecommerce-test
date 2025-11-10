import { useState, useEffect } from 'react';
import { getProductById, type Product } from '@/services/productService';

interface UseProductReturn {
  product: Product | null;
  loading: boolean;
  error: string | null;
  notFound: boolean;
  refetch: () => void;
}

export const useProduct = (id: string | undefined): UseProductReturn => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) {
        setError('ID de producto no válido');
        setNotFound(true);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        setNotFound(false);
        const data = await getProductById(id);
        setProduct(data);
      } catch (err: unknown) {
        console.error('Error fetching product:', err);
        
        // Verificar si es un error 404 (producto no encontrado)
        const errorMessage = err instanceof Error ? err.message : String(err);
        if (errorMessage.includes('404')) {
          setNotFound(true);
          setError('Producto no encontrado');
        } else {
          setError('Error al cargar el producto. Verifica tu conexión a internet.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const refetch = () => {
    if (!id) return;
    
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        setNotFound(false);
        const data = await getProductById(id);
        setProduct(data);
      } catch (err: unknown) {
        console.error('Error fetching product:', err);
        
        const errorMessage = err instanceof Error ? err.message : String(err);
        if (errorMessage.includes('404')) {
          setNotFound(true);
          setError('Producto no encontrado');
        } else {
          setError('Error al cargar el producto. Verifica tu conexión a internet.');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  };

  return {
    product,
    loading,
    error,
    notFound,
    refetch
  };
};