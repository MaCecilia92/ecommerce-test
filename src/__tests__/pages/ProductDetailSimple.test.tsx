import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import type { Product } from '@/services/productService';

// Mock the hooks first
vi.mock('@/hooks', () => ({
  useProduct: vi.fn(),
}));

// Mock react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: () => ({ id: '1' }),
    Link: ({ children, to }: { children: React.ReactNode; to: string }) => <a href={to}>{children}</a>
  };
});

// Mock pages and components
vi.mock('@/pages', () => ({
  ErrorPage: () => <div data-testid="error-page">Error Page</div>,
}));

vi.mock('@/components', () => ({
  LoadingError: ({ error }: { error: string }) => (
    <div data-testid="loading-error">{error}</div>
  ),
  LoadingSpinner: ({ message }: { message?: string }) => (
    <div data-testid="loading-spinner">{message || 'Loading...'}</div>
  ),
}));

// Import after mocking
import ProductDetail from '@/pages/ProductDetail';
import { useProduct } from '@/hooks';

const mockProduct: Product = {
  id: 1,
  title: 'Test Product',
  price: 29.99,
  description: 'Test product description',
  category: 'electronics',
  image: 'test-image.jpg',
  rating: { rate: 4.5, count: 100 }
};

describe('ProductDetail Page', () => {
  const mockUseProduct = vi.mocked(useProduct);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state', () => {
    mockUseProduct.mockReturnValue({
      product: null,
      loading: true,
      error: null,
      notFound: false,
      refetch: vi.fn(),
    });

    render(
      <MemoryRouter>
        <ProductDetail />
      </MemoryRouter>
    );

    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('renders error state', () => {
    mockUseProduct.mockReturnValue({
      product: null,
      loading: false,
      error: 'Product not found',
      notFound: true,
      refetch: vi.fn(),
    });

    render(
      <MemoryRouter>
        <ProductDetail />
      </MemoryRouter>
    );

    expect(screen.getByTestId('error-page')).toBeInTheDocument();
  });

  it('renders product details', () => {
    mockUseProduct.mockReturnValue({
      product: mockProduct,
      loading: false,
      error: null,
      notFound: false,
      refetch: vi.fn(),
    });

    render(
      <MemoryRouter>
        <ProductDetail />
      </MemoryRouter>
    );

    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('$29.99')).toBeInTheDocument();
    expect(screen.getByText('Test product description')).toBeInTheDocument();
  });

  it('renders product image', () => {
    mockUseProduct.mockReturnValue({
      product: mockProduct,
      loading: false,
      error: null,
      notFound: false,
      refetch: vi.fn(),
    });

    render(
      <MemoryRouter>
        <ProductDetail />
      </MemoryRouter>
    );

    const productImage = screen.getByAltText('Test Product');
    expect(productImage).toBeInTheDocument();
    expect(productImage).toHaveAttribute('src', 'test-image.jpg');
  });

  it('renders rating information', () => {
    mockUseProduct.mockReturnValue({
      product: mockProduct,
      loading: false,
      error: null,
      notFound: false,
      refetch: vi.fn(),
    });

    render(
      <MemoryRouter>
        <ProductDetail />
      </MemoryRouter>
    );

    expect(screen.getByText('4.5')).toBeInTheDocument();
    expect(screen.getByText('(100 reseñas)')).toBeInTheDocument();
  });

  it('renders back to home link', () => {
    mockUseProduct.mockReturnValue({
      product: mockProduct,
      loading: false,
      error: null,
      notFound: false,
      refetch: vi.fn(),
    });

    render(
      <MemoryRouter>
        <ProductDetail />
      </MemoryRouter>
    );

    const backLink = screen.getByText('← Volver al inicio');
    expect(backLink).toBeInTheDocument();
  });
});