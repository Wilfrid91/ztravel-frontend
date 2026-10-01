import React, { useEffect, useMemo, useState } from 'react'
import axios from '../utils/axiosInstance'
import styles from '../styles/RefundAll.module.css'

export default function RefundAll() {
  const [refunds, setRefunds] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [providerFilter, setProviderFilter] = useState('ALL')
  const [selectedRefund, setSelectedRefund] = useState(null)

  useEffect(() => {
    const fetchRefunds = async () => {
      try {
        setLoading(true)
        setError('')

        const response = await axios.get('/api/v1/auth/admin/refund')

        console.log('REFUNDS:', response.data)

        const data = Array.isArray(response.data)
          ? response.data
          : response.data?.refunds || response.data?.data || []

        setRefunds(data)
      } catch (err) {
        console.error('Erreur récupération remboursements:', err)

        if (err.response?.status === 401) {
          setError('Session expirée. Veuillez vous reconnecter.')
        } else if (err.response?.status === 403) {
          setError('Accès refusé. Administrateur requis.')
        } else if (err.response?.status === 404) {
          setError('Aucun remboursement trouvé.')
        } else {
          setError('Erreur lors du chargement des remboursements.')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchRefunds()
  }, [])

  /*
   * Statistiques
   */
  const statistics = useMemo(() => {
    const successful = refunds.filter(
      (refund) => refund.status?.toUpperCase() === 'SUCCESSFUL',
    )

    const pending = refunds.filter((refund) =>
      ['PENDING', 'PROCESSING'].includes(refund.status?.toUpperCase()),
    )

    const totalAmount = successful.reduce(
      (total, refund) => total + Number(refund.amount || 0),
      0,
    )

    const providers = new Set(
      refunds.map((refund) => refund.provider).filter(Boolean),
    )

    return {
      total: refunds.length,
      successful: successful.length,
      pending: pending.length,
      totalAmount,
      providers: providers.size,
    }
  }, [refunds])

  /*
   * Fournisseurs disponibles
   */
  const providers = useMemo(() => {
    return [
      ...new Set(refunds.map((refund) => refund.provider).filter(Boolean)),
    ]
  }, [refunds])

  /*
   * Filtrage
   */
  const filteredRefunds = useMemo(() => {
    const query = search.toLowerCase().trim()

    return refunds.filter((refund) => {
      const matchesSearch =
        !query ||
        refund.reference?.toLowerCase().includes(query) ||
        refund.originalPaymentId?.toLowerCase().includes(query) ||
        refund.financialTransactionId?.toLowerCase().includes(query) ||
        refund.payee?.partyId?.toLowerCase().includes(query)

      const matchesStatus =
        statusFilter === 'ALL' || refund.status?.toUpperCase() === statusFilter

      const matchesProvider =
        providerFilter === 'ALL' || refund.provider === providerFilter

      return matchesSearch && matchesStatus && matchesProvider
    })
  }, [refunds, search, statusFilter, providerFilter])

  const formatAmount = (amount, currency = 'EUR') => {
    return `${Number(amount || 0).toLocaleString('fr-FR')} ${currency}`
  }

  const formatDate = (date) => {
    if (!date) return '—'

    return new Date(date).toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getStatusLabel = (status) => {
    switch (status?.toUpperCase()) {
      case 'SUCCESSFUL':
        return 'Réussi'

      case 'PENDING':
        return 'En attente'

      case 'PROCESSING':
        return 'Traitement'

      case 'FAILED':
        return 'Échec'

      default:
        return status || 'Inconnu'
    }
  }

  const getStatusClass = (status) => {
    switch (status?.toUpperCase()) {
      case 'SUCCESSFUL':
        return styles.statusSuccess

      case 'PENDING':
      case 'PROCESSING':
        return styles.statusPending

      case 'FAILED':
        return styles.statusFailed

      default:
        return styles.statusDefault
    }
  }

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner} />
          <span>Chargement des remboursements...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <strong>Erreur</strong>
          <span>{error}</span>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      {/* HEADER */}
      <div className={styles.pageHeader}>
        <div>
          <div className={styles.titleRow}>
            <h1>Remboursements</h1>

            <span className={styles.totalBadge}>{refunds.length}</span>
          </div>

          <p>Suivi et historique des remboursements</p>
        </div>
      </div>

      {/* STATISTICS */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>€</div>

          <div className={styles.statContent}>
            <span className={styles.statLabel}>Montant remboursé</span>

            <strong className={styles.statValue}>
              {formatAmount(statistics.totalAmount, refunds[0]?.currency)}
            </strong>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.successIcon}`}>✓</div>

          <div className={styles.statContent}>
            <span className={styles.statLabel}>Remboursements réussis</span>

            <strong className={styles.statValue}>
              {statistics.successful}
            </strong>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.pendingIcon}`}>◷</div>

          <div className={styles.statContent}>
            <span className={styles.statLabel}>En traitement</span>

            <strong className={styles.statValue}>{statistics.pending}</strong>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.providerIcon}`}>#</div>

          <div className={styles.statContent}>
            <span className={styles.statLabel}>Fournisseurs</span>

            <strong className={styles.statValue}>{statistics.providers}</strong>
          </div>
        </div>
      </div>

      {/* FILTERS */}
      <div className={styles.filtersCard}>
        <div className={styles.searchBox}>
          <span>⌕</span>

          <input
            type='text'
            placeholder='Rechercher une référence, transaction, téléphone...'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value='ALL'>Tous les statuts</option>

          <option value='SUCCESSFUL'>Réussis</option>

          <option value='PENDING'>En attente</option>

          <option value='PROCESSING'>Traitement</option>

          <option value='FAILED'>Échecs</option>
        </select>

        <select
          value={providerFilter}
          onChange={(e) => setProviderFilter(e.target.value)}
        >
          <option value='ALL'>Tous les fournisseurs</option>

          {providers.map((provider) => (
            <option key={provider} value={provider}>
              {provider}
            </option>
          ))}
        </select>

        {(search || statusFilter !== 'ALL' || providerFilter !== 'ALL') && (
          <button
            className={styles.resetButton}
            onClick={() => {
              setSearch('')
              setStatusFilter('ALL')
              setProviderFilter('ALL')
            }}
          >
            Réinitialiser
          </button>
        )}
      </div>

      {/* TABLE */}
      <div className={styles.tableCard}>
        <div className={styles.tableHeader}>
          <div>
            <h2>Historique</h2>
            <span>
              {filteredRefunds.length} résultat
              {filteredRefunds.length > 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {filteredRefunds.length === 0 ? (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>↔</div>

            <strong>Aucun remboursement trouvé</strong>

            <span>Modifiez vos critères de recherche.</span>
          </div>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Référence</th>
                  <th>Montant</th>
                  <th>Fournisseur</th>
                  <th>Bénéficiaire</th>
                  <th>Statut</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
                {filteredRefunds.map((refund, index) => (
                  <tr key={refund.id || refund.reference || index}>
                    <td>
                      <div className={styles.dateCell}>
                        <strong>
                          {new Date(refund.createdAt).toLocaleDateString(
                            'fr-FR',
                          )}
                        </strong>

                        <span>
                          {new Date(refund.createdAt).toLocaleTimeString(
                            'fr-FR',
                            {
                              hour: '2-digit',
                              minute: '2-digit',
                            },
                          )}
                        </span>
                      </div>
                    </td>

                    <td>
                      <div className={styles.referenceCell}>
                        <strong>{refund.reference || '—'}</strong>

                        <span>
                          {refund.originalPaymentId
                            ? `Paiement : ${refund.originalPaymentId.slice(
                                0,
                                16,
                              )}...`
                            : '—'}
                        </span>
                      </div>
                    </td>

                    <td>
                      <strong className={styles.amount}>
                        {formatAmount(refund.amount, refund.currency)}
                      </strong>
                    </td>

                    <td>
                      <span className={styles.providerBadge}>
                        {refund.provider || '—'}
                      </span>
                    </td>

                    <td>
                      <div className={styles.payeeCell}>
                        <strong>{refund.payee?.partyId || '—'}</strong>

                        <span>{refund.payee?.partyIdType || ''}</span>
                      </div>
                    </td>

                    <td>
                      <span
                        className={`${styles.status} ${getStatusClass(
                          refund.status,
                        )}`}
                      >
                        <span className={styles.statusDot} />

                        {getStatusLabel(refund.status)}
                      </span>
                    </td>

                    <td>
                      <button
                        className={styles.detailsButton}
                        onClick={() => setSelectedRefund(refund)}
                      >
                        Détails
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL DETAILS */}
      {selectedRefund && (
        <div
          className={styles.modalOverlay}
          onClick={() => setSelectedRefund(null)}
        >
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div>
                <h2>Détails du remboursement</h2>

                <span>{selectedRefund.reference}</span>
              </div>

              <button
                className={styles.closeButton}
                onClick={() => setSelectedRefund(null)}
              >
                ×
              </button>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.detailAmount}>
                <span>Montant remboursé</span>

                <strong>
                  {formatAmount(selectedRefund.amount, selectedRefund.currency)}
                </strong>
              </div>

              <div className={styles.detailGrid}>
                <div>
                  <span>Statut</span>
                  <strong>{getStatusLabel(selectedRefund.status)}</strong>
                </div>

                <div>
                  <span>Fournisseur</span>
                  <strong>{selectedRefund.provider || '—'}</strong>
                </div>

                <div>
                  <span>Date</span>
                  <strong>{formatDate(selectedRefund.createdAt)}</strong>
                </div>

                <div>
                  <span>Devise</span>
                  <strong>{selectedRefund.currency || '—'}</strong>
                </div>

                <div>
                  <span>Référence</span>
                  <strong>{selectedRefund.reference || '—'}</strong>
                </div>

                <div>
                  <span>Transaction financière</span>
                  <strong>
                    {selectedRefund.financialTransactionId || '—'}
                  </strong>
                </div>

                <div>
                  <span>Paiement original</span>
                  <strong>{selectedRefund.originalPaymentId || '—'}</strong>
                </div>

                <div>
                  <span>Bénéficiaire</span>
                  <strong>{selectedRefund.payee?.partyId || '—'}</strong>
                </div>
              </div>

              <div className={styles.messageBox}>
                <span>Message du remboursement</span>

                <p>
                  {selectedRefund.payeeMessage ||
                    selectedRefund.payeeNote ||
                    'Aucun message'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
