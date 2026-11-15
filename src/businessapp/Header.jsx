// Fichier généré automatiquement
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { HashLink } from 'react-router-hash-link'
import { Link } from 'react-router-dom'
import styles from '../styles/Header.module.css'

const Header = ({ onMenuToggle }) => {
  const navigate = useNavigate()

  return (
    <header className={styles.header}>
      <button
        className={styles.burger}
        onClick={onMenuToggle}
        aria-label='Ouvrir le menu'
      >
        ☰
      </button>

      <nav className={styles.navList}>
        {/* ✅ Zone gauche : logo */}
        <div className={styles.logoBlock} onClick={() => navigate('/')}>
          <div className={styles.logoSquare}>
            <span className={styles.logoLetter}>Z</span>
          </div>
          <div className={styles.logoText}>
            <div className={styles.appTitle}>zTravel Consulting ©</div>
            <div className={styles.appSubtitle}>
              Simuler avant d'acheter ! - SIMUDOUANE.COM
            </div>
          </div>
        </div>

        {/* ✅ Zone centre : liens de navigation */}
        <div className={styles.navLinks}>
          <HashLink smooth to='#services' className={styles.navLink}>
            Nos services
          </HashLink>
          <Link to='/contact' className={styles.navLink}>
            Nous contacter
          </Link>
          <Link to='/register' className={styles.navLink}>
            S'inscrire gratuitement
          </Link>
        </div>

        {/* ✅ Zone droite : CTA */}
        <div className={styles.navActions}>
          <HashLink smooth to='#simulateur' className={styles.featureBtn}>
            Démarrer une simulation
          </HashLink>
        </div>
      </nav>
    </header>
  )
}

export default Header
