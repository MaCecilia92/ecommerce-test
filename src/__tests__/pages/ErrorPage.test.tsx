import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import ErrorPage from '@/pages/ErrorPage';

const ErrorPageWrapper = ({ children }: { children: React.ReactNode }) => (
  <MemoryRouter>{children}</MemoryRouter>
);

describe('ErrorPage Component', () => {
  it('renders with default props', () => {
    render(
      <ErrorPageWrapper>
        <ErrorPage />
      </ErrorPageWrapper>
    );

    expect(screen.getByText('Producto no encontrado')).toBeInTheDocument();
    expect(screen.getByText('El producto que buscas no existe o ha sido eliminado')).toBeInTheDocument();
    expect(screen.getByText('🏠 Ir al inicio')).toBeInTheDocument();
  });

  it('renders with custom title and description', () => {
    render(
      <ErrorPageWrapper>
        <ErrorPage 
          title="Error personalizado"
          description="Descripción personalizada del error"
        />
      </ErrorPageWrapper>
    );

    expect(screen.getByText('Error personalizado')).toBeInTheDocument();
    expect(screen.getByText('Descripción personalizada del error')).toBeInTheDocument();
  });

  it('shows retry button when onRetry is provided', () => {
    const mockRetry = vi.fn();
    
    render(
      <ErrorPageWrapper>
        <ErrorPage onRetry={mockRetry} />
      </ErrorPageWrapper>
    );

    const retryButton = screen.getByText('🔄 Intentar de nuevo');
    expect(retryButton).toBeInTheDocument();
  });

  it('calls onRetry when retry button is clicked', async () => {
    const mockRetry = vi.fn();
    const user = userEvent.setup();
    
    render(
      <ErrorPageWrapper>
        <ErrorPage onRetry={mockRetry} />
      </ErrorPageWrapper>
    );

    const retryButton = screen.getByText('🔄 Intentar de nuevo');
    await user.click(retryButton);
    
    expect(mockRetry).toHaveBeenCalledOnce();
  });

  it('shows back button by default', () => {
    render(
      <ErrorPageWrapper>
        <ErrorPage />
      </ErrorPageWrapper>
    );

    expect(screen.getByText('← Volver al inicio')).toBeInTheDocument();
  });

  it('hides back button when showBackButton is false', () => {
    render(
      <ErrorPageWrapper>
        <ErrorPage showBackButton={false} />
      </ErrorPageWrapper>
    );

    expect(screen.queryByText('← Volver al inicio')).not.toBeInTheDocument();
  });

  it('renders help sections with correct content', () => {
    render(
      <ErrorPageWrapper>
        <ErrorPage />
      </ErrorPageWrapper>
    );

    expect(screen.getByText('Explora productos')).toBeInTheDocument();
    expect(screen.getByText('Busca productos')).toBeInTheDocument();
    expect(screen.getByText('Soporte')).toBeInTheDocument();
    
    expect(screen.getByText('Descubre nuestra amplia gama de productos disponibles')).toBeInTheDocument();
    expect(screen.getByText('Usa nuestra barra de búsqueda para encontrar lo que necesitas')).toBeInTheDocument();
    expect(screen.getByText('Contacta con nuestro equipo si necesitas ayuda')).toBeInTheDocument();
  });

  it('displays error icon', () => {
    render(
      <ErrorPageWrapper>
        <ErrorPage />
      </ErrorPageWrapper>
    );

    expect(screen.getByText('🚫')).toBeInTheDocument();
  });

  it('displays help section icons', () => {
    render(
      <ErrorPageWrapper>
        <ErrorPage />
      </ErrorPageWrapper>
    );

    expect(screen.getByText('🛍️')).toBeInTheDocument();
    expect(screen.getByText('🔍')).toBeInTheDocument();
    expect(screen.getByText('📞')).toBeInTheDocument();
  });

  it('has proper link structure', () => {
    render(
      <ErrorPageWrapper>
        <ErrorPage />
      </ErrorPageWrapper>
    );

    const homeLinks = screen.getAllByRole('link');
    expect(homeLinks.length).toBeGreaterThanOrEqual(1);
    
    // Check that at least one link points to home
    const hasHomeLink = homeLinks.some(link => link.getAttribute('href') === '/');
    expect(hasHomeLink).toBe(true);
  });
});