import React, { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useMenuData } from '../hooks/useMenuData'

export default function UserAccounts() {
  const { menuData } = useMenuData()
  const [selected, setSelected] = useState({})

  if (!menuData || !menuData.users) {
    return <p>Aucun utilisateur trouvé.</p>
  }

  const users = menuData.users
  const selectedIds = Object.keys(selected).filter((id) => selected[id])
  const singleSelected = selectedIds.length === 1 ? selectedIds[0] : null

  const disableUser = async () => {
    if (!singleSelected) return

    try {
      const res = await axios.delete(
        `http://localhost:5000/api/v1/auth/admin/disable/${singleSelected}`,
      )
      toast.success('Utilisateur désactivé')
    } catch (err) {
      const msg = err.response?.data?.msg || 'Erreur inconnue'
      toast.error('Erreur lors de la désactivation : ' + msg)
    }
  }

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <button disabled={!singleSelected} onClick={disableUser}>
          Désactiver
        </button>
        <button disabled={selectedIds.length === 0}>Exporter</button>
      </div>

      <table border='1' cellPadding='8' style={{ width: '100%' }}>
        <thead>
          <tr>
            <th>
              <input
                type='checkbox'
                checked={
                  users.length > 0 && selectedIds.length === users.length
                }
                onChange={(e) => {
                  const checked = e.target.checked
                  const newState = {}
                  users.forEach((u) => (newState[u._id] = checked))
                  setSelected(newState)
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
                <input
                  type='checkbox'
                  checked={selected[u._id] || false}
                  onChange={(e) =>
                    setSelected({ ...selected, [u._id]: e.target.checked })
                  }
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

      <pre style={{ marginTop: 20 }}>
        ID sélectionné : {singleSelected || 'aucun'}
      </pre>
    </div>
  )
}
