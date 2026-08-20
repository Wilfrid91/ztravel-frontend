import { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'

const REFUND_AMOUNT = 5999
const REFUND_CURRENCY = 'EUR'
const DEFAULT_MESSAGE = `Remboursement de ${REFUND_AMOUNT} FCFA`

export default function RefundMtn() {
  const [refundResponse, setRefundResponse] = useState(null)
  const [status, setStatus] = useState(null)
  const [phone, setPhone] = useState('')
  const [financialTransactionId, setFinancialTransactionId] = useState('')

  // Polling du statut MTN MOMO
  useEffect(() => {
    if (!refundResponse?.refundReferenceId) return

    let intervalId = setInterval(async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/v1/auth/admin/disbursement/status/${refundResponse.refundReferenceId}`,
        )

        const newStatus = res.data.status
        setStatus(newStatus)

        if (newStatus === 'PENDING') toast.info('Paiement en cours…')
        if (newStatus === 'FAILED') {
          toast.error('Le paiement a échoué. Veuillez réessayer.')
          clearInterval(intervalId)
        }
        if (newStatus === 'SUCCESSFUL') {
          toast.success('Remboursement réussi !')
          clearInterval(intervalId)

          const pdfRes = await axios.get(
            `http://localhost:5000/api/v1/auth/admin/disbursement/status/pdf/${refundResponse.refundReferenceId}`,
            { responseType: 'blob' },
          )

          const blob = pdfRes.data
          const url = URL.createObjectURL(blob)
          window.open(url, '_blank')
        }
      } catch (err) {
        console.log('Erreur statut refund:', err)
      }
    }, 3000)

    return () => clearInterval(intervalId)
  }, [refundResponse])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!/^\d{9}$/.test(phone)) {
      alert('Veuillez entrer un numéro de téléphone valide (9 chiffres).')
      return
    }

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

    try {
      const res = await axios.post(
        'http://localhost:5000/api/v1/auth/admin/disbursement/refund/mtn-momo',
        { payload },
      )

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
      <h2>Remboursement MTN MOMO</h2>

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
        <label>Financial Transaction Id</label>
        <input
          type='text'
          placeholder='40 chiffres'
          maxLength={40}
          value={financialTransactionId}
          onChange={(e) => setFinancialTransactionId(e.target.value)}
          style={{ width: '100%', padding: '10px' }}
        />
      </div>

      <div>
        <label>Numéro de téléphone</label>
        <div style={{ display: 'flex', gap: '6px' }}>
          <input
            type='text'
            value='+229'
            disabled
            style={{ width: '110px', padding: '10px' }}
          />
          <input
            type='text'
            placeholder='9 chiffres'
            maxLength={9}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
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
        readOnly
        style={{ padding: '10px' }}
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
