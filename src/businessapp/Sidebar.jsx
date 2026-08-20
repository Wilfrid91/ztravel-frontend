// Fichier généré automatiquement
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import styles from '../styles/Sidebar.module.css'

import {
  FaUserCircle,
  FaSearchLocation,
  FaPlaneDeparture,
  FaStamp,
  FaStore,
  FaHandsHelping,
  FaCalculator,
  FaWallet,
  FaMoneyCheckAlt,
  FaCoins,
  FaDownload,
} from 'react-icons/fa'

const IconWrapper = ({ children, className }) => (
  <span className={className || styles.iconWrapper}>{children}</span>
)

const menuItems = [
  {
    id: 'TAB1',
    title: 'Voyager seul en Chine',
    short: 'Voyager seul',
    icon: FaSearchLocation,
  },
  {
    id: 'TAB2',
    title: 'Départ pour la Chine',
    short: 'Jour du départ',
    icon: FaPlaneDeparture,
  },
  {
    id: 'TAB3',
    title: 'Dédouanement au Bénin',
    short: 'Douane & AVD',
    icon: FaStamp,
  },
  {
    id: 'TAB4',
    title: 'Produits Chine 2026',
    short: 'Fournisseurs',
    icon: FaStore,
  },
  {
    id: 'TAB5',
    title: 'Demander un accompagnement',
    short: 'Me contacter',
    icon: FaHandsHelping,
  },
  {
    id: 'TAB6',
    title: 'Estimer vos frais',
    short: 'Simulateur',
    icon: FaCalculator,
  },
  {
    id: 'TAB7',
    title: 'Espace Paiements & Jetons',
    short: 'Mon espace',
    icon: FaWallet,
    children: [
      {
        id: 'TAB7-TRANSACTIONS',
        title: 'Transactions',
        icon: FaMoneyCheckAlt,
      },
      {
        id: 'TAB7-JETONS',
        title: 'Jetons',
        icon: FaCoins,
      },
      {
        id: 'TAB7-METHODES',
        title: 'Télécharger mes reçus',
        icon: FaDownload,
      },
    ],
  },
]

const Sidebar = ({
  activeNav,
  setActiveNav,
  sidebarOpen,
  onClose,
  className, // ← Prop récupérée
}) => {
  const navigate = useNavigate()
  const { user, logoutUser } = useAuth()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [expandedMenus, setExpandedMenus] = useState({})

  const toggleMenu = (id) => {
    setExpandedMenus((prev) => ({ ...prev, [id]: !prev[id] }))
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
                  <span className={styles.arrow}>{isExpanded ? '▼' : '▶'}</span>
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

export default Sidebar
