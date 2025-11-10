import { Link, useNavigate } from 'react-router-dom';
import { useProducts, useProductSearch, useSearchSuggestions } from '@/hooks';
import { LoadingSpinner, LoadingError, SearchSuggestions } from '@/components';
import { useState, useRef, useEffect } from 'react';
import styles from './Home.module.css';

export default function Home() {
  const navigate = useNavigate();
  const { products, loading, error, refetch } = useProducts();
  const { searchTerm, setSearchTerm, filteredProducts, hasResults, resultsCount } = useProductSearch(products);
  const suggestions = useSearchSuggestions(products, searchTerm);
  
  // Estados para manejar las sugerencias
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Cerrar sugerencias al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
        setInputFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Manejar clic en sugerencia
  const handleSuggestionClick = (suggestion: string) => {
    setSearchTerm(suggestion);
    setShowSuggestions(false);
    setInputFocused(false);
  };

  // Manejar clic en producto sugerido
  const handleProductClick = (productId: number) => {
    navigate(`/product/${productId}`);
  };

  // Manejar cambios en el input de búsqueda
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setShowSuggestions(value.length >= 2);
  };

  // Manejar focus en el input
  const handleInputFocus = () => {
    setInputFocused(true);
    if (searchTerm.length >= 2) {
      setShowSuggestions(true);
    }
  };

  // Mostrar loading
  if (loading) {
    return <LoadingSpinner message="Cargando productos..." />;
  }

  // Mostrar error
  if (error) {
    return (
      <LoadingError
        error={error}
        onRetry={refetch}
        showBackButton={false}
      />
    );
  }

  return (
    <div className={styles.homeContainer}>
      {/* Hero Section */}
      <div className={styles.heroSection}>
        <h1 className={styles.heroTitle}>
          Bienvenido a nuestro E-commerce
        </h1>
        <p className={styles.heroDescription}>
          Descubre los mejores productos con la mejor calidad y precios increíbles
        </p>
      </div>

      {/* Search Bar */}
      <div className={styles.searchWrapper}>
        <div className={styles.searchContainer} ref={searchRef}>
          <input
            type="text"
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={handleSearchChange}
            onFocus={handleInputFocus}
            className={styles.searchInput}
          />
          <div className={styles.searchIconWrapper}>
            <svg
              className={styles.searchIcon}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          
          {/* Componente de sugerencias */}
          <SearchSuggestions
            categories={suggestions.categories}
            relatedTerms={suggestions.relatedTerms}
            popularProducts={suggestions.popularProducts}
            onSuggestionClick={handleSuggestionClick}
            onProductClick={handleProductClick}
            isVisible={showSuggestions && inputFocused}
          />
        </div>
        
        {searchTerm && !showSuggestions && (
          <p className={styles.searchResultsCount}>
            {resultsCount} producto{resultsCount !== 1 ? 's' : ''} encontrado{resultsCount !== 1 ? 's' : ''}
          </p>
        )}
      </div>

      {/* Sección de productos */}
      <div className={styles.productsSection}>
        {hasResults ? (
          <div className={styles.productsGrid}>
            {filteredProducts.map((product) => (
              <Link 
                key={product.id} 
                to={`/product/${product.id}`}
                className={styles.productCardLink}
              >
                <div className={styles.productCard}>
                  {/* Imagen real del producto */}
                  <div className={styles.productImageContainer}>
                    <img
                      src={product.image}
                      alt={product.title}
                      className={styles.productImage}
                    />
                  </div>
                  
                  <h3 className={styles.productTitle}>
                    {product.title}
                  </h3>
                  <p className={styles.productCategory}>
                    {product.category}
                  </p>
                  <p className={styles.productDescription}>
                    {product.description}
                  </p>
                  <div className={styles.productFooter}>
                    <span className={styles.productPrice}>
                      ${product.price.toFixed(2)}
                    </span>
                    <div className={styles.productRating}>
                      <span className={styles.productRatingStar}>★</span>
                      <span className={styles.productRatingValue}>{product.rating.rate}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className={styles.noResultsContainer}>
            <div className={styles.noResultsIcon}>🔍</div>
            <h3 className={styles.noResultsTitle}>No se encontraron productos</h3>
            <p className={styles.noResultsDescription}>
              {searchTerm 
                ? `No hay productos que coincidan con "${searchTerm}"`
                : "No hay productos disponibles"
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
}