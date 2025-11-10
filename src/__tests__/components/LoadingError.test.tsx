import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import LoadingError from '@/components/LoadingError';

const LoadingErrorWrapper = ({ children }: { children: React.ReactNode }) => (
  <MemoryRouter>{children}</MemoryRouter>
);

describe('LoadingError Component', () => {
  it('renders error message and actions', () => {
    render(
      <LoadingErrorWrapper>
        <LoadingError error="Failed to fetch data" />
      </LoadingErrorWrapper>
    );

    expect(screen.getByText('Error de conexión')).toBeInTheDocument();
    expect(screen.getByText('Failed to fetch data')).toBeInTheDocument();
    expect(screen.getByText('🏠 Volver al inicio')).toBeInTheDocument();
  });

  it('shows retry button when onRetry is provided', () => {
    const mockRetry = vi.fn();
    
    render(
      <LoadingErrorWrapper>
        <LoadingError error="Network error" onRetry={mockRetry} />
      </LoadingErrorWrapper>
    );

    const retryButton = screen.getByText('🔄 Intentar de nuevo');
    expect(retryButton).toBeInTheDocument();
  });

  it('calls onRetry when retry button is clicked', async () => {
    const mockRetry = vi.fn();
    const user = userEvent.setup();
    
    render(
      <LoadingErrorWrapper>
        <LoadingError error="Network error" onRetry={mockRetry} />
      </LoadingErrorWrapper>
    );

    const retryButton = screen.getByText('🔄 Intentar de nuevo');
    await user.click(retryButton);
    
    expect(mockRetry).toHaveBeenCalledOnce();
  });

  it('shows back button by default', () => {
    render(
      <LoadingErrorWrapper>
        <LoadingError error="Error message" />
      </LoadingErrorWrapper>
    );

    expect(screen.getByText('← Volver al inicio')).toBeInTheDocument();
  });

  it('hides back button when showBackButton is false', () => {
    render(
      <LoadingErrorWrapper>
        <LoadingError error="Error message" showBackButton={false} />
      </LoadingErrorWrapper>
    );

    expect(screen.queryByText('← Volver al inicio')).not.toBeInTheDocument();
  });

  it('contains proper CSS classes', () => {
    const { container } = render(
      <LoadingErrorWrapper>
        <LoadingError error="Error message" />
      </LoadingErrorWrapper>
    );

    const errorDiv = container.querySelector('div');
    expect(errorDiv).toBeInTheDocument();
    
    const errorIcon = container.querySelector('[class*="errorIcon"]');
    expect(errorIcon).toBeInTheDocument();
    expect(errorIcon).toHaveTextContent('⚠️');
  });

  it('displays error icon', () => {
    render(
      <LoadingErrorWrapper>
        <LoadingError error="Error message" />
      </LoadingErrorWrapper>
    );

    expect(screen.getByText('⚠️')).toBeInTheDocument();
  });
});