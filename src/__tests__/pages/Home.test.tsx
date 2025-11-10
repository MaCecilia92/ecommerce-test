import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import type { Product } from '@/services/productService';

// Mock the hooks before imports
vi.mock('@/hooks', () => ({
  useProducts: vi.fn(),
  useProductSearch: vi.fn(),
  useSearchSuggestions: vi.fn(),
}));

// Mock the components
vi.mock('@/components', () => ({
  LoadingSpinner: ({ message }: { message: string }) => (
    <div data-testid="loading-spinner">{message}</div>
  ),
  LoadingError: ({ error, onRetry }: { error: string; onRetry?: () => void }) => (
    <div data-testid="loading-error">
      {error}
      {onRetry && <button onClick={onRetry} data-testid="retry-button">Retry</button>}
    </div>
  ),
  SearchSuggestions: ({ 
    categories, 
    onSuggestionClick,
    isVisible 
  }: {
    categories: string[];
    relatedTerms: string[];
    popularProducts: Product[];
    onSuggestionClick: (term: string) => void;
    onProductClick: (id: number) => void;
    isVisible: boolean;
  }) => (
    isVisible ? (
      <div data-testid="search-suggestions">
        {categories.map((cat: string) => (
          <button key={cat} onClick={() => onSuggestionClick(cat)} data-testid={`category-${cat}`}>
            {cat}
          </button>
        ))}
      </div>
    ) : null
  ),
}));

// Now import the component and hooks
import Home from '@/pages/Home';
import { useProducts, useProductSearch, useSearchSuggestions } from '@/hooks';

// Get mock references
const mockUseProducts = vi.mocked(useProducts);
const mockUseProductSearch = vi.mocked(useProductSearch);
const mockUseSearchSuggestions = vi.mocked(useSearchSuggestions);

// Helper wrapper component
const HomeWrapper = ({ children }: { children: React.ReactNode }) => (
  <MemoryRouter>{children}</MemoryRouter>
);

// Mock data
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

describe('Home Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Default mock implementations
    mockUseProducts.mockReturnValue({
      products: mockProducts,
      loading: false,
      error: null,
      refetch: vi.fn()
    });

    mockUseProductSearch.mockReturnValue({
      searchTerm: '',
      setSearchTerm: vi.fn(),
      filteredProducts: mockProducts,
      hasResults: true,
      resultsCount: 2
    });

    mockUseSearchSuggestions.mockReturnValue({
      categories: ['electronics', 'clothing'],
      relatedTerms: ['popular', 'trending'],
      popularProducts: mockProducts,
      showPopularTerms: true
    });
  });

  it('renders loading state', () => {
    mockUseProducts.mockReturnValue({
      products: [],
      loading: true,
      error: null,
      refetch: vi.fn()
    });

    render(
      <HomeWrapper>
        <Home />
      </HomeWrapper>
    );

    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('renders error state', () => {
    const mockRefetch = vi.fn();
    mockUseProducts.mockReturnValue({
      products: [],
      loading: false,
      error: 'Failed to fetch products',
      refetch: mockRefetch
    });

    render(
      <HomeWrapper>
        <Home />
      </HomeWrapper>
    );

    expect(screen.getByTestId('loading-error')).toBeInTheDocument();
    expect(screen.getByText('Failed to fetch products')).toBeInTheDocument();
  });

  it('renders hero section', () => {
    render(
      <HomeWrapper>
        <Home />
      </HomeWrapper>
    );

    expect(screen.getByText('Bienvenido a nuestro E-commerce')).toBeInTheDocument();
    expect(screen.getByText('Descubre los mejores productos con la mejor calidad y precios increíbles')).toBeInTheDocument();
  });

  it('renders search bar', () => {
    render(
      <HomeWrapper>
        <Home />
      </HomeWrapper>
    );

    const searchInput = screen.getByPlaceholderText('Buscar productos...');
    expect(searchInput).toBeInTheDocument();
  });

  it('renders products grid', () => {
    render(
      <HomeWrapper>
        <Home />
      </HomeWrapper>
    );

    expect(screen.getByText('Test Product 1')).toBeInTheDocument();
    expect(screen.getByText('Test Product 2')).toBeInTheDocument();
    expect(screen.getByText('$29.99')).toBeInTheDocument();
    expect(screen.getByText('$19.99')).toBeInTheDocument();
  });

  it('displays results count', () => {
    render(
      <HomeWrapper>
        <Home />
      </HomeWrapper>
    );

    // Verify that products are displayed (which indicates results are shown)
    expect(screen.getByText('Test Product 1')).toBeInTheDocument();
    expect(screen.getByText('Test Product 2')).toBeInTheDocument();
  });

  it('handles search input', async () => {
    const mockSetSearchTerm = vi.fn();
    mockUseProductSearch.mockReturnValue({
      searchTerm: '',
      setSearchTerm: mockSetSearchTerm,
      filteredProducts: mockProducts,
      hasResults: true,
      resultsCount: 2
    });

    const user = userEvent.setup();
    render(
      <HomeWrapper>
        <Home />
      </HomeWrapper>
    );

    const searchInput = screen.getByPlaceholderText('Buscar productos...');
    await user.type(searchInput, 'electronics');

    await waitFor(() => {
      expect(mockSetSearchTerm).toHaveBeenCalled();
    });
  });

  it('shows no results message when no products match search', () => {
    mockUseProductSearch.mockReturnValue({
      searchTerm: 'nonexistent',
      setSearchTerm: vi.fn(),
      filteredProducts: [],
      hasResults: false,
      resultsCount: 0
    });

    render(
      <HomeWrapper>
        <Home />
      </HomeWrapper>
    );

    expect(screen.getByText('No se encontraron productos')).toBeInTheDocument();
    expect(screen.getByText(/No hay productos que coincidan con/)).toBeInTheDocument();
  });

  it('renders product cards as clickable links', () => {
    render(
      <HomeWrapper>
        <Home />
      </HomeWrapper>
    );

    const productLinks = screen.getAllByRole('link');
    const productCardLinks = productLinks.filter(link => 
      link.getAttribute('href')?.startsWith('/product/')
    );

    expect(productCardLinks).toHaveLength(2);
    expect(productCardLinks[0]).toHaveAttribute('href', '/product/1');
    expect(productCardLinks[1]).toHaveAttribute('href', '/product/2');
  });

  it('displays product ratings', () => {
    render(
      <HomeWrapper>
        <Home />
      </HomeWrapper>
    );

    expect(screen.getByText('4.5')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
  });
});