import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
export default function RefundMtnForm() {
  const [fedapayData, setFedapayData] = useState(null)
  const [refundStatus, setRefundStatus] = useState(null)
  const [transactionID, setTransactionID] = useState('')
  const amount = 5999
  const currency = 'XOF' // XOF en prod
  const message = 'Remboursement de 5999 FCFA'

  const handleSubmit = async (e) => {
    e.preventDefault()

    const payload = {
      amount,
      currency,
      payerMessage: message,
      transactionId: transactionID,
    }

    console.log('Données du paiement :', payload)

    try {
      const refundRes = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/v1/auth/admin/refund/fedapay`,
        {
          payload,
        },
      )
      console.log('response from refundMomoMTN:', refundRes.data)
      setFedapayData(refundRes.data)
    } catch (error) {
      // Cas 1 : backend renvoie un message
      if (error.response?.status === 401) {
        toast.error('Session expirée, veuillez vous authentifier')
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

  // Vérification automatique du statut dès que mtnData change
  useEffect(() => {
    if (!fedapayData?.payout?.id) return

    let intervalId = null

    const checkStatus = async () => {
      try {
        const statusRes = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/api/v1/auth/admin/fedapay/status/${fedapayData.payout.id}`,
        )

        const status = statusRes.data.status
        setRefundStatus(status)

        if (status === 'PENDING') {
          toast.info('Paiement en cours…')
        }
        if (status === 'FAILED') {
          toast.error('Le paiement a échoué. Veuillez réessayer.')
          clearInterval(intervalId)
        }
        if (status === 'SUCCESSFUL') {
          toast.success('Remboursement reussi!')
          clearInterval(intervalId)
          const pdfResponse = await axios.get(
            `${process.env.REACT_APP_BASE_URL}/api/v1/auth/admin/fedapay/status/pdf/${fedapayData.payout.id}`,
            { responseType: 'blob' },
          )
          const blob = pdfResponse.data

          if (blob.type !== 'application/pdf') {
            console.warn('Type inattendu:', blob.type)
          }
          // OUVERTURE POUR TEST
          const url = URL.createObjectURL(blob)
          window.open(url, '_blank')
        }
        console.log('Refund status:', statusRes.data)
      } catch (error) {
        console.log('Erreur statut refund:', error)
      }
    }
    // Lancer le polling toutes les 3 secondes
    intervalId = setInterval(checkStatus, 3000)

    // Arrete le polling quand le composant est démonté, mtnData change ou le refund devient SUCCESSFUL ou FAILED
    return () => clearInterval(intervalId)
  }, [fedapayData])

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
      }}
    >
      <h2>Remboursement FEDAPAY</h2>

      {/* Montant */}
      <div>
        <label>Montant</label>
        <input
          type='text'
          value={`${amount} ${currency}`}
          disabled
          style={{ width: '100%', padding: '10px' }}
        />
      </div>

      {/* Numéro de téléphone */}
      <div>
        <label>Identifiant de la transaction - Transaction Id</label>
        <div style={{ display: 'flex', gap: '6px' }}>
          <input
            type='text'
            placeholder='6 chiffres'
            maxLength={6}
            value={transactionID}
            onChange={(e) => setTransactionID(e.target.value)}
            style={{ flex: 1, padding: '10px' }}
          />
        </div>
      </div>

      {/* Message */}
      <div>
        <label>Message</label>
        <textarea
          value={message}
          disabled
          style={{ width: '100%', padding: '10px', height: '80px' }}
        />
      </div>

      <input
        type='text'
        placeholder='statut du remboursement'
        value={refundStatus}
        style={{ flex: 1, padding: '10px' }}
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
