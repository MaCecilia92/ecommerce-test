import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { getAllProducts, getProductById } from '../../services/productService';

// Mock global fetch
const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

describe('productService', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('getAllProducts', () => {
    it('should fetch products successfully', async () => {
      const mockProducts = [
        { id: 1, title: 'Product 1', price: 100, description: 'Description 1' },
        { id: 2, title: 'Product 2', price: 200, description: 'Description 2' }
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockProducts,
      });

      const result = await getAllProducts();

      expect(mockFetch).toHaveBeenCalledWith('https://fakestoreapi.com/products');
      expect(result).toEqual(mockProducts);
    });

    it('should handle network errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(getAllProducts()).rejects.toThrow('Network error');
    });

    it('should handle HTTP errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      });

      await expect(getAllProducts()).rejects.toThrow();
    });

    it('should handle invalid JSON response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => {
          throw new Error('Invalid JSON');
        },
      });

      await expect(getAllProducts()).rejects.toThrow('Invalid JSON');
    });
  });

  describe('getProductById', () => {
    it('should fetch single product successfully', async () => {
      const mockProduct = {
        id: 1,
        title: 'Test Product',
        price: 99.99,
        description: 'Test Description',
        category: 'electronics',
        image: 'test-image.jpg',
        rating: { rate: 4.5, count: 100 }
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockProduct,
      });

      const result = await getProductById(1);

      expect(mockFetch).toHaveBeenCalledWith('https://fakestoreapi.com/products/1');
      expect(result).toEqual(mockProduct);
    });

    it('should handle product not found', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      });

      await expect(getProductById(999)).rejects.toThrow();
    });

    it('should handle invalid product ID', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => null,
      });

      const result = await getProductById(0);
      expect(result).toBeNull();
    });

    it('should handle string product ID', async () => {
      const mockProduct = { id: 5, title: 'Product 5', price: 50 };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockProduct,
      });

      const result = await getProductById('5');

      expect(mockFetch).toHaveBeenCalledWith('https://fakestoreapi.com/products/5');
      expect(result).toEqual(mockProduct);
    });

    it('should handle network timeout', async () => {
      mockFetch.mockImplementationOnce(() => 
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout')), 100)
        )
      );

      await expect(getProductById(1)).rejects.toThrow('Timeout');
    });

    it('should handle malformed API response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ invalid: 'data' }),
      });

      const result = await getProductById(1);
      expect(result).toEqual({ invalid: 'data' });
    });
  });

  describe('API endpoint validation', () => {
    it('should use correct base URL', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      });

      await getAllProducts();
      expect(mockFetch).toHaveBeenCalledWith('https://fakestoreapi.com/products');
    });

    it('should construct product detail URL correctly', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      });

      await getProductById(123);
      expect(mockFetch).toHaveBeenCalledWith('https://fakestoreapi.com/products/123');
    });
  });

  describe('Error handling edge cases', () => {
    it('should handle undefined response', async () => {
      mockFetch.mockResolvedValueOnce(undefined);

      await expect(getAllProducts()).rejects.toThrow();
    });

    it('should handle empty response body', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => undefined,
      });

      const result = await getAllProducts();
      expect(result).toBeUndefined();
    });

    it('should handle server error 500', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      });

      await expect(getAllProducts()).rejects.toThrow();
    });
  });
});