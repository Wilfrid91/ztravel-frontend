import { useEffect, useState } from 'react'
import axios from '../utils/axiosInstance'
import { toast } from 'react-toastify'
import styles from '../styles/RefundFedaPay.module.css'

const REFUND_AMOUNT = 5999
const REFUND_CURRENCY = 'XOF'
const DEFAULT_MESSAGE = `Remboursement de ${REFUND_AMOUNT} ${REFUND_CURRENCY}`

export default function RefundFedaPay() {
  const [refundResponse, setRefundResponse] = useState(null)
  const [status, setStatus] = useState(null)
  const [transactionId, setTransactionId] = useState('')
  const [loading, setLoading] = useState(false)

  /*
   * Polling du statut du remboursement FedaPay
   */
  useEffect(() => {
    if (!refundResponse?.payout?.id) {
      return
    }

    let intervalId
    let pendingToastDisplayed = false

    const checkStatus = async () => {
      try {
        const res = await axios.get(
          `/api/v1/auth/admin/fedapay/status/${refundResponse.payout.id}`,
        )

        const newStatus = res.data.status

        setStatus(newStatus)

        console.log('Refund status:', res.data)

        if (newStatus === 'PENDING' && !pendingToastDisplayed) {
          pendingToastDisplayed = true
          toast.info('Remboursement en cours de traitement…')
        }

        if (newStatus === 'FAILED') {
          toast.error('Le remboursement a échoué. Veuillez réessayer.')

          clearInterval(intervalId)
          setLoading(false)
        }

        if (newStatus === 'SUCCESSFUL') {
          toast.success('Remboursement effectué avec succès !')

          clearInterval(intervalId)
          setLoading(false)

          try {
            const pdfRes = await axios.get(
              `/api/v1/auth/admin/fedapay/status/pdf/${refundResponse.payout.id}`,
              {
                responseType: 'blob',
              },
            )

            const blob = pdfRes.data

            if (blob.type !== 'application/pdf') {
              console.warn('Type de fichier inattendu :', blob.type)
            }

            const url = URL.createObjectURL(blob)

            window.open(url, '_blank')

            setTimeout(() => {
              URL.revokeObjectURL(url)
            }, 10000)
          } catch (pdfError) {
            console.error('Erreur génération PDF :', pdfError)

            toast.warning(
              'Remboursement effectué, mais le reçu PDF n’a pas pu être généré.',
            )
          }
        }
      } catch (err) {
        console.error('Erreur statut refund:', err)
      }
    }

    /*
     * Vérification immédiate
     */
    checkStatus()

    /*
     * Puis toutes les 3 secondes
     */
    intervalId = setInterval(checkStatus, 3000)

    return () => {
      clearInterval(intervalId)
    }
  }, [refundResponse])

  /*
   * Soumission du remboursement
   */
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!transactionId.trim()) {
      toast.error('Veuillez saisir l’identifiant de la transaction.')
      return
    }

    if (!/^\d{6}$/.test(transactionId)) {
      toast.error('L’identifiant de transaction doit contenir 6 chiffres.')
      return
    }

    try {
      setLoading(true)
      setStatus(null)
      setRefundResponse(null)

      const payload = {
        amount: REFUND_AMOUNT,
        currency: REFUND_CURRENCY,
        payerMessage: DEFAULT_MESSAGE,
        transactionId,
      }

      console.log('Données du remboursement :', payload)

      const res = await axios.post('/api/v1/auth/admin/refund/fedapay', {
        payload,
      })

      console.log('Response RefundFedaPay:', res.data)

      setRefundResponse(res.data)

      toast.info('Demande de remboursement envoyée.')
    } catch (err) {
      console.error('Erreur remboursement FedaPay:', err)

      setLoading(false)

      const responseStatus = err.response?.status

      const msg = err.response?.data?.msg || err.response?.data?.message

      if (responseStatus === 401) {
        toast.error('Session expirée, veuillez vous authentifier.')
        return
      }

      if (responseStatus === 403) {
        toast.error('Accès refusé. Vous devez être administrateur.')
        return
      }

      if (msg) {
        toast.error(msg)
        return
      }

      toast.error('Une erreur est survenue. Veuillez réessayer.')
    }
  }

  /*
   * Nouveau remboursement
   */
  const handleReset = () => {
    setRefundResponse(null)
    setStatus(null)
    setTransactionId('')
    setLoading(false)
  }

  /*
   * Statut visuel
   */
  const getStatusInfo = () => {
    switch (status) {
      case 'SUCCESSFUL':
        return {
          label: 'Remboursement réussi',
          className: styles.statusSuccess,
          icon: '✓',
        }

      case 'FAILED':
        return {
          label: 'Remboursement échoué',
          className: styles.statusFailed,
          icon: '!',
        }

      case 'PENDING':
        return {
          label: 'Remboursement en cours',
          className: styles.statusPending,
          icon: '◷',
        }

      case 'PROCESSING':
        return {
          label: 'Traitement en cours',
          className: styles.statusPending,
          icon: '◷',
        }

      default:
        return {
          label: 'Prêt à rembourser',
          className: styles.statusDefault,
          icon: '○',
        }
    }
  }

  const statusInfo = getStatusInfo()

  return (
    <div className={styles.container}>
      {/* HEADER */}
      <div className={styles.pageHeader}>
        <div>
          <div className={styles.titleRow}>
            <div className={styles.pageIcon}>↩</div>

            <div>
              <h1>Remboursement FedaPay</h1>

              <p>
                Effectuez un remboursement sécurisé d’une transaction FedaPay.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CONTENU */}
      <div className={styles.contentGrid}>
        {/* FORMULAIRE */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div>
              <h2>Nouveau remboursement</h2>

              <p>Renseignez les informations de la transaction à rembourser.</p>
            </div>

            <span className={styles.providerBadge}>FedaPay</span>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            {/* MONTANT */}
            <div className={styles.field}>
              <label>Montant du remboursement</label>

              <div className={styles.amountBox}>
                <div>
                  <span>Montant fixe</span>

                  <strong>{REFUND_AMOUNT.toLocaleString('fr-FR')}</strong>
                </div>

                <span className={styles.currency}>{REFUND_CURRENCY}</span>
              </div>
            </div>

            {/* TRANSACTION */}
            <div className={styles.field}>
              <label htmlFor='transactionId'>Identifiant de transaction</label>

              <span className={styles.helper}>
                Saisissez les 6 chiffres de la transaction FedaPay.
              </span>

              <div className={styles.inputWrapper}>
                <span className={styles.inputIcon}>#</span>

                <input
                  id='transactionId'
                  type='text'
                  inputMode='numeric'
                  maxLength={6}
                  placeholder='Ex. 123456'
                  value={transactionId}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '')

                    setTransactionId(value)
                  }}
                  disabled={loading}
                />

                <span
                  className={
                    transactionId.length === 6
                      ? styles.validIndicator
                      : styles.counter
                  }
                >
                  {transactionId.length === 6
                    ? '✓'
                    : `${transactionId.length}/6`}
                </span>
              </div>
            </div>

            {/* MESSAGE */}
            <div className={styles.field}>
              <label>Message du remboursement</label>

              <div className={styles.messageBox}>
                <span className={styles.messageIcon}>#</span>

                <span>{DEFAULT_MESSAGE}</span>
              </div>
            </div>

            {/* ACTION */}
            <button
              type='submit'
              className={styles.submitButton}
              disabled={loading || transactionId.length !== 6}
            >
              {loading ? (
                <>
                  <span className={styles.buttonSpinner} />
                  Traitement en cours...
                </>
              ) : (
                <>
                  <span>↩</span>
                  Procéder au remboursement
                </>
              )}
            </button>
          </form>
        </div>

        {/* COLONNE DROITE */}
        <div className={styles.sideColumn}>
          {/* RÉSUMÉ */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div>
                <h2>Résumé</h2>

                <p>Informations du remboursement</p>
              </div>
            </div>

            <div className={styles.summary}>
              <div className={styles.summaryRow}>
                <span>Montant</span>

                <strong>
                  {REFUND_AMOUNT.toLocaleString('fr-FR')} {REFUND_CURRENCY}
                </strong>
              </div>

              <div className={styles.summaryRow}>
                <span>Fournisseur</span>

                <strong>FedaPay</strong>
              </div>

              <div className={styles.summaryRow}>
                <span>Type</span>

                <strong>Remboursement</strong>
              </div>

              <div className={styles.summaryRow}>
                <span>Transaction</span>

                <strong>{transactionId || '—'}</strong>
              </div>
            </div>
          </div>

          {/* STATUT */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div>
                <h2>Statut</h2>

                <p>Suivi en temps réel</p>
              </div>
            </div>

            <div className={`${styles.statusBox} ${statusInfo.className}`}>
              <div className={styles.statusIcon}>{statusInfo.icon}</div>

              <div>
                <strong>{statusInfo.label}</strong>

                <span>
                  {status ? `Code : ${status}` : 'Aucune opération en cours'}
                </span>
              </div>
            </div>

            {loading && (
              <div className={styles.polling}>
                <span className={styles.pulse} />
                Vérification automatique du statut...
              </div>
            )}
          </div>

          {/* RÉSULTAT */}
          {refundResponse && (
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div>
                  <h2>Opération</h2>

                  <p>Demande enregistrée</p>
                </div>
              </div>

              <div className={styles.operationId}>
                <span>ID du payout</span>

                <strong>{refundResponse.payout?.id || '—'}</strong>
              </div>

              <button
                type='button'
                className={styles.secondaryButton}
                onClick={handleReset}
              >
                Nouveau remboursement
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
