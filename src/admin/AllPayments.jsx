import React, { useEffect, useMemo, useState } from 'react'
import axios from '../utils/axiosInstance'
import { toast } from 'react-toastify'
import styles from '../styles/AllPayments.module.css'

export default function AllPayments() {
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [providerFilter, setProviderFilter] = useState('ALL')
  const [selectedRefund, setSelectedRefund] = useState(null)

  useEffect(() => {
    const fetchAllPayments = async () => {
      try {
        setLoading(true)
        setError('')

        const response = await axios.get('/api/v1/auth/admin/transactions')

        console.log('PAYMENTS:', response.data)

        const data = Array.isArray(response.data)
          ? response.data
          : response.data?.transactions || response.data?.data || []

        setPayments(data)
      } catch (err) {
        console.error('Erreur récupération transactions:', err)

        if (err.response?.status === 401) {
          setError('Session expirée. Veuillez vous reconnecter.')
        } else if (err.response?.status === 403) {
          setError('Accès refusé. Administrateur requis.')
        } else if (err.response?.status === 404) {
          setError('Aucune transaction trouvée.')
        } else {
          setError('Erreur lors du chargement des transactions.')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchAllPayments()
  }, [])

  /*
   * Valeurs disponibles pour le filtre fournisseur
   */
  const providers = useMemo(() => {
    const values = payments
      .map(
        (payment) =>
          payment?.brand ||
          payment?.provider ||
          payment?.paymentProvider ||
          payment?.method,
      )
      .filter(Boolean)

    return [...new Set(values)]
  }, [payments])

  /*
   * Valeurs disponibles pour le filtre statut
   */
  const statuses = useMemo(() => {
    const values = payments.map((payment) => payment?.status).filter(Boolean)

    return [...new Set(values)]
  }, [payments])

  /*
   * Filtrage + recherche
   */
  const filteredPayments = useMemo(() => {
    const query = search.trim().toLowerCase()

    return payments.filter((payment) => {
      if (!payment) return false

      const status = String(payment.status || '').toUpperCase()

      const provider = String(
        payment.brand ||
          payment.provider ||
          payment.paymentProvider ||
          payment.method ||
          '',
      ).toLowerCase()

      const searchableText = [
        payment.transactionId,
        payment.transactionID,
        payment._id,
        payment.customerEmail,
        payment.email,
        payment.number,
        payment.phone,
        payment.country,
        payment.region,
        payment.method,
        payment.brand,
        payment.provider,
        payment.status,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()

      const matchesSearch = !query || searchableText.includes(query)

      const matchesStatus = statusFilter === 'ALL' || status === statusFilter

      const matchesProvider =
        providerFilter === 'ALL' || provider === providerFilter.toLowerCase()

      return matchesSearch && matchesStatus && matchesProvider
    })
  }, [payments, search, statusFilter, providerFilter])

  /*
   * Format montant
   */
  const formatAmount = (payment) => {
    const amount = payment?.amount ?? payment?.montant ?? payment?.totalAmount

    if (amount === undefined || amount === null) {
      return '—'
    }

    const numericAmount = Number(amount)

    if (Number.isNaN(numericAmount)) {
      return String(amount)
    }

    return numericAmount.toLocaleString('fr-FR')
  }

  /*
   * Format date
   */
  const formatDate = (value) => {
    if (!value) return '—'

    const date = new Date(value)

    if (Number.isNaN(date.getTime())) {
      return '—'
    }

    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  /*
   * Statut visuel
   */
  const getStatusClass = (status) => {
    const value = String(status || '').toUpperCase()

    if (
      value === 'SUCCESS' ||
      value === 'SUCCESSFUL' ||
      value === 'COMPLETED' ||
      value === 'PAID'
    ) {
      return styles.statusSuccess
    }

    if (value === 'PENDING' || value === 'PROCESSING') {
      return styles.statusPending
    }

    if (value === 'FAILED' || value === 'ERROR' || value === 'CANCELLED') {
      return styles.statusFailed
    }

    return styles.statusDefault
  }

  /*
   * État loading
   */
  if (loading) {
    return (
      <section className={styles.page}>
        <div className={styles.loadingCard}>
          <div className={styles.spinner} />
          <p>Chargement des transactions...</p>
        </div>
      </section>
    )
  }

  /*
   * Erreur
   */
  if (error) {
    return (
      <section className={styles.page}>
        <div className={styles.errorCard}>
          <div className={styles.errorIcon}>!</div>

          <div>
            <h2>Impossible de charger les transactions</h2>
            <p>{error}</p>
          </div>
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

          <h1>Paiements</h1>

          <p>Consultez et filtrez l'ensemble des transactions effectuées.</p>
        </div>

        <div className={styles.totalCard}>
          <span>Total</span>
          <strong>{payments.length}</strong>
          <small>transactions</small>
        </div>
      </div>

      {/* FILTRES */}
      <div className={styles.filtersCard}>
        <div className={styles.searchWrapper}>
          <span className={styles.searchIcon}>⌕</span>

          <input
            type='text'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder='Rechercher une transaction, un email, un téléphone...'
          />

          {search && (
            <button
              type='button'
              className={styles.clearButton}
              onClick={() => setSearch('')}
            >
              ×
            </button>
          )}
        </div>

        <div className={styles.filterGroup}>
          <label>Statut</label>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value='ALL'>Tous les statuts</option>

            {statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label>Fournisseur</label>

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
        </div>

        <button
          type='button'
          className={styles.resetButton}
          onClick={() => {
            setSearch('')
            setStatusFilter('ALL')
            setProviderFilter('ALL')
          }}
        >
          Réinitialiser
        </button>
      </div>

      {/* TABLE */}
      <div className={styles.tableCard}>
        <div className={styles.tableHeader}>
          <div>
            <h2>Historique des paiements</h2>
            <p>
              {filteredPayments.length} résultat
              {filteredPayments.length > 1 ? 's' : ''}
            </p>
          </div>

          <span className={styles.resultBadge}>{filteredPayments.length}</span>
        </div>

        {filteredPayments.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>⌕</div>

            <h3>Aucune transaction trouvée</h3>

            <p>Aucune transaction ne correspond aux critères sélectionnés.</p>
          </div>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Transaction ID</th>
                  <th>Montant</th>
                  <th>Statut</th>
                  <th>Fournisseur</th>
                  <th>Pays</th>
                  <th>Téléphone</th>
                  <th>Email</th>
                  <th>Région</th>
                </tr>
              </thead>

              <tbody>
                {filteredPayments.map((payment, index) => {
                  const transactionId =
                    payment.transactionId ||
                    payment.transactionID ||
                    payment._id ||
                    '—'

                  const provider =
                    payment.brand ||
                    payment.provider ||
                    payment.paymentProvider ||
                    payment.method ||
                    '—'

                  return (
                    <tr
                      key={payment._id || payment.transactionId || index}
                      onClick={() => setSelectedRefund(payment)}
                    >
                      <td>
                        <span className={styles.date}>
                          {formatDate(
                            payment.createdAt ||
                              payment.date ||
                              payment.created,
                          )}
                        </span>
                      </td>

                      <td>
                        <span className={styles.transactionId}>
                          {transactionId}
                        </span>
                      </td>

                      <td>
                        <strong className={styles.amount}>
                          {formatAmount(payment)}
                        </strong>

                        {payment.currency && (
                          <span className={styles.currency}>
                            {payment.currency}
                          </span>
                        )}
                      </td>

                      <td>
                        <span
                          className={`${styles.status} ${getStatusClass(
                            payment.status,
                          )}`}
                        >
                          <span className={styles.statusDot} />

                          {payment.status || 'Inconnu'}
                        </span>
                      </td>

                      <td>
                        <span className={styles.provider}>{provider}</span>
                      </td>

                      <td>{payment.country || '—'}</td>

                      <td>
                        {payment.number ||
                          payment.phone ||
                          payment.phoneNumber ||
                          '—'}
                      </td>

                      <td>
                        <span className={styles.email}>
                          {payment.customerEmail || payment.email || '—'}
                        </span>
                      </td>

                      <td>{payment.region || '—'}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* DETAIL TRANSACTION */}
      {selectedRefund && (
        <div
          className={styles.modalOverlay}
          onClick={() => setSelectedRefund(null)}
        >
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div>
                <span className={styles.eyebrow}>TRANSACTION</span>

                <h2>Détails du paiement</h2>
              </div>

              <button
                type='button'
                className={styles.closeButton}
                onClick={() => setSelectedRefund(null)}
              >
                ×
              </button>
            </div>

            <div className={styles.detailsGrid}>
              <div className={styles.detailItem}>
                <span>Transaction ID</span>
                <strong>
                  {selectedRefund.transactionId ||
                    selectedRefund.transactionID ||
                    selectedRefund._id ||
                    '—'}
                </strong>
              </div>

              <div className={styles.detailItem}>
                <span>Montant</span>
                <strong>
                  {formatAmount(selectedRefund)} {selectedRefund.currency || ''}
                </strong>
              </div>

              <div className={styles.detailItem}>
                <span>Statut</span>
                <strong>{selectedRefund.status || '—'}</strong>
              </div>

              <div className={styles.detailItem}>
                <span>Fournisseur</span>
                <strong>
                  {selectedRefund.brand ||
                    selectedRefund.provider ||
                    selectedRefund.paymentProvider ||
                    selectedRefund.method ||
                    '—'}
                </strong>
              </div>

              <div className={styles.detailItem}>
                <span>Email</span>
                <strong>
                  {selectedRefund.customerEmail || selectedRefund.email || '—'}
                </strong>
              </div>

              <div className={styles.detailItem}>
                <span>Téléphone</span>
                <strong>
                  {selectedRefund.number ||
                    selectedRefund.phone ||
                    selectedRefund.phoneNumber ||
                    '—'}
                </strong>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
