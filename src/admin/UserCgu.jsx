import { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'

export default function UserCgu() {
  const [search, setSearch] = useState('')
  const [user, setUser] = useState(null)

  const handleSearch = async () => {
    if (!search.trim()) {
      toast.error("Veuillez entrer l'adresse email")
      return
    }

    try {
      const res = await axios.get(
        `http://localhost:5000/api/v1/auth/admin/user/cgu?search=${search}`,
      )
      setUser(res.data)
    } catch (err) {
      const status = err.response?.status

      if (status === 401)
        return toast.error('Session expirée, veuillez vous authentifier')
      if (status === 404) return toast.error('Aucun utilisateur trouvé')
      if (status === 400) return toast.error('Recherche invalide')
      if (status === 500) return toast.error('Erreur interne du serveur')

      if (err.response?.data?.msg) return toast.error(err.response.data.msg)

      toast.error('Une erreur est survenue, veuillez réessayer')
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>User CGU</h2>

      <input
        type='text'
        placeholder='Email, nom ou prénom'
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ padding: 8, width: 300 }}
      />

      <button onClick={handleSearch} style={{ marginLeft: 10 }}>
        Rechercher
      </button>

      {user && (
        <div>
          <p>
            <strong>Email :</strong> {user.email}
          </p>
          <p>
            <strong>CGU acceptée :</strong> {user.cguAccepted ? 'Oui' : 'Non'}
          </p>
          <p>
            <strong>Date :</strong> {user.cguAcceptedAt || '—'}
          </p>
        </div>
      )}
    </div>
  )
}
