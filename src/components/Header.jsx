// Fichier généré automatiquement
import React from 'react'
import { useNavigate } from 'react-router-dom'
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
      <div className={styles.logoBlock} onClick={() => navigate('/')}>
        <div className={styles.logoSquare}>
          <span className={styles.logoLetter}>Z</span>
        </div>
        <div className={styles.logoText}>
          <div className={styles.appTitle}>zTravel Consulting ©</div>
          <div className={styles.appSubtitle}>
            Achetez malin, rentrez serein!
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
