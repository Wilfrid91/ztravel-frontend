import { use, useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import axios from 'axios'

/**
 * 
 * @returns Les query params ne font PAS partie du path.  
👉 Ils sont lus via useSearchParams() ou useLocation().
 */
const FedaPayPaymentProcessing = () => {
  // `${process.env.BASE_URL_FRONT}/payment-processing?reference=${reference}`,
  const [searchParams] = useSearchParams()
  const transactionId = searchParams.get('transactionId')
  const navigate = useNavigate()

  console.log('REFERENCE =', transactionId)

  useEffect(() => {
    if (!transactionId) return

    const interval = setInterval(async () => {
      try {
        const res = await axios.get(`/api/v1/payment/fedapay/${transactionId}`)

        console.log('STATUS =', res.data.status)

        if (res.data.status === 'approved') {
          clearInterval(interval)
          navigate('/avd-simulator')
        }

        if (res.data.status === 'failed') {
          clearInterval(interval)
          navigate('/payment-error')
        }
      } catch (error) {
        console.error('Erreur polling:', error)
      }
    }, 2000)

    // Nettoyage du polling
    return () => clearInterval(interval)
  }, [transactionId, navigate])

  return (
    <div className='app-container'>
      {' '}
      <h1>Paiement en cours…</h1>
      <p>Référence : {transactionId}</p>
    </div>
  )
}

export default FedaPayPaymentProcessing
