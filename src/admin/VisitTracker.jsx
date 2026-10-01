import { useEffect, useMemo, useState } from 'react'
import { toast } from 'react-toastify'

import axios from '../utils/axiosInstance'
import styles from '../styles/VisitTracker.module.css'

export default function VisitTracker() {
  const [visitors, setVisitors] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [selectedVisitor, setSelectedVisitor] = useState(null)

  useEffect(() => {
    const loadTracker = async () => {
      try {
        setLoading(true)

        const res = await axios.get('/api/v1/auth/admin/tracker')

        console.log('VISITOR TRACKER:', res.data)

        const data = res.data?.visitors || []

        setVisitors(data)
      } catch (err) {
        console.error('Erreur chargement tracker:', err)

        const status = err.response?.status

        if (status === 403) {
          toast.error('Accès refusé. Administrateur requis.')
        } else if (status !== 401) {
          toast.error('Impossible de charger les visiteurs.')
        }
      } finally {
        setLoading(false)
      }
    }

    loadTracker()
  }, [])

  /*
   * Recherche
   */
  const filteredVisitors = useMemo(() => {
    const query = search.trim().toLowerCase()

    if (!query) {
      return visitors
    }

    return visitors.filter((visitor) => {
      const searchableText = [
        visitor.visitorId,
        visitor.userId,
        visitor.nom,
        visitor.prenom,
        visitor.email,
        ...(visitor.pages || []),
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()

      return searchableText.includes(query)
    })
  }, [visitors, search])

  console.log(
    'FILTERED VISITORS:',
    filteredVisitors.map((v) => ({
      _id: v._id,
      visitorId: v.visitorId,
      userId: v.userId,
    })),
  )

  /*
   * Statistiques
   */
  const statistics = useMemo(() => {
    const connected = visitors.filter((visitor) => visitor.userId).length

    const anonymous = visitors.length - connected

    const totalPages = visitors.reduce(
      (total, visitor) => total + (visitor.visits || 0),
      0,
    )

    return {
      total: visitors.length,
      connected,
      anonymous,
      totalPages,
    }
  }, [visitors])

  /*
   * Date
   */
  const formatDate = (value) => {
    if (!value) return '—'

    const date = new Date(value)

    if (Number.isNaN(date.getTime())) {
      return '—'
    }

    return date.toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  /*
   * Identité visiteur
   */
  const getVisitorName = (visitor) => {
    if (visitor.prenom || visitor.nom) {
      return `${visitor.prenom || ''} ${visitor.nom || ''}`.trim()
    }

    return 'Visiteur anonyme'
  }

  /*
   * Initiales
   */
  const getInitials = (visitor) => {
    if (!visitor.prenom && !visitor.nom) {
      return 'A'
    }

    return `${visitor.prenom?.[0] || ''}${visitor.nom?.[0] || ''}`.toUpperCase()
  }

  if (loading) {
    return (
      <section className={styles.page}>
        <div className={styles.loadingCard}>
          <div className={styles.spinner} />
          <p>Chargement des visiteurs...</p>
        </div>
      </section>
    )
  }

  return (
    <section className={styles.page}>
      {/* HEADER */}
      <div className={styles.pageHeader}>
        <div>
          <span className={styles.eyebrow}>ADMINISTRATION</span>

          <h1>Visiteurs</h1>

          <p>Suivez l'activité des visiteurs sur l'application.</p>
        </div>

        <div className={styles.liveBadge}>
          <span />
          Tracking actif
        </div>
      </div>

      {/* STATISTIQUES */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>👥</div>

          <div>
            <span>Visiteurs uniques</span>
            <strong>{statistics.total}</strong>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>✓</div>

          <div>
            <span>Utilisateurs connectés</span>
            <strong>{statistics.connected}</strong>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>○</div>

          <div>
            <span>Visiteurs anonymes</span>
            <strong>{statistics.anonymous}</strong>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>◫</div>

          <div>
            <span>Pages / événements</span>
            <strong>{statistics.totalPages}</strong>
          </div>
        </div>
      </div>

      {/* TABLEAU */}
      <div className={styles.tableCard}>
        <div className={styles.tableHeader}>
          <div>
            <h2>Activité des visiteurs</h2>

            <p>
              {filteredVisitors.length} visiteur
              {filteredVisitors.length > 1 ? 's' : ''}
            </p>
          </div>

          <div className={styles.searchWrapper}>
            <span className={styles.searchIcon}>⌕</span>

            <input
              type='text'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder='Rechercher...'
            />

            {search && (
              <button
                type='button'
                onClick={() => setSearch('')}
                className={styles.clearButton}
              >
                ×
              </button>
            )}
          </div>
        </div>

        {filteredVisitors.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>⌕</div>

            <h3>Aucun visiteur trouvé</h3>

            <p>Aucun visiteur ne correspond à votre recherche.</p>
          </div>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Visiteur</th>
                  <th>Type</th>
                  <th>Pages</th>
                  <th>Visites</th>
                  <th>Première visite</th>
                  <th>Dernière activité</th>
                </tr>
              </thead>

              <tbody>
                {filteredVisitors.map((visitor, index) => {
                  const connected = Boolean(visitor.userId)

                  return (
                    <tr
                      key={visitor.visitorId}
                      onClick={() => setSelectedVisitor(visitor)}
                    >
                      <td>
                        <div className={styles.visitorCell}>
                          <div className={styles.avatar}>
                            {getInitials(visitor)}
                          </div>

                          <div>
                            <strong>{getVisitorName(visitor)}</strong>

                            {visitor.email && <span>{visitor.email}</span>}

                            {!visitor.email && visitor.visitorId && (
                              <span className={styles.visitorId}>
                                {visitor.visitorId.slice(0, 18)}
                                ...
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      <td>
                        <span
                          className={
                            connected
                              ? styles.connectedBadge
                              : styles.anonymousBadge
                          }
                        >
                          {connected ? 'Connecté' : 'Anonyme'}
                        </span>
                      </td>

                      <td>
                        <strong>
                          {visitor.distinctPages ?? visitor.pages?.length ?? 0}
                        </strong>
                      </td>

                      <td>{visitor.visits || 0}</td>

                      <td>
                        <span className={styles.date}>
                          {formatDate(visitor.firstVisit)}
                        </span>
                      </td>

                      <td>
                        <span className={styles.date}>
                          {formatDate(visitor.lastVisit)}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* DÉTAIL VISITEUR */}
      {selectedVisitor && (
        <div
          className={styles.modalOverlay}
          onClick={() => setSelectedVisitor(null)}
        >
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div>
                <span className={styles.eyebrow}>VISITEUR</span>

                <h2>{getVisitorName(selectedVisitor)}</h2>
              </div>

              <button
                type='button'
                className={styles.closeButton}
                onClick={() => setSelectedVisitor(null)}
              >
                ×
              </button>
            </div>

            <div className={styles.details}>
              <div className={styles.detailItem}>
                <span>Visitor ID</span>

                <strong>{selectedVisitor.visitorId || '—'}</strong>
              </div>

              <div className={styles.detailItem}>
                <span>User ID</span>

                <strong>{selectedVisitor.userId || 'Visiteur anonyme'}</strong>
              </div>

              <div className={styles.detailItem}>
                <span>Email</span>

                <strong>{selectedVisitor.email || '—'}</strong>
              </div>

              <div className={styles.detailItem}>
                <span>Nombre de visites</span>

                <strong>{selectedVisitor.visits || 0}</strong>
              </div>

              <div className={styles.detailItem}>
                <span>Première visite</span>

                <strong>{formatDate(selectedVisitor.firstVisit)}</strong>
              </div>

              <div className={styles.detailItem}>
                <span>Dernière activité</span>

                <strong>{formatDate(selectedVisitor.lastVisit)}</strong>
              </div>
            </div>

            <div className={styles.pagesSection}>
              <h3>Pages visitées</h3>

              <div className={styles.pagesList}>
                {(selectedVisitor.pages || []).map((page, index) => (
                  <span key={`${page}-${index}`} className={styles.pageBadge}>
                    {page}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
