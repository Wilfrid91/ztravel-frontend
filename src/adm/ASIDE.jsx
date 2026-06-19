import { ADM_DASHBOARD } from '../data/AdminMenu'
import { FaUserCircle } from 'react-icons/fa'
import { useGlobalContext } from '../context'
import { useState } from 'react'
import styles from '../css/avd.module.css'
import layout from '../css/adminLayout.module.css'

export default function ASIDE({ navigate, handleMenuClick }) {
  const { user, logoutUser } = useGlobalContext()

  const [showMenu, setShowMenu] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null)

  // Ne peux pas utiliser navigate() dans le contexte, donc tu dois le faire dans le composant
  const handleLogoutClick = async () => {
    await logoutUser()
    navigate('/login')
  }

  return (
    <aside className={styles.sidebar}>
      {/* MENUS */}
      {ADM_DASHBOARD.adminMenus.map((menu) => {
        const ParentIcon = menu.icon

        return (
          <div key={menu.id} style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <ParentIcon size={20} />
              <strong>{menu.label}</strong>
            </div>

            <ul style={{ marginTop: 10, paddingLeft: 25 }}>
              {menu.children?.map((child) => {
                const ChildIcon = child.icon

                return (
                  <li
                    key={child.id}
                    onClick={async () => {
                      if (child.route) {
                        await handleMenuClick(child)
                        navigate(child.route)
                      } else {
                        handleMenuClick(child)
                      }
                    }}
                    style={{
                      cursor: 'pointer',
                      marginBottom: 6,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      color: '#1A3C8E',
                    }}
                  >
                    <ChildIcon size={18} />
                    {child.label}
                  </li>
                )
              })}
            </ul>
          </div>
        )
      })}

      {/* USER MENU */}
      <div className={styles.sidebarUserWrapper}>
        <div
          className={styles.sidebarUser}
          onClick={() => setShowMenu((prev) => !prev)}
        >
          <span className={styles.sidebarUserIcon}>
            <FaUserCircle />
          </span>

          {user ? (
            <span className={styles.username}>{user.prenom}</span>
          ) : (
            <span>Utilisateur</span>
          )}
        </div>

        {showMenu && (
          <div className={styles.userDisconnectBtn}>
            <button onClick={handleLogoutClick}>🔓 Déconnexion</button>
          </div>
        )}

        {selectedImage && (
          <div className='image-overlay' onClick={() => setSelectedImage(null)}>
            <div className='image-overlay-content'>
              <img src={`API_BASE_URL${selectedImage}`} alt='Aperçu' />
            </div>
          </div>
        )}
      </div>
    </aside>
  )
}
