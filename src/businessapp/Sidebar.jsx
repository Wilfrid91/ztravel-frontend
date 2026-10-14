// Sidebar.jsx — un seul composant pour client et admin
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import styles from '../styles/Sidebar.module.css'
import { ChevronDown, ChevronRight } from 'lucide-react'

const Sidebar = ({
  items, // ← les menus (client ou admin) passés par le parent
  activeNav,
  setActiveNav,
  sidebarOpen,
  onClose,
  className = '',
  redirectAfterLogout = '/login', // les admins pourraient viser une autre page
}) => {
  const navigate = useNavigate()
  const { user, logoutUser } = useAuth()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [expandedMenus, setExpandedMenus] = useState({})

  const toggleMenu = (id) =>
    setExpandedMenus((prev) => ({ ...prev, [id]: !prev[id] }))

  const handleMenuClick = (menu) => {
    setActiveNav(menu.id)
    if (menu.children?.length) toggleMenu(menu.id)
    onClose?.()
  }

  const handleChildClick = (child) => {
    setActiveNav(child.id)
    onClose?.()
  }

  const handleLogout = async () => {
    await logoutUser()
    navigate(redirectAfterLogout)
  }

  return (
    <aside
      className={`${styles.sidebarContainer} ${
        sidebarOpen ? styles.sidebarOpen : ''
      } ${className}`}
    >
      <nav className={styles.menu}>
        {items.map((item) => {
          const isActive = activeNav === item.id
          const hasChildren = item.children?.length > 0
          const isExpanded = expandedMenus[item.id]

          return (
            <div key={item.id} className={styles.menuItem}>
              <div
                className={`${styles.menuLink} ${isActive ? styles.active : ''}`}
                onClick={() => handleMenuClick(item)}
              >
                {item.icon && (
                  <span className={styles.iconWrapper}>
                    <item.icon className={styles.icon} />
                  </span>
                )}
                <span className={styles.label}>
                  {item.short || item.label || item.title}
                </span>
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
                      className={`${styles.childLink} ${
                        activeNav === child.id ? styles.activeChild : ''
                      }`}
                      onClick={() => handleChildClick(child)}
                    >
                      {child.icon && (
                        <child.icon className={styles.childIcon} />
                      )}
                      <span>{child.short || child.label || child.title}</span>
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
            <button onClick={handleLogout}>🔓 Déconnexion</button>
          </div>
        )}
      </div>
    </aside>
  )
}

export default Sidebar
