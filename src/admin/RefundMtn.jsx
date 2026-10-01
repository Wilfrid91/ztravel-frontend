import { useEffect, useState } from 'react'
import axios from '../utils/axiosInstance'
import { toast } from 'react-toastify'
import styles from '../styles/RefundMtn.module.css'

const REFUND_AMOUNT = 5999
const REFUND_CURRENCY = 'XOF'
const DEFAULT_MESSAGE = `Remboursement de ${REFUND_AMOUNT} ${REFUND_CURRENCY}`

export default function RefundMtn() {
  const [refundResponse, setRefundResponse] = useState(null)
  const [status, setStatus] = useState(null)

  const [phone, setPhone] = useState('')
  const [financialTransactionId, setFinancialTransactionId] = useState('')

  const [loading, setLoading] = useState(false)

  /*
   * ============================
   * POLLING DU STATUT MTN MOMO
   * ============================
   */

  useEffect(() => {
    if (!refundResponse?.refundReferenceId) {
      return
    }

    let intervalId
    let pendingToastDisplayed = false

    const checkStatus = async () => {
      try {
        const res = await axios.get(
          `/api/v1/auth/admin/disbursement/status/${refundResponse.refundReferenceId}`,
        )

        const newStatus = res.data.status

        setStatus(newStatus)

        console.log('MTN refund status:', res.data)

        /*
         * EN ATTENTE
         */
        if (newStatus === 'PENDING' && !pendingToastDisplayed) {
          pendingToastDisplayed = true

          toast.info('Remboursement MTN MoMo en cours...')
        }

        /*
         * ÉCHEC
         */
        if (newStatus === 'FAILED') {
          toast.error('Le remboursement MTN MoMo a échoué.')

          clearInterval(intervalId)
          setLoading(false)
        }

        /*
         * SUCCÈS
         */
        if (newStatus === 'SUCCESSFUL') {
          toast.success('Remboursement MTN MoMo effectué avec succès !')

          clearInterval(intervalId)
          setLoading(false)

          /*
           * Récupération du reçu PDF
           */
          try {
            const pdfRes = await axios.get(
              `/api/v1/auth/admin/disbursement/status/pdf/${refundResponse.refundReferenceId}`,
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
            console.error('Erreur récupération PDF :', pdfError)

            toast.warning(
              'Le remboursement est réussi, mais le reçu PDF n’a pas pu être généré.',
            )
          }
        }
      } catch (err) {
        console.error('Erreur statut remboursement MTN :', err)
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
   * ============================
   * SOUMISSION
   * ============================
   */

  const handleSubmit = async (e) => {
    e.preventDefault()

    /*
     * Validation téléphone
     */
    if (!/^\d{9}$/.test(phone)) {
      toast.error('Veuillez entrer un numéro MTN valide de 9 chiffres.')

      return
    }

    /*
     * Validation Financial Transaction ID
     */
    if (!/^\d{40}$/.test(financialTransactionId)) {
      toast.error(
        'Le Financial Transaction ID doit contenir exactement 40 chiffres.',
      )

      return
    }

    try {
      setLoading(true)
      setStatus(null)
      setRefundResponse(null)

      const payload = {
        amount: REFUND_AMOUNT,

        currency: REFUND_CURRENCY,

        payer: {
          partyIdType: 'MSISDN',
          partyId: `229${phone}`,
        },

        payerMessage: DEFAULT_MESSAGE,

        payeeNote: 'Merci',

        financialTransactionId,
      }

      console.log('Données remboursement MTN :', payload)

      const res = await axios.post(
        '/api/v1/auth/admin/disbursement/refund/mtn-momo',
        {
          payload,
        },
      )

      console.log('Response RefundMtn:', res.data)

      setRefundResponse(res.data)

      toast.info('Demande de remboursement MTN envoyée.')
    } catch (err) {
      console.error('Erreur remboursement MTN :', err)

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
   * ============================
   * NOUVEAU REMBOURSEMENT
   * ============================
   */

  const handleReset = () => {
    setRefundResponse(null)
    setStatus(null)
    setPhone('')
    setFinancialTransactionId('')
    setLoading(false)
  }

  /*
   * ============================
   * STATUT VISUEL
   * ============================
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
      {/* =========================
          HEADER
      ========================= */}

      <div className={styles.pageHeader}>
        <div className={styles.titleRow}>
          <div className={styles.pageIcon}>↩</div>

          <div>
            <h1>Remboursement MTN MoMo</h1>

            <p>Effectuez un remboursement sécurisé vers un compte MTN MoMo.</p>
          </div>
        </div>
      </div>

      {/* =========================
          CONTENU
      ========================= */}

      <div className={styles.contentGrid}>
        {/* =========================
            FORMULAIRE
        ========================= */}

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div>
              <h2>Nouveau remboursement</h2>

              <p>Renseignez les informations du remboursement MTN MoMo.</p>
            </div>

            <span className={styles.providerBadge}>MTN MoMo</span>
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

            {/* FINANCIAL TRANSACTION ID */}

            <div className={styles.field}>
              <label htmlFor='financialTransactionId'>
                Financial Transaction ID
              </label>

              <span className={styles.helper}>
                Identifiant financier de la transaction MTN MoMo.
              </span>

              <div className={styles.inputWrapper}>
                <span className={styles.inputIcon}>#</span>

                <input
                  id='financialTransactionId'
                  type='text'
                  inputMode='numeric'
                  maxLength={40}
                  placeholder='40 chiffres'
                  value={financialTransactionId}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '')

                    setFinancialTransactionId(value)
                  }}
                  disabled={loading}
                />

                <span
                  className={
                    financialTransactionId.length === 40
                      ? styles.validIndicator
                      : styles.counter
                  }
                >
                  {financialTransactionId.length === 40
                    ? '✓'
                    : `${financialTransactionId.length}/40`}
                </span>
              </div>
            </div>

            {/* TELEPHONE */}

            <div className={styles.field}>
              <label htmlFor='phone'>Numéro de téléphone MTN</label>

              <span className={styles.helper}>
                Numéro du bénéficiaire du remboursement.
              </span>

              <div className={styles.phoneWrapper}>
                <div className={styles.countryCode}>+229</div>

                <input
                  id='phone'
                  type='text'
                  inputMode='numeric'
                  maxLength={9}
                  placeholder='Ex. 22955555555'
                  value={phone}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '')

                    setPhone(value)
                  }}
                  disabled={loading}
                />

                <span
                  className={
                    phone.length === 9 ? styles.validIndicator : styles.counter
                  }
                >
                  {phone.length === 9 ? '✓' : `${phone.length}/9`}
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

            {/* BOUTON */}

            <button
              type='submit'
              className={styles.submitButton}
              disabled={
                loading ||
                phone.length !== 9 ||
                financialTransactionId.length !== 40
              }
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

        {/* =========================
            COLONNE DROITE
        ========================= */}

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

                <strong>MTN MoMo</strong>
              </div>

              <div className={styles.summaryRow}>
                <span>Pays</span>

                <strong>Bénin (+229)</strong>
              </div>

              <div className={styles.summaryRow}>
                <span>Téléphone</span>

                <strong>{phone ? `+229 ${phone}` : '—'}</strong>
              </div>

              <div className={styles.summaryRow}>
                <span>Transaction</span>

                <strong>
                  {financialTransactionId ? financialTransactionId : '—'}
                </strong>
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

          {/* OPÉRATION */}

          {refundResponse && (
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div>
                  <h2>Opération</h2>

                  <p>Demande enregistrée</p>
                </div>
              </div>

              <div className={styles.operationId}>
                <span>Référence du remboursement</span>

                <strong>{refundResponse.refundReferenceId || '—'}</strong>
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
