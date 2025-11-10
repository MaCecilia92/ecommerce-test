import { type Product } from '@/services/productService';
import styles from './SearchSuggestions.module.css';

interface SearchSuggestionsProps {
  categories: string[];
  relatedTerms: string[];
  popularProducts: Product[];
  onSuggestionClick: (suggestion: string) => void;
  onProductClick: (productId: number) => void;
  isVisible: boolean;
}

export default function SearchSuggestions({
  categories,
  relatedTerms,
  popularProducts,
  onSuggestionClick,
  onProductClick,
  isVisible
}: SearchSuggestionsProps) {
  if (!isVisible) {
    return null;
  }

  return (
    <div className={styles.suggestionsContainer}>
      
      {/* Categorías */}
      {categories.length > 0 && (
        <div className={styles.suggestionsSection}>
          <h4 className={styles.sectionTitle}>
            📂 Categorías
          </h4>
          <div className={styles.categoryList}>
            {categories.map((category, index) => (
              <button
                key={index}
                onClick={() => onSuggestionClick(category)}
                className={styles.categoryItem}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Términos relacionados */}
      {relatedTerms.length > 0 && (
        <div className={styles.suggestionsSection}>
          <h4 className={styles.sectionTitle}>
            🔍 Búsquedas relacionadas
          </h4>
          <div className={styles.relatedTermsContainer}>
            {relatedTerms.map((term, index) => (
              <button
                key={index}
                onClick={() => onSuggestionClick(term)}
                className={styles.relatedTermPill}
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Productos populares */}
      {popularProducts.length > 0 && (
        <div className={styles.suggestionsSection}>
          <h4 className={styles.sectionTitle}>
            ⭐ Productos populares
          </h4>
          <div className={styles.popularProductsList}>
            {popularProducts.map((product) => (
              <button
                key={product.id}
                onClick={() => onProductClick(product.id)}
                className={styles.popularProductItem}
              >
                <img
                  src={product.image}
                  alt={product.title}
                  className={styles.popularProductImage}
                />
                <div className={styles.popularProductContent}>
                  <p className={styles.popularProductTitle}>
                    {product.title}
                  </p>
                  <div className={styles.popularProductDetails}>
                    <span className={styles.popularProductPrice}>
                      ${product.price.toFixed(2)}
                    </span>
                    <div className={styles.popularProductRating}>
                      <span className={styles.popularProductStar}>★</span>
                      <span className={styles.popularProductRatingValue}>
                        {product.rating.rate}
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Mensaje si no hay sugerencias */}
      {categories.length === 0 && relatedTerms.length === 0 && popularProducts.length === 0 && (
        <div className={styles.noSuggestions}>
          <p className={styles.noSuggestionsText}>No se encontraron sugerencias</p>
        </div>
      )}
    </div>
  );
}