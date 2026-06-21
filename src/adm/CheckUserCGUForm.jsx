import { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'

export default function CheckUserCGUForm() {
  const [search, setSearch] = useState('')
  const [cgu, setCGU] = useState(null)

  const handleSearch = async () => {
    if (!search.trim()) {
      toast.error("Veuillez entrer l'adresse email")
      return
    }
    try {
      const res = await axios.get(
        `/api/v1/auth/admin/user/cgu?search=${search}`,
      )
      setCGU(res.data)
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

      {cgu && (
        <div>
          <p>
            <strong>Email :</strong> {cgu.email}
          </p>
          <p>
            <strong>CGU acceptée :</strong> {cgu.cguAccepted ? 'Oui' : 'Non'}
          </p>
          <p>
            <strong>Date :</strong> {cgu.cguAcceptedAt || '—'}
          </p>
        </div>
      )}
    </div>
  )
}
