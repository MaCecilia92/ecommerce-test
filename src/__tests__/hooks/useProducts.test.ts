import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useProducts } from '@/hooks/useProducts';
import * as productService from '@/services/productService';
import type { Product } from '@/services/productService';

// Mock the product service
vi.mock('@/services/productService');

const mockProducts: Product[] = [
  {
    id: 1,
    title: 'Test Product 1',
    price: 29.99,
    description: 'Test description',
    category: 'electronics',
    image: 'test-image-1.jpg',
    rating: { rate: 4.5, count: 100 }
  },
  {
    id: 2,
    title: 'Test Product 2',
    price: 19.99,
    description: 'Test description 2',
    category: 'clothing',
    image: 'test-image-2.jpg',
    rating: { rate: 4.0, count: 50 }
  }
];

describe('useProducts Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return loading state initially', () => {
    vi.mocked(productService.getAllProducts).mockImplementation(() => 
      new Promise(() => {}) // Never resolves
    );

    const { result } = renderHook(() => useProducts());

    expect(result.current.loading).toBe(true);
    expect(result.current.products).toEqual([]);
    expect(result.current.error).toBe(null);
  });

  it('should return products when API call succeeds', async () => {
    vi.mocked(productService.getAllProducts).mockResolvedValue(mockProducts);

    const { result } = renderHook(() => useProducts());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.products).toEqual(mockProducts);
    expect(result.current.error).toBe(null);
  });

  it('should return error when API call fails', async () => {
    const errorMessage = 'Failed to fetch products';
    vi.mocked(productService.getAllProducts).mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useProducts());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.products).toEqual([]);
    expect(result.current.error).toBe('Error al cargar los productos');
  });

  it('should refetch products when refetch is called', async () => {
    vi.mocked(productService.getAllProducts)
      .mockResolvedValueOnce(mockProducts.slice(0, 1))
      .mockResolvedValueOnce(mockProducts);

    const { result } = renderHook(() => useProducts());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.products).toEqual([mockProducts[0]]);

    // Call refetch
    result.current.refetch();

    await waitFor(() => {
      expect(result.current.products).toEqual(mockProducts);
    });

    expect(productService.getAllProducts).toHaveBeenCalledTimes(2);
  });

  it('should handle unknown error types', async () => {
    vi.mocked(productService.getAllProducts).mockRejectedValue('Unknown error');

    const { result } = renderHook(() => useProducts());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe('Error al cargar los productos');
  });
});