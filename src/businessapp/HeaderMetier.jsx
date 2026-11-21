import { useNavigate } from 'react-router-dom'
import styles from '../styles/Header.module.css'
import { useAuth } from '../context/AuthContext'

const Header = ({ onMenuToggle }) => {
  const navigate = useNavigate()
  const { user, logoutUser } = useAuth()

  const handleLogout = async () => {
    await logoutUser()
    navigate('/')
  }

  return (
    <header className={styles.header}>
      <button
        className={styles.burger}
        onClick={onMenuToggle}
        aria-label='Ouvrir le menu'
      >
        ☰
      </button>
      <div className={styles.logoBlock} onClick={() => handleLogout()}>
        <div className={styles.logoSquare}>
          <span className={styles.logoLetter}>Z</span>
        </div>
        <div className={styles.logoText}>
          <div className={styles.appTitle}>zTravel Consulting ©</div>
          <div className={styles.appSubtitle}>Simuler avant d'acheter !</div>
        </div>
      </div>
    </header>
  )
}

export default Header
