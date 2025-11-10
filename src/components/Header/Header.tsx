import { Link } from 'react-router-dom';
import styles from './Header.module.css';

export default function Header() {

  return (
    <header className={styles.header}>
      <div className={styles.headerContainer}>
        <div className={styles.headerContent}>
          {/* Logo */}
          <div className={styles.logoSection}>
            <Link to="/" className={styles.logoLink}>
              <div className={styles.logoIcon}>
                <span className={styles.logoText}>E</span>
              </div>
              <span className={styles.logoTitle}>E-commerce</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className={styles.navigation}>
          </nav>

          {/* Actions */}
          <div className={styles.actions}>
          </div>
        </div>
      </div>
    </header>
  );
}