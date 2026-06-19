import { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'

export default function UserAccountPage() {
  const [search, setSearch] = useState('')
  const [user, setUser] = useState(null)

  const handleSearch = async () => {
    if (!search.trim()) {
      toast.error('Veuillez entrer un texte de recherche')
      return
    }
    try {
      const res = await axios.get(`/api/v1/auth/admin/user?search=${search}`)
      setUser(res.data.user)
    } catch (error) {
      // Détection serveur éteint
      // Cas 1 : backend renvoie un message
      if (error.response?.status === 401) {
        toast.error('Session expirée, veuillez vous authentifier')
        return
      }
      if (error.response?.status === 404) {
        toast.error('Aucun utilisateur trouvé')
        return
      }

      if (error.response?.status === 400) {
        toast.error('Recherche invalide')
        return
      }
      if (error.response?.status === 500) {
        toast.error('Erreur interne du serveur')
        return
      }
      // Cas 2 : autre erreur backend
      if (error.response?.data?.msg) {
        toast.error(error.response.data.msg)
        return
      }
      // Cas 3 : erreur réseau ou inconnue
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
