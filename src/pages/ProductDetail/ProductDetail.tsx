import { useParams, Link } from 'react-router-dom';
import { useProduct } from '@/hooks';
import { ErrorPage } from '@/pages';
import { LoadingError, LoadingSpinner } from '@/components';
import styles from './ProductDetail.module.css';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const { product, loading, error, notFound, refetch } = useProduct(id);

  // Mostrar loading
  if (loading) {
    return <LoadingSpinner message="Cargando producto..." />;
  }

  // Mostrar error de producto no encontrado
  if (notFound) {
    return (
      <ErrorPage
        title="Producto no encontrado"
        description="El producto que buscas no existe o ha sido eliminado de nuestro catálogo"
        showBackButton={true}
        onRetry={refetch}
      />
    );
  }

  // Mostrar error de conexión u otros errores
  if (error && !product) {
    return (
      <LoadingError
        error={error}
        onRetry={refetch}
        showBackButton={true}
      />
    );
  }

  // Si no hay producto después de cargar (caso edge)
  if (!product) {
    return (
      <ErrorPage
        title="Producto no disponible"
        description="No se pudo cargar la información del producto"
        showBackButton={true}
        onRetry={refetch}
      />
    );
  }

  return (
    <div className={styles.pageContainer}>
      <div className={styles.backButtonContainer}>
        <Link to="/" className={styles.backButton}>
          ← Volver al inicio
        </Link>
      </div>

      <div className={styles.productGrid}>
        {/* Imagen del producto */}
        <div className={styles.imageSection}>
          <img
            src={product.image}
            alt={product.title}
            className={styles.productImage}
          />
        </div>

        {/* Información del producto */}
        <div className={styles.infoSection}>
          <div>
            <h1 className={styles.productTitle}>
              {product.title}
            </h1>
            <p className={styles.productPrice}>
              ${product.price.toFixed(2)}
            </p>
            <div className={styles.metaInfo}>
              <span className={styles.category}>
                {product.category}
              </span>
              <span className={styles.separator}>•</span>
              <div className={styles.rating}>
                <span className={styles.star}>★</span>
                <span className={styles.ratingValue}>{product.rating.rate}</span>
                <span className={styles.reviewCount}>
                  ({product.rating.count} reseñas)
                </span>
              </div>
            </div>
          </div>

          <div>
            <h3 className={styles.descriptionTitle}>Descripción</h3>
            <p className={styles.description}>
              {product.description}
            </p>
          </div>

          <div className={styles.availabilitySection}>
            <div className={styles.availability}>
              <span className={styles.availableText}>✓ Disponible</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}