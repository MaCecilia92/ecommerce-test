import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import LoadingSpinner from '@/components/LoadingSpinner';

describe('LoadingSpinner Component', () => {
  it('renders with default message and size', () => {
    render(<LoadingSpinner />);

    expect(screen.getByText('Cargando...')).toBeInTheDocument();
    expect(screen.getByText('Por favor espera un momento')).toBeInTheDocument();
  });

  it('renders with custom message', () => {
    render(<LoadingSpinner message="Cargando productos..." />);

    expect(screen.getByText('Cargando productos...')).toBeInTheDocument();
    expect(screen.getByText('Por favor espera un momento')).toBeInTheDocument();
  });

  it('renders with different sizes', () => {
    const { rerender } = render(<LoadingSpinner size="sm" />);
    expect(screen.getByText('⏳')).toBeInTheDocument();

    rerender(<LoadingSpinner size="md" />);
    expect(screen.getByText('⏳')).toBeInTheDocument();

    rerender(<LoadingSpinner size="lg" />);
    expect(screen.getByText('⏳')).toBeInTheDocument();
  });

  it('contains spinner animation', () => {
    const { container } = render(<LoadingSpinner />);

    const spinnerContainer = container.querySelector('[class*="spinnerContainer"]');
    expect(spinnerContainer).toBeInTheDocument();
    
    const spinner = container.querySelector('[class*="spinner"]');
    expect(spinner).toBeInTheDocument();
  });

  it('has correct container structure', () => {
    const { container } = render(<LoadingSpinner />);
    
    const loadingDiv = container.querySelector('div');
    expect(loadingDiv).toBeInTheDocument();
    
    const loadingTitle = container.querySelector('h3');
    expect(loadingTitle).toBeInTheDocument();
  });
});