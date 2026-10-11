import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import styles from '../../styles/SidebarAvd.module.css'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { FaUserCircle, FaPlay, FaList, FaCar } from 'react-icons/fa'

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
    short: 'Liste de produits',
    icon: FaList,
  },
  {
    id: 'TAB3',
    title: 'Générer la liste des véhicules',
    short: 'Liste de véhicules',
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
  const [expandedMenus, setExpandedMenus] = useState({})

  /**
   * Ouvre ou ferme un menu en fonction de son état actuel.
   * @param {string} id - Identifiant du menu à ouvrir ou à fermer. Exemple : toggleMenu('users')
   *
   */
  const toggleMenu = (id) => {
    setExpandedMenus((prev) => ({
      ...prev, // prev: etat précédent, conserve les états de tous les autres menus. Sans cette partie, tu risquerais de perdre leurs valeurs
      [id]: !prev[id], // Inverse l'état du menu ciblé :
    }))
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
          const hasChildren = item.children && item.children.length > 0
          const isExpanded = expandedMenus[item.id]

          return (
            <div key={item.id} className={styles.menuItem}>
              <div
                className={`${styles.menuLink} ${isActive ? styles.active : ''}`}
                onClick={() => {
                  setActiveNav(item.id)
                  if (hasChildren) toggleMenu(item.id)
                  onClose?.()
                }}
              >
                <span className={styles.iconWrapper}>
                  <item.icon className={styles.icon} />
                </span>
                <span className={styles.label}>{item.short || item.title}</span>
                {hasChildren && (
                  <span className={styles.arrow}>
                    {isExpanded ? (
                      <ChevronDown size={16} strokeWidth={2} />
                    ) : (
                      <ChevronRight size={16} strokeWidth={2} />
                    )}
                  </span>
                )}
              </div>
              {hasChildren && isExpanded && (
                <div className={styles.children}>
                  {item.children.map((child) => (
                    <div
                      key={child.id}
                      className={`${styles.childLink} ${activeNav === child.id ? styles.activeChild : ''}`}
                      onClick={() => {
                        setActiveNav(child.id)
                        onClose?.()
                      }}
                    >
                      <child.icon className={styles.childIcon} />
                      <span>{child.title}</span>
                    </div>
                  ))}
                </div>
              )}
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
