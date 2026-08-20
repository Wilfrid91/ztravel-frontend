import { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'

export default function UserAccount() {
  const [search, setSearch] = useState('')
  const [user, setUser] = useState(null)

  const handleSearch = async () => {
    if (!search.trim()) {
      toast.error('Veuillez entrer un texte de recherche')
      return
    }

    try {
      const res = await axios.get(
        `http://localhost:5000/api/v1/auth/admin/user?search=${search}`,
      )
      setUser(res.data.user)
    } catch (err) {
      const status = err.response?.status
      const msg = err.response?.data?.msg

      if (status === 401)
        return toast.error('Session expirée, veuillez vous authentifier')
      if (status === 404) return toast.error('Aucun utilisateur trouvé')
      if (status === 400) return toast.error('Recherche invalide')
      if (status === 500) return toast.error('Erreur interne du serveur')
      if (msg) return toast.error(msg)

      toast.error('Une erreur est survenue, veuillez réessayer')
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>User account</h2>

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
        <div style={{ marginTop: 20 }}>
          <h3>Résultat :</h3>

          <p>
            <strong>Nom :</strong> {user.nom}
          </p>
          <p>
            <strong>Prénom :</strong> {user.prenom}
          </p>
          <p>
            <strong>Email :</strong> {user.email}
          </p>
          <p>
            <strong>Rôle :</strong> {user.role}
          </p>
        </div>
      )}
    </div>
  )
}
