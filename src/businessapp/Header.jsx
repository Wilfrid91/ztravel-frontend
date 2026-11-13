// Fichier généré automatiquement
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { HashLink } from 'react-router-hash-link'
import { Link } from 'react-router-dom'
import styles from '../styles/Header.module.css'

const Header = ({ onMenuToggle }) => {
  const navigate = useNavigate()

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button
          className={styles.burger}
          onClick={onMenuToggle}
          aria-label='Ouvrir le menu'
        >
          ☰
        </button>
        <nav className={styles.navList}>
          <div className={styles.logoBlock} onClick={() => navigate('/')}>
            <div className={styles.logoSquare}>
              <span className={styles.logoLetter}>Z</span>
            </div>
            <div className={styles.logoText}>
              <div className={styles.appTitle}>zTravel Consulting ©</div>
              <div className={styles.appSubtitle}>
                Simuler avant d'acheter !
              </div>
              <div className={styles.appSubtitle}>SIMUDOUANE.COM</div>
            </div>
          </div>
          <HashLink smooth to='#services' className={styles.navListAccent}>
            Nos services
          </HashLink>
          <Link to='/contact' className={styles.navListAccent}>
            Nous contacter
          </Link>
          <Link to='/register' className={styles.navListAccent}>
            S'inscrire gratuitement
          </Link>
          <HashLink smooth to='#simulateur' className={styles.featureBtn}>
            Démarrer une simulation
          </HashLink>
        </nav>
      </header>
    </div>
  )
}

export default Header
