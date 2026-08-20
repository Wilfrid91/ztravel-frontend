import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth' // ko() dans le build

export default function Sidebar({ handleMenuClick }) {
  const navigate = useNavigate()
  const { user, logoutUser } = useAuth()

  const [showLogout, setShowLogout] = useState(false)
  const [imagePreview, setImagePreview] = useState(null)

  const adminMenus = [
    {
      id: 'users',
      label: 'Utilisateurs',
      children: [
        {
          id: 'user-accounts',
          label: 'Comptes utilisateurs',
          endpoint: 'http://localhost:5000/api/v1/auth/admin/users',
          route: 'user-accounts',
        },
        {
          id: 'user-account',
          label: 'User account',
          route: 'user-account',
        },
        {
          id: 'user-cgu',
          label: 'CGU',
          route: 'user-cgu',
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
          endpoint: 'http://localhost:5000/api/v1/auth/admin/transactions',
          route: 'user-data',
        },
        {
          id: 'refund-all',
          label: 'Remboursement',
          endpoint: 'http://localhost:5000/api/v1/auth/admin/refund',
          route: 'refund-all',
        },
      ],
    },
    {
      id: 'refund',
      label: 'Rembourser',
      children: [
        { id: 'refund-mtn', label: 'MTN momo', route: 'refund-mtn' },
        { id: 'refund-fedapay', label: 'FedaPay', route: 'refund-fedapay' },
      ],
    },
  ]

  return (
    <aside
      style={{ padding: 20, width: 260, background: '#0b1727', color: 'white' }}
    >
      {adminMenus.map((menu) => (
        <div key={menu.id} style={{ marginBottom: 20 }}>
          <strong>{menu.label}</strong>

          <ul style={{ marginTop: 10, paddingLeft: 25 }}>
            {menu.children?.map((item) => (
              <li
                key={item.id}
                onClick={async () => {
                  if (item.endpoint) {
                    await handleMenuClick(item)
                  }
                  navigate(`/admin/${item.route}`)
                }}
                style={{
                  cursor: 'pointer',
                  marginBottom: 6,
                  color: '#1A3C8E',
                }}
              >
                {item.label}
              </li>
            ))}
          </ul>
        </div>
      ))}

      <div style={{ marginTop: 40 }}>
        <div
          onClick={() => setShowLogout((v) => !v)}
          style={{ cursor: 'pointer', marginBottom: 10 }}
        >
          {user ? user.prenom : 'Utilisateur'}
        </div>

        {showLogout && (
          <button
            onClick={async () => {
              await logoutUser()
              navigate('/login')
            }}
          >
            🔒 Déconnexion
          </button>
        )}

        {imagePreview && (
          <div className='image-overlay' onClick={() => setImagePreview(null)}>
            <div className='image-overlay-content'>
              <img src={imagePreview} alt='Aperçu' />
            </div>
          </div>
        )}
      </div>
    </aside>
  )
}
