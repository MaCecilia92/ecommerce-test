import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import styles from './ErrorPage.module.css';

interface ErrorPageProps {
  title?: string;
  description?: string;
  showBackButton?: boolean;
  onRetry?: () => void;
}

export default function ErrorPage({ 
  title = "Producto no encontrado",
  description = "El producto que buscas no existe o ha sido eliminado",
  showBackButton = true,
  onRetry
}: ErrorPageProps) {
  return (
    <div className={styles.pageContainer}>
      {showBackButton && (
        <div className={styles.backButtonContainer}>
          <Link to="/" className={styles.backButton}>
            ← Volver al inicio
          </Link>
        </div>
      )}
      
      <div className={styles.errorContent}>
        <div className={styles.errorMessage}>
          <div className={styles.errorIcon}>🚫</div>
          <h1 className={styles.errorTitle}>
            {title}
          </h1>
          <p className={styles.errorDescription}>
            {description}
          </p>
        </div>

        <div className={styles.actionButtons}>
          <Link to="/">
            <Button size="lg" className={styles.homeButton}>
              🏠 Ir al inicio
            </Button>
          </Link>
          
          {onRetry && (
            <Button 
              variant="outline" 
              size="lg" 
              onClick={onRetry}
              className={styles.retryButton}
            >
              🔄 Intentar de nuevo
            </Button>
          )}
        </div>

        <div className={styles.helpGrid}>
          <div className={styles.helpCard}>
            <div className={styles.helpIcon}>🛍️</div>
            <h3 className={styles.helpTitle}>Explora productos</h3>
            <p className={styles.helpDescription}>
              Descubre nuestra amplia gama de productos disponibles
            </p>
          </div>
          
          <div className={styles.helpCard}>
            <div className={styles.helpIcon}>🔍</div>
            <h3 className={styles.helpTitle}>Busca productos</h3>
            <p className={styles.helpDescription}>
              Usa nuestra barra de búsqueda para encontrar lo que necesitas
            </p>
          </div>
          
          <div className={styles.helpCard}>
            <div className={styles.helpIcon}>📞</div>
            <h3 className={styles.helpTitle}>Soporte</h3>
            <p className={styles.helpDescription}>
              Contacta con nuestro equipo si necesitas ayuda
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}