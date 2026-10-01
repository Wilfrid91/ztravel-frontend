import { useState } from 'react'
import { toast } from 'react-toastify'

import axios from '../utils/axiosInstance'
import styles from '../styles/UserAccount.module.css'

export default function UserAccount() {
  const [search, setSearch] = useState('')
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSearch = async () => {
    const value = search.trim()

    if (!value) {
      toast.error('Veuillez entrer un email, un nom ou un prénom.')
      return
    }

    try {
      setLoading(true)
      setUser(null)

      const res = await axios.get(
        `/api/v1/auth/admin/user?search=${encodeURIComponent(value)}`,
      )

      console.log('USER:', res.data)

      setUser(res.data?.user || res.data?.data || null)
    } catch (err) {
      console.error('Erreur recherche utilisateur:', err)

      const status = err.response?.status
      const msg = err.response?.data?.msg || err.response?.data?.message

      if (status === 401) {
        toast.error('Session expirée, veuillez vous authentifier.')
      } else if (status === 403) {
        toast.error('Accès refusé. Administrateur requis.')
      } else if (status === 404) {
        toast.error('Aucun utilisateur trouvé.')
      } else if (status === 400) {
        toast.error('Recherche invalide.')
      } else if (status === 500) {
        toast.error('Erreur interne du serveur.')
      } else if (msg) {
        toast.error(msg)
      } else {
        toast.error('Une erreur est survenue, veuillez réessayer.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  const clearSearch = () => {
    setSearch('')
    setUser(null)
  }

  const getStatusClass = (status) => {
    const value = status?.toLowerCase()

    if (value === 'active' || value === 'actif') {
      return styles.statusActive
    }

    if (value === 'disabled' || value === 'inactive' || value === 'inactif') {
      return styles.statusDisabled
    }

    return styles.statusDefault
  }

  const getRoleClass = (role) => {
    return role?.toLowerCase() === 'admin' ? styles.roleAdmin : styles.roleUser
  }

  const getInitials = () => {
    const first = user?.prenom?.[0] || ''

    const last = user?.nom?.[0] || ''

    return `${first}${last}`.toUpperCase().slice(0, 2) || '?'
  }

  return (
    <div className={styles.container}>
      {/* =========================
          HEADER
      ========================= */}

      <div className={styles.pageHeader}>
        <div className={styles.titleRow}>
          <div className={styles.pageIcon}>👤</div>

          <div>
            <h1>Utilisateur</h1>

            <p>Rechercher et consulter les informations d'un compte.</p>
          </div>
        </div>
      </div>

      {/* =========================
          SEARCH CARD
      ========================= */}

      <div className={styles.searchCard}>
        <div className={styles.searchHeader}>
          <div>
            <h2>Rechercher un utilisateur</h2>

            <p>Recherchez par email, nom ou prénom.</p>
          </div>
        </div>

        <div className={styles.searchForm}>
          <div className={styles.searchInputWrapper}>
            <span className={styles.searchIcon}>⌕</span>

            <input
              type='text'
              placeholder='Email, nom ou prénom...'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
            />

            {search && (
              <button
                type='button'
                className={styles.clearButton}
                onClick={clearSearch}
                disabled={loading}
              >
                ×
              </button>
            )}
          </div>

          <button
            type='button'
            className={styles.searchButton}
            onClick={handleSearch}
            disabled={loading || !search.trim()}
          >
            {loading ? (
              <>
                <span className={styles.buttonLoader} />
                Recherche...
              </>
            ) : (
              <>🔍 Rechercher</>
            )}
          </button>
        </div>
      </div>

      {/* =========================
          LOADING
      ========================= */}

      {loading && (
        <div className={styles.loadingCard}>
          <div className={styles.loader} />

          <p>Recherche de l'utilisateur...</p>
        </div>
      )}

      {/* =========================
          EMPTY STATE
      ========================= */}

      {!loading && !user && (
        <div className={styles.emptyCard}>
          <div className={styles.emptyIcon}>👤</div>

          <h3>Aucun utilisateur sélectionné</h3>

          <p>
            Utilisez le champ de recherche ci-dessus pour consulter un compte
            utilisateur.
          </p>
        </div>
      )}

      {/* =========================
          USER PROFILE
      ========================= */}

      {!loading && user && (
        <div className={styles.profileCard}>
          {/* PROFILE HEADER */}

          <div className={styles.profileHeader}>
            <div className={styles.profileIdentity}>
              <div className={styles.avatar}>{getInitials()}</div>

              <div>
                <h2>
                  {user.prenom || '—'} {user.nom || ''}
                </h2>

                <p>{user.email || 'Email non renseigné'}</p>
              </div>
            </div>

            <div className={styles.profileBadges}>
              <span
                className={`${styles.statusBadge} ${getStatusClass(
                  user.status,
                )}`}
              >
                <span className={styles.statusDot} />

                {user.status || 'Inconnu'}
              </span>

              <span
                className={`${styles.roleBadge} ${getRoleClass(user.role)}`}
              >
                {user.role || 'user'}
              </span>
            </div>
          </div>

          {/* INFORMATION GRID */}

          <div className={styles.section}>
            <div className={styles.sectionTitle}>Informations personnelles</div>

            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <span>Nom</span>

                <strong>{user.nom || '—'}</strong>
              </div>

              <div className={styles.infoItem}>
                <span>Prénom</span>

                <strong>{user.prenom || '—'}</strong>
              </div>

              <div className={styles.infoItem}>
                <span>Email</span>

                <strong className={styles.emailValue}>
                  {user.email || '—'}
                </strong>
              </div>

              <div className={styles.infoItem}>
                <span>Rôle</span>

                <strong>{user.role || '—'}</strong>
              </div>
            </div>
          </div>

          {/* ACCOUNT INFORMATION */}

          <div className={styles.section}>
            <div className={styles.sectionTitle}>Informations du compte</div>

            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <span>Statut</span>

                <div>
                  <span
                    className={`${styles.statusBadge} ${getStatusClass(
                      user.status,
                    )}`}
                  >
                    <span className={styles.statusDot} />

                    {user.status || '—'}
                  </span>
                </div>
              </div>

              <div className={styles.infoItem}>
                <span>Dernière connexion</span>

                <strong>
                  {user.lastLogin
                    ? new Date(user.lastLogin).toLocaleString('fr-FR')
                    : 'Jamais connecté'}
                </strong>
              </div>

              <div className={styles.infoItem}>
                <span>Identifiant</span>

                <strong className={styles.identifier} title={user._id}>
                  {user._id || '—'}
                </strong>
              </div>

              <div className={styles.infoItem}>
                <span>Date de création</span>

                <strong>
                  {user.createdAt
                    ? new Date(user.createdAt).toLocaleString('fr-FR')
                    : '—'}
                </strong>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
