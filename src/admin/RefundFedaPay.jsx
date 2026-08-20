import { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'

const REFUND_AMOUNT = 5999
const REFUND_CURRENCY = 'XOF'
const DEFAULT_MESSAGE = `Remboursement de ${REFUND_AMOUNT} ${REFUND_CURRENCY}`

export default function RefundFedaPay() {
  const [refundResponse, setRefundResponse] = useState(null)
  const [status, setStatus] = useState(null)
  const [transactionId, setTransactionId] = useState('')

  // Polling du statut du payout FedaPay
  useEffect(() => {
    if (!refundResponse?.payout?.id) return

    let intervalId = null

    intervalId = setInterval(async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/v1/auth/admin/fedapay/status/${refundResponse.payout.id}`,
        )

        const newStatus = res.data.status
        setStatus(newStatus)

        if (newStatus === 'PENDING') {
          toast.info('Paiement en cours…')
        }

        if (newStatus === 'FAILED') {
          toast.error('Le paiement a échoué. Veuillez réessayer.')
          clearInterval(intervalId)
        }

        if (newStatus === 'SUCCESSFUL') {
          toast.success('Remboursement réussi !')
          clearInterval(intervalId)

          const pdfRes = await axios.get(
            `http://localhost:5000/api/v1/auth/admin/fedapay/status/pdf/${refundResponse.payout.id}`,
            { responseType: 'blob' },
          )

          const blob = pdfRes.data
          if (blob.type !== 'application/pdf') {
            console.warn('Type inattendu:', blob.type)
          }

          const url = URL.createObjectURL(blob)
          window.open(url, '_blank')
        }

        console.log('Refund status:', res.data)
      } catch (err) {
        console.log('Erreur statut refund:', err)
      }
    }, 3000)

    return () => clearInterval(intervalId)
  }, [refundResponse])

  const handleSubmit = async (e) => {
    e.preventDefault()

    const payload = {
      amount: REFUND_AMOUNT,
      currency: REFUND_CURRENCY,
      payerMessage: DEFAULT_MESSAGE,
      transactionId,
    }

    console.log('Données du paiement :', payload)

    try {
      const res = await axios.post(
        'http://localhost:5000/api/v1/auth/admin/refund/fedapay',
        { payload },
      )

      console.log('response from refundFedaPay:', res.data)
      setRefundResponse(res.data)
    } catch (err) {
      const status = err.response?.status
      const msg = err.response?.data?.msg

      if (status === 401)
        return toast.error('Session expirée, veuillez vous authentifier')
      if (msg) return toast.error(msg)

      toast.error('Une erreur est survenue, veuillez réessayer')
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}
    >
      <h2>Remboursement FEDAPAY</h2>

      <div>
        <label>Montant</label>
        <input
          type='text'
          value={`${REFUND_AMOUNT} ${REFUND_CURRENCY}`}
          disabled
          style={{ width: '100%', padding: '10px' }}
        />
      </div>

      <div>
        <label>Identifiant de la transaction - Transaction Id</label>
        <div style={{ display: 'flex', gap: '6px' }}>
          <input
            type='text'
            placeholder='6 chiffres'
            maxLength={6}
            value={transactionId}
            onChange={(e) => setTransactionId(e.target.value)}
            style={{ flex: 1, padding: '10px' }}
          />
        </div>
      </div>

      <div>
        <label>Message</label>
        <textarea
          value={DEFAULT_MESSAGE}
          disabled
          style={{ width: '100%', padding: '10px', height: '80px' }}
        />
      </div>

      <input
        type='text'
        placeholder='statut du remboursement'
        value={status ?? ''}
        style={{ flex: 1, padding: '10px' }}
        readOnly
      />

      <button
        type='submit'
        style={{
          padding: '12px',
          background: '#007aff',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '16px',
        }}
      >
        Procéder au remboursement
      </button>
    </form>
  )
}
