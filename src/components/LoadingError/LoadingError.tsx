import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import styles from './LoadingError.module.css';

interface LoadingErrorProps {
  error: string;
  onRetry?: () => void;
  showBackButton?: boolean;
}

export default function LoadingError({ 
  error, 
  onRetry,
  showBackButton = true 
}: LoadingErrorProps) {
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
        <div className={styles.errorIcon}>⚠️</div>
        <h3 className={styles.errorTitle}>Error de conexión</h3>
        <p className={styles.errorMessage}>
          {error}
        </p>
        
        <div className={styles.actionButtons}>
          {onRetry && (
            <Button onClick={onRetry} size="lg" className={styles.retryButton}>
              🔄 Intentar de nuevo
            </Button>
          )}
          
          <Link to="/">
            <Button variant="outline" size="lg" className={styles.homeButton}>
              🏠 Volver al inicio
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}