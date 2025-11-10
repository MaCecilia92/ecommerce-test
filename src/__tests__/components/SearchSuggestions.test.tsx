import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchSuggestions from '@/components/SearchSuggestions';
import type { Product } from '@/services/productService';

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

describe('SearchSuggestions Component', () => {
  const defaultProps = {
    categories: ['electronics', 'clothing'],
    relatedTerms: ['popular', 'trending', 'new'],
    popularProducts: mockProducts,
    onSuggestionClick: vi.fn(),
    onProductClick: vi.fn(),
    isVisible: true
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders categories section', () => {
    render(<SearchSuggestions {...defaultProps} />);

    expect(screen.getByText('📂 Categorías')).toBeInTheDocument();
    expect(screen.getByText('electronics')).toBeInTheDocument();
    expect(screen.getByText('clothing')).toBeInTheDocument();
  });

  it('renders related terms section', () => {
    render(<SearchSuggestions {...defaultProps} />);

    expect(screen.getByText('🔍 Búsquedas relacionadas')).toBeInTheDocument();
    expect(screen.getByText('popular')).toBeInTheDocument();
    expect(screen.getByText('trending')).toBeInTheDocument();
    expect(screen.getByText('new')).toBeInTheDocument();
  });

  it('renders popular products section', () => {
    render(<SearchSuggestions {...defaultProps} />);

    expect(screen.getByText('⭐ Productos populares')).toBeInTheDocument();
    expect(screen.getByText('Test Product 1')).toBeInTheDocument();
    expect(screen.getByText('Test Product 2')).toBeInTheDocument();
    expect(screen.getByText('$29.99')).toBeInTheDocument();
    expect(screen.getByText('$19.99')).toBeInTheDocument();
  });

  it('calls onSuggestionClick when category is clicked', async () => {
    const user = userEvent.setup();
    render(<SearchSuggestions {...defaultProps} />);

    const categoryButton = screen.getByText('electronics');
    await user.click(categoryButton);

    expect(defaultProps.onSuggestionClick).toHaveBeenCalledWith('electronics');
  });

  it('calls onSuggestionClick when related term is clicked', async () => {
    const user = userEvent.setup();
    render(<SearchSuggestions {...defaultProps} />);

    const termButton = screen.getByText('popular');
    await user.click(termButton);

    expect(defaultProps.onSuggestionClick).toHaveBeenCalledWith('popular');
  });

  it('calls onProductClick when product is clicked', async () => {
    const user = userEvent.setup();
    render(<SearchSuggestions {...defaultProps} />);

    const productButton = screen.getByText('Test Product 1');
    await user.click(productButton.closest('button')!);

    expect(defaultProps.onProductClick).toHaveBeenCalledWith(1);
  });

  it('displays product ratings correctly', () => {
    render(<SearchSuggestions {...defaultProps} />);

    expect(screen.getByText('4.5')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
  });

  it('shows no suggestions message when all arrays are empty', () => {
    const emptyProps = {
      categories: [],
      relatedTerms: [],
      popularProducts: [],
      onSuggestionClick: vi.fn(),
      onProductClick: vi.fn(),
      isVisible: true
    };

    render(<SearchSuggestions {...emptyProps} />);

    expect(screen.getByText('No se encontraron sugerencias')).toBeInTheDocument();
  });

  it('renders product images with correct alt text', () => {
    render(<SearchSuggestions {...defaultProps} />);

    const image1 = screen.getByAltText('Test Product 1');
    const image2 = screen.getByAltText('Test Product 2');

    expect(image1).toBeInTheDocument();
    expect(image2).toBeInTheDocument();
    expect(image1).toHaveAttribute('src', 'test-image-1.jpg');
    expect(image2).toHaveAttribute('src', 'test-image-2.jpg');
  });
});