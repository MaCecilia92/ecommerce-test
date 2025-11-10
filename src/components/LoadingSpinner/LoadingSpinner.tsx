import styles from './LoadingSpinner.module.css';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function LoadingSpinner({ 
  message = "Cargando...",
  size = 'md'
}: LoadingSpinnerProps) {
  return (
    <div className={styles.pageContainer}>
      <div className={styles.loadingContent}>
        <div className={`${styles.loadingIcon} ${styles[`icon${size.charAt(0).toUpperCase() + size.slice(1)}`]}`}>⏳</div>
        <h3 className={`${styles.loadingTitle} ${styles[`title${size.charAt(0).toUpperCase() + size.slice(1)}`]}`}>
          {message}
        </h3>
        <p className={styles.loadingSubtitle}>Por favor espera un momento</p>
        
        {/* Spinner animado */}
        <div className={styles.spinnerContainer}>
          <div className={styles.spinner}></div>
        </div>
      </div>
    </div>
  );
}