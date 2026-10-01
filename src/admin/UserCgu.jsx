import { useState } from 'react'
import { toast } from 'react-toastify'

import axios from '../utils/axiosInstance'
import styles from '../styles/UserCgu.module.css'

export default function UserCgu() {
  const [search, setSearch] = useState('')
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSearch = async () => {
    const value = search.trim()

    if (!value) {
      toast.error("Veuillez entrer l'adresse email")
      return
    }

    try {
      setLoading(true)
      setUser(null)

      const res = await axios.get(
        `/api/v1/auth/admin/user/cgu?search=${encodeURIComponent(value)}`,
      )

      console.log('USER CGU:', res.data)

      setUser(res.data?.user || res.data?.data || res.data || null)
    } catch (err) {
      console.error('Erreur récupération CGU:', err)

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

  const getInitials = () => {
    const first = user?.prenom?.[0] || ''
    const last = user?.nom?.[0] || ''

    return `${first}${last}`.toUpperCase().slice(0, 2) || '?'
  }

  const cguAccepted = user?.cguAccepted === true

  return (
    <div className={styles.container}>
      {/* =========================
          HEADER
      ========================= */}

      <div className={styles.pageHeader}>
        <div className={styles.titleRow}>
          <div className={styles.pageIcon}>📄</div>

          <div>
            <h1>Conditions Générales d'Utilisation</h1>

            <p>Vérifiez l'acceptation des CGU d'un utilisateur.</p>
          </div>
        </div>
      </div>

      {/* =========================
          SEARCH
      ========================= */}

      <div className={styles.searchCard}>
        <div className={styles.searchHeader}>
          <div>
            <h2>Rechercher un utilisateur</h2>

            <p>Entrez l'adresse email du compte à vérifier.</p>
          </div>
        </div>

        <div className={styles.searchForm}>
          <div className={styles.searchInputWrapper}>
            <span className={styles.searchIcon}>@</span>

            <input
              type='email'
              placeholder='adresse@email.com'
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

          <p>Vérification des CGU...</p>
        </div>
      )}

      {/* =========================
          EMPTY
      ========================= */}

      {!loading && !user && (
        <div className={styles.emptyCard}>
          <div className={styles.emptyIcon}>📄</div>

          <h3>Aucun utilisateur sélectionné</h3>

          <p>
            Recherchez un utilisateur pour consulter son statut d'acceptation
            des CGU.
          </p>
        </div>
      )}

      {/* =========================
          RESULT
      ========================= */}

      {!loading && user && (
        <div className={styles.resultCard}>
          {/* USER HEADER */}

          <div className={styles.userHeader}>
            <div className={styles.userIdentity}>
              <div className={styles.avatar}>{getInitials()}</div>

              <div>
                <h2>
                  {user.prenom || '—'} {user.nom || ''}
                </h2>

                <p>{user.email || 'Email non renseigné'}</p>
              </div>
            </div>
          </div>

          {/* CGU STATUS */}

          <div className={styles.cguSection}>
            <div className={styles.sectionTitle}>Statut des CGU</div>

            <div
              className={
                cguAccepted ? styles.acceptedCard : styles.notAcceptedCard
              }
            >
              <div
                className={
                  cguAccepted
                    ? styles.statusIconAccepted
                    : styles.statusIconRejected
                }
              >
                {cguAccepted ? '✓' : '!'}
              </div>

              <div className={styles.statusContent}>
                <h3>{cguAccepted ? 'CGU acceptées' : 'CGU non acceptées'}</h3>

                <p>
                  {cguAccepted
                    ? "L'utilisateur a accepté les Conditions Générales d'Utilisation."
                    : "L'utilisateur n'a pas encore accepté les Conditions Générales d'Utilisation."}
                </p>
              </div>

              <span
                className={
                  cguAccepted ? styles.acceptedBadge : styles.notAcceptedBadge
                }
              >
                {cguAccepted ? 'Acceptées' : 'Non acceptées'}
              </span>
            </div>
          </div>

          {/* DETAILS */}

          <div className={styles.detailsSection}>
            <div className={styles.sectionTitle}>Informations</div>

            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <span>Adresse email</span>

                <strong className={styles.email}>{user.email || '—'}</strong>
              </div>

              <div className={styles.infoItem}>
                <span>CGU acceptées</span>

                <strong>{cguAccepted ? 'Oui' : 'Non'}</strong>
              </div>

              <div className={styles.infoItem}>
                <span>Date d'acceptation</span>

                <strong>
                  {user.cguAcceptedAt
                    ? new Date(user.cguAcceptedAt).toLocaleString('fr-FR')
                    : '—'}
                </strong>
              </div>

              <div className={styles.infoItem}>
                <span>Identifiant utilisateur</span>

                <strong className={styles.identifier}>{user._id || '—'}</strong>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
