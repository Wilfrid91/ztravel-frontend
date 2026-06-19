// Header.jsx
import styles from '../../css/Header.module.css'

export default function Header({ onMenuToggle }) {
  return (
    <header className={styles.appHeader}>
      {/* Bouton hamburger (visible uniquement sur mobile) */}
      <button
        className={styles.burgerButton}
        onClick={onMenuToggle}
        aria-label='Ouvrir le menu'
      >
        ☰
      </button>

      <div className={styles.logoBlock}>
        <div className={styles.logoSquare}>
          <span className={styles.logoLetter}>Z</span>
        </div>
        <div className={styles.logoText}>
          <div className={styles.appTitle}>ZTravel Import ©</div>
          <div className={styles.appSubtitle}>
            Achetez malin, rentrez serein!
          </div>
        </div>
      </div>
    </header>
  )
}
