import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import styles from '../../styles/SidebarAvd.module.css'
import {
  FaUserCircle,
  FaUser,
  FaPlay,
  FaList,
  FaCar,
  FaSignOutAlt,
} from 'react-icons/fa'
import { MdDashboard, MdShoppingCart, MdPayment } from 'react-icons/md'
import { IoDocumentTextOutline, IoLogOutOutline } from 'react-icons/io5'

// ✅ 3 onglets du simulateur avec react-icons
const menuItems = [
  {
    id: 'TAB1',
    title: 'Avant de démarrer',
    short: 'Avant de démarrer',
    icon: FaPlay,
  },
  {
    id: 'TAB2',
    title: 'Générer la liste de produits',
    short: 'Liste produits',
    icon: FaList,
  },
  {
    id: 'TAB3',
    title: 'Générer la liste des véhicules',
    short: 'Liste véhicules',
    icon: FaCar,
  },
]

const SidebarNav = ({
  activeNav,
  setActiveNav,
  sidebarOpen,
  onClose,
  className,
}) => {
  const navigate = useNavigate()
  const { user, logoutUser } = useAuth()
  const [showUserMenu, setShowUserMenu] = useState(false)

  const handleMenuClick = (item) => {
    setActiveNav(item.id)
    if (onClose) onClose()
  }

  const handleLogout = async () => {
    await logoutUser()
    navigate('/login')
  }

  return (
    <aside
      className={`
      ${styles.sidebarContainer}
      ${className || ''}
      ${sidebarOpen ? styles.sidebarOpen : ''}
    `}
    >
      <nav className={styles.menu}>
        {menuItems.map((item) => {
          const isActive = activeNav === item.id
          const Icon = item.icon

          return (
            <div key={item.id} className={styles.menuItem}>
              <div
                className={`${styles.menuLink} ${isActive ? styles.active : ''}`}
                onClick={() => handleMenuClick(item)}
              >
                <span className={styles.iconWrapper}>
                  <Icon className={styles.icon} />
                </span>
                <span className={styles.label}>{item.short || item.title}</span>
              </div>
            </div>
          )
        })}
      </nav>

      <div className={styles.userSection}>
        <div
          className={styles.userInfo}
          onClick={() => setShowUserMenu(!showUserMenu)}
        >
          <span className={styles.userIcon}>
            <FaUserCircle size={26} />
          </span>
          <span className={styles.userName}>
            {user?.prenom || 'Utilisateur'}
          </span>
        </div>

        {showUserMenu && (
          <div className={styles.userMenu}>
            <button onClick={handleLogout}>🔓 Déconnexion</button>
          </div>
        )}
      </div>
    </aside>
  )
}

export default SidebarNav
