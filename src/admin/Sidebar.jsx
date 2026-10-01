import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth' // ko() dans le build
import styles from '../styles/Sidebar.module.css'

const Sidebar = ({ activeNav, setActiveNav, sidebarOpen, onClose }) => {
  const { user, logoutUser } = useAuth()

  const [showUserMenu, setShowUserMenu] = useState(false)
  const [expandedMenus, setExpandedMenus] = useState({})

  const toggleMenu = (id) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const handleMenuClick = (menu) => {
    if (menu.children?.length) {
      toggleMenu(menu.id)
      return
    }

    setActiveNav(menu.id)
    onClose?.()
  }

  const handleChildClick = (child) => {
    setActiveNav(child.id)
    onClose?.()
  }

  const adminMenus = [
    {
      id: 'users',
      label: 'Utilisateurs',
      children: [
        {
          id: 'user-accounts',
          label: 'Comptes utilisateurs',
        },
        {
          id: 'user-account',
          label: 'Rechercher un utilisateur',
        },
        {
          id: 'user-cgu',
          label: 'CGU',
        },
      ],
    },
    {
      id: 'transactions',
      label: 'Transactions',
      children: [
        {
          id: 'payments',
          label: 'Paiement',
        },
        {
          id: 'refund-all',
          label: 'Remboursement',
        },
      ],
    },
    {
      id: 'refund',
      label: 'Rembourser',
      children: [
        {
          id: 'refund-mtn',
          label: 'MTN momo',
        },
        {
          id: 'refund-fedapay',
          label: 'FedaPay',
        },
      ],
    },
    {
      id: 'visitors',
      label: 'Visiteurs',
      children: [
        {
          id: 'visit-tracker',
          label: 'Anylitique utilisateurs',
        },
      ],
    },
  ]

  return (
    <aside
      className={`${styles.sidebarContainer} ${
        sidebarOpen ? styles.sidebarOpen : ''
      }`}
    >
      <nav className={styles.menu}>
        {adminMenus.map((menu) => {
          const hasChildren = menu.children?.length > 0
          const isExpanded = expandedMenus[menu.id]
          const isActive = activeNav === menu.id

          return (
            <div key={menu.id} className={styles.menuItem}>
              <div
                className={`${styles.menuLink} ${
                  isActive ? styles.active : ''
                }`}
                onClick={() => handleMenuClick(menu)}
              >
                <span className={styles.label}>{menu.label}</span>

                {hasChildren && (
                  <span className={styles.arrow}>{isExpanded ? '▼' : '▶'}</span>
                )}
              </div>

              {hasChildren && isExpanded && (
                <div className={styles.children}>
                  {menu.children.map((child) => (
                    <div
                      key={child.id}
                      className={`${styles.childLink} ${
                        activeNav === child.id ? styles.activeChild : ''
                      }`}
                      onClick={() => handleChildClick(child)}
                    >
                      {child.label}
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
          onClick={() => setShowUserMenu((prev) => !prev)}
        >
          <span className={styles.userIcon}>👤</span>

          <span className={styles.userName}>
            {user?.prenom || 'Utilisateur'}
          </span>
        </div>

        {showUserMenu && (
          <div className={styles.userMenu}>
            <button onClick={logoutUser}>🔓 Déconnexion</button>
          </div>
        )}
      </div>
    </aside>
  )
}

export default Sidebar
