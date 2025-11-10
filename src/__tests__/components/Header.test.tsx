import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Header from '@/components/Header';

const HeaderWrapper = ({ children }: { children: React.ReactNode }) => (
  <MemoryRouter>{children}</MemoryRouter>
);

describe('Header Component', () => {
  it('renders header with logo and title', () => {
    render(
      <HeaderWrapper>
        <Header />
      </HeaderWrapper>
    );

    // Check if logo text is present
    expect(screen.getByText('E')).toBeInTheDocument();
    
    // Check if title is present
    expect(screen.getByText('E-commerce')).toBeInTheDocument();
  });

  it('renders logo as a link to home', () => {
    render(
      <HeaderWrapper>
        <Header />
      </HeaderWrapper>
    );

    const logoLink = screen.getByRole('link');
    expect(logoLink).toHaveAttribute('href', '/');
  });

  it('has proper header structure', () => {
    render(
      <HeaderWrapper>
        <Header />
      </HeaderWrapper>
    );

    const header = screen.getByRole('banner');
    expect(header).toBeInTheDocument();
    expect(header.tagName).toBe('HEADER');
  });

  it('contains navigation and actions containers', () => {
    const { container } = render(
      <HeaderWrapper>
        <Header />
      </HeaderWrapper>
    );

    const navigation = container.querySelector('nav');
    expect(navigation).toBeInTheDocument();
  });
});