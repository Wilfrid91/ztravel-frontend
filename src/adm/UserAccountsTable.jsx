import React, { useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import styles from '../css/adminLayout.module.css'
import axios from 'axios'
import { toast } from 'react-toastify'

export default function UserAccountsTable({}) {
  const { menuData } = useOutletContext()
  const [selectedRows, setSelectedRows] = useState({})
  const [selectedUserId, setSelectedUserId] = useState(null) // un seul user sélectionné

  if (!menuData || !menuData.users) {
    return <p>Aucun utilisateur trouvé.</p>
  }
  const users = menuData.users
  // IDs cochés
  const selectedIds = Object.keys(selectedRows).filter((id) => selectedRows[id])

  // Un seul ID si une seule ligne cochée
  const selectedId = selectedIds.length === 1 ? selectedIds[0] : null

  /**
   * Desactiver le user
   */
  const disableUser = async () => {
    if (!selectedId) return

    try {
      const response = await axios.delete(
        `/api/v1/auth/admin/disable/${selectedId}`,
      )
      console.log('User désactivé :', response.data)
      toast.success('utilisateur désactivé')
    } catch (error) {
      console.error('Erreur lors de la désactivation :', error)
      toast.error(
        `Erreur lors de la désactivation : ${error.response?.data?.msg || ''}`,
      )
    }
  }

  return (
    <div>
      {/* Barre d’actions alignée à droite */}
      <div className={styles.LeftActionBar}>
        <button disabled={!selectedId} onClick={disableUser}>
          Désactiver
        </button>

        <button disabled={selectedIds.length === 0}>Exporter</button>
      </div>

      {/* Tableau */}
      <table className={styles.table}>
        <thead>
          <tr>
            <th>
              {/* Checkbox "tout sélectionner" */}
              <input
                type='checkbox'
                checked={
                  users.length > 0 && selectedIds.length === users.length
                }
                onChange={(e) => {
                  const checked = e.target.checked
                  const newState = {}
                  users.forEach((u) => {
                    newState[u._id] = checked
                  })
                  setSelectedRows(newState)
                }}
              />
            </th>
            <th>Nom</th>
            <th>Prénom</th>
            <th>Status</th>
            <th>Email</th>
            <th>Role</th>
            <th>Last Login</th>
          </tr>
        </thead>

        <tbody>
          {users.map((u) => (
            <tr key={u._id}>
              <td>
                {/* Checkbox par ligne */}
                <input
                  type='checkbox'
                  checked={selectedRows[u._id] || false}
                  onChange={(e) => {
                    setSelectedRows({
                      ...selectedRows,
                      [u._id]: e.target.checked,
                    })
                  }}
                />
              </td>

              <td>{u.nom}</td>
              <td>{u.prenom}</td>
              <td>{u.status}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>
                {u.lastLogin
                  ? new Date(u.lastLogin).toLocaleString()
                  : 'Jamais connecté'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Debug (à supprimer) */}
      <pre style={{ marginTop: 20 }}>
        ID sélectionné : {selectedId || 'aucun'}
      </pre>
    </div>
  )
}
